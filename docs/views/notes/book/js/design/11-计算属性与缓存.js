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
    // 缓存上一次计算的值
    let value
    // 用来标识是否需要重新计算值，为 true 则意味着脏，需要计算
    let dirty = true
    // 把 getter 作为副作用函数，创建一个 lazy 的 effect
    const effectFn = effect(getter, {
        lazy: true,
        scheduler() {
            // 当依赖的响应式数据变化时，把 dirty 置为 true
            if (!dirty) {
                dirty = true
                // 当计算属性依赖的响应式数据变化时，手动调用 trigger 函数触发响应
                trigger(obj,'value')
            }
        }
    })
    const obj = {
        get value() {
            // 只有脏的时候才计算值并缓存到 value 中
            if (dirty) {
                value = effectFn()
                // 计算后把 dirty 置为 false，下次访问直接使用缓存到 value 中的值
                dirty = false
                // 当读取 value 时，手动调用 track 函数追踪依赖关系
                track(obj,'value')
            }
            return value
        }
    }
    return obj
}
const sumRes = computed(() => obj.foo + obj.bar)

console.log(sumRes.value); // 3
obj.foo++
console.log(sumRes.value); // 4
