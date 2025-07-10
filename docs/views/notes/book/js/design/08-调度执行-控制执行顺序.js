const bucket = new WeakMap()
const data = { foo: 1 }
let activeEffect
const effectStack = []

const effect = (fn,options = {}) => {
    const effectFn = () => {
        clearUp(effectFn)
        activeEffect = effectFn
        effectStack.push(effectFn)
        fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
    }
    effectFn.options = options // 新增
    effectFn.deps = []
    effectFn()
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
        // 新增
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


effect(() => {
    console.log(obj.foo);
},{
    scheduler(fn) {
        setTimeout(fn)
    }
})
obj.foo++
console.log('结束了')
