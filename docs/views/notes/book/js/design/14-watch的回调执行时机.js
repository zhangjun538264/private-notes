const bucket = new WeakMap()
const data = { foo: 1 }
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

function traverse(value, seen = new Set()) {
    if (typeof value !== 'object' || value === null || seen.has(value)) return
    seen.add(value)
    for (const k in value) {
        traverse(value[k], seen)
    }
    return value
}

const watch = (source,cb,options = {}) => {
    let getter
    if (typeof source === 'function') {
        getter = source
    } else {
        getter = () => traverse(source)
    }
    let oldValue, newValue
    const job = () => {
        newValue = effectFn()
        cb(newValue, oldValue)
        oldValue = newValue
    }
    const effectFn = effect(() => getter(),{
        lazy: true,
        scheduler: () => {
            // 在调度函数中判断 flush 是否为 'post'，如果是，将其放到微任务队列中执行
            if (options.flush === 'post') {
                const p = Promise.resolve()
                p.then(job)
            } else {
                job()
            }
        }
    })
    if (options.immediate) {
        job()
    } else {
        oldValue = effectFn()
    }
}

watch(() => obj.foo, (newValue,oldValue) => {
    console.log(newValue); // 1
    console.log(oldValue); // undefined
},{
    flush: 'post',
})