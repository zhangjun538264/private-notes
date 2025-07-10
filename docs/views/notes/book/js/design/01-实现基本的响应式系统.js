const bucket = new Set()

const data = { text: 'hello' }

const obj = new Proxy(data, {
    get(target, key) {
        bucket.add(effect)
        return target[key]
    },
    set(target, key, value) {
        target[key] = value
        bucket.forEach(fn => fn())
    }
})

const effect = () => {
    document.getElementById('app').innerHTML = obj.text
}
effect()
setTimeout(() => {
    obj.text = 'hello vue3'
},2000)
