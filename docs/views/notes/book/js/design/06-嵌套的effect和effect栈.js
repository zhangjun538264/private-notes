const bucket = new WeakMap()
const data = { foo: true, bar: true }
let activeEffect
const effectStack = [] // effect 栈

const effect = (fn) => {
    const effectFn = () => {
        clearUp(effectFn)
        activeEffect = effectFn
        // 在调用副作用函数之前将当前副作用函数压入栈中
        effectStack.push(effectFn) // 新增
        fn()
        // 新增
        effectStack.pop() // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并把 activeEffect 还原为之前的值
        activeEffect = effectStack[effectStack.length - 1]
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

let temp1,temp2
effect(function effectFn1() {
    console.log("effectFn1执行了");
    effect(function effectFn2() {
        console.log("effectFn2执行了");
        temp2 = obj.bar
    })
    temp1 = obj.foo
})