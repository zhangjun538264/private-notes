const bucket = new Set()

const data = { text: 'hello' }

let activeEffect

const obj = new Proxy(data, {
    get(target, key) {
        if (activeEffect) bucket.add(activeEffect)
        return target[key]
    },
    set(target, key, value) {
        target[key] = value
        bucket.forEach(fn => fn())
    }
})

const effect = (fn) => {
    activeEffect = fn
    fn()
}
effect(() => {
    document.getElementById('app').innerHTML = obj.text
})
setTimeout(() => {
    obj.text = 'hello vue3'
},2000)
