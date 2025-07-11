const bucket = new WeakMap()
const data = { foo: 1, bar: 2 }
let activeEffect
const effectStack = []

const effect = (fn,options = {}) => {
    const effectFn = () => {
        clearUp(effectFn)
        activeEffect = effectFn
        effectStack.push(effectFn)
        // 新增, 将 fn 的执行结果存储到 res 中
        const res = fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
        //新增， 将 res 作为 effectFn 的返回值
        return res
    }
    effectFn.options = options
    effectFn.deps = []
    // 新增
    if (!options.lazy) {
        effectFn()
    }
    // 新增, 将副作用函数作为返回值返回
    return effectFn
}

const obj = new Proxy(data, {
    get(target,key) {
        track(target, key)
        return target[key]
    },
    set(target, key,value) {
        target[key] = value
        trigger(target, key)
        return true
    }
})

function track(target, key) {
    if (!activeEffect) return
    let depsMap = bucket.get(target)
    if (!depsMap) {
        depsMap = new Map()
        bucket.set(target,depsMap)
    }
    let deps = depsMap.get(key)
    if (!deps) {
        deps = new Set()
        depsMap.set(key, deps)
    }
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
}

function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)
    const effectsToRun = new Set(effects)
    // effects && effects.forEach(fn => fn())
    effectsToRun.forEach(effectFn => {
        if (effectFn.options.scheduler) {
            effectFn.options.scheduler(effectFn)
        } else {
            if (activeEffect !== effectFn)  {
                effectFn()
            }
        }
    })
}

function clearUp(effectFn) {
    for(let i = 0; i < effectFn.deps.length; i++) {
        const deps = effectFn.deps[i]
        deps.delete(effectFn)
    }
    effectFn.deps.length = 0
}

const jobQueue = new Set()
const p = Promise.resolve()
let isFlushing = false
const flushJob = () => {
    if (isFlushing) return
    isFlushing = true
    p.then(() => {
        jobQueue.forEach(job => job())
    }).finally(() => {
        isFlushing = false
    })
}

const computed = (getter) => {

    const effectFn = effect(getter, {lazy: true})
    return {
        get value() {
            return effectFn()
        }
    }
}
const sumRes = computed(() => obj.foo + obj.bar)
console.log(sumRes.value); // 3