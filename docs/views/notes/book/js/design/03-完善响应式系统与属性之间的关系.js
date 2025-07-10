// 明确 effect 副作用函数与被操作目标(属性)之间的联系
const bucket = new WeakMap()
const data = { text: 'hello' }
// 用一个全局变量存储被注册的副作用函数
let activeEffect
// effect 函数用于注册副作用函数
const effect = (fn) => {
    activeEffect = fn
    fn()
}

const obj = new Proxy(data, {
    get(target, key) {
        // 没有 activeEffect 直接返回
        if (!activeEffect) return target[key]
        // 根据 target 从桶中取出 depsMap，它也是一个 Map 类型：
        let depsMap = bucket.get(target)
        // 如果不存在 depsMap，那么新建一个 Map 并与 target 关联
        if (!depsMap) {
            depsMap = new Map()
            bucket.set(target, depsMap)
        }
        // 再根据 key 从 depsMap 中取出 deps 数组，它是一个 Set 类型
        let deps = depsMap.get(key)
        // 如果 deps 不存在，同样新建一个 Set 并与 key 关联
        if (!deps) {
            deps = new Set()
            depsMap.set(key, deps)
        }
        deps.add(activeEffect)
        return target[key]
    },
    set(target, key, value) {
        target[key] = value
        // 根据 target 从桶中取出 depsMap，它是 key --> effects
        const depsMap = bucket.get(target)
        // 找不到依赖直接返回
        if (!depsMap) return true
        // 根据 key 取出所有副作用函数 effects
        const effects = depsMap.get(key)
        // 执行副作用函数
        effects && effects.forEach(fn => fn())
        return true
    }
})

effect(() => {
    document.getElementById('app').innerHTML = obj.text
})

setTimeout(() => {
    obj.text = 'hello vue3' // 打印了两次
    // obj.text1 = 'hello vue3' // 只打印了一次
},2000)
