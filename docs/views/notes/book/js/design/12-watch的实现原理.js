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
    // 新增：判断数据是否是原始值，如果是，什么都不做
    if (typeof value !== 'object' || value === null || seen.has(value)) return
    // 将数据添加到 seen 中，代表遍历地读取过了，避免循环引用引起的死循环
    seen.add(value)
    // 暂时不考虑数组等其他结构
    // 假设 value 就是一个对象，使用 for...in 读取对象的每一个值，并递归地调用 traverse 进行处理
    for (const k in value) {
        traverse(value[k], seen)
    }
    return value
}

const watch = (source,cb) => {
    // 定义 getter
    let getter
    // 如果 source 是函数，说明用户传递的是 getter，所以直接把 source 赋值给 getter
    if (typeof source === 'function') {
        getter = source
    } else {
        // 否则按照原来的实现调用 traverse 递归地读取
        getter = () => traverse(source)
    }
    // 定义新值和旧值
    let oldValue, newValue
    // 使用 effect 注册副作用函数时，开启 lazy 选项，并把返回值存储到 effectFn 中以便后续手动调用
    const effectFn = effect(() => getter(),{
        lazy: true,
        scheduler() {
            // 在 scheduler 中重新执行副作用函数，得到的是新值
            newValue = effectFn()
            // 把旧值和新值作为回调函数的参数
            cb(newValue, oldValue)
            // 更新旧值，不然下一次会得到错误的旧值
            oldValue = effectFn()
        }
    })
    oldValue = effectFn()
}

// watch 的第一个参数是响应式数据
watch(() => obj.foo, (newValue,oldValue) => {
    console.log(newValue); // 2
    console.log(oldValue); // 1
})
obj.foo++