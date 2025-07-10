const bucket = new WeakMap()
const data = { text: 'hello world',ok: true }
let activeEffect

const effect = (fn) => {
    const effectFn = () => {
        clearUp(effectFn)
        activeEffect = effectFn
        fn()
    }
    effectFn.deps = [] // 依赖集合, activeEffect 也拥有了 deps 属性
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

effect(() => {
    document.getElementById('app').innerText = obj.ok ? obj.text : 'not'
})

setTimeout(() => {
    obj.ok = false
},2000)

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
    effectsToRun.forEach(effectFn => effectFn())
}

function clearUp(effectFn) {
    for(let i = 0; i < effectFn.deps.length; i++) {
        const deps = effectFn.deps[i]
        deps.delete(effectFn)
    }
    effectFn.deps.length = 0
}
