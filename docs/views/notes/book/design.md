## 第一章 权衡的艺术

### 命令式和声明式
- 命令式: 关注过程
```javascript
const div = document.querySelector('div'); // 获取 div
div.innerText = 'Hello, World!'; // 设置 div 的文本内容
div.addEventListener('click', () => alert('ok')); // 绑定点击事件
```
- 声明式: 关注结果
```javascript
<div @click="() => () => alert('ok')">Hello, World</div>
```
### 性能与可维护性的权衡
- 性能消耗：
  - 命令式: 直接修改 `innerText` 的性能消耗。
  - 声明式: 找出差异 + 直接修改的新能消耗。
- 可维护性:
  - 命令式: 需要维护实现目标的整个过程，包括要手动完成 `DOM` 元素的创建、更新、删除等工作。
  - 声明式: 展示的就是要的结果，看上去更加直观。
:::tip 总结
  - 性能：命令式 > 声明式
  - 可维护性：声明式 >> 命令式
:::
### 虚拟 `DOM` 的性能如何
:::tip 原生 javascript、innerHTML 模版 和 虚拟 DOM 的性能对比
- 心智负担：虚拟 DOM < innerHTML < 原生 javascript
- 性能：innerHTML < 虚拟 DOM < 原生 javascript
- 可维护性：原生 javascript < innerHTML < 虚拟 DOM
:::
### 运行时和编译时
- 运行时: `runtime` 程序在运行过程中执行的代码。利用`render`函数把虚拟`DOM`转化为真实`DOM`。
  - 没有编译过程，无法分析用户提供的内容
- 编译时: `compile` 程序在编译过程中执行的代码。把`template`模板中的内容转化为虚拟`DOM`元素。
    - 可以分析用户提供的内容，没有运行时的性能消耗。如 `Svelte` 
- 运行时 + 编译时: 先把`template`模版中的内容转化为虚拟`DOM`，再利用`render`函数把虚拟`DOM`转化为真实`DOM`。如`Vue`
  - 编译时：分析用户提供的内容
  - 运行时：提供足够的灵活性

## 第二章 框架设计的核心要素
### 提升用户的开发体验
- 心智负担低：如提供必要的警告信息，提示用户可能存在的问题。
- 便于调试: 如控制台直观的数据打印
### 控制代码体积
- `__DEV__`：在不同环境下, 会有不同的代码。
  - 开发环境：`__DEV__` 为 `true`，会有一些额外的代码，如警告信息，便于调试。
  - 生产环境：`__DEV__` 为 `false`，会有一些代码被移除,不会打包到最终资源中，如警告信息。
  - 代码体积：开发环境 > 生产环境
- 良好的`Tree-Shaking`：只打包用到的代码，不会打包不需要的代码。

:::tip 如何实现`Tree-Shaking`

模块必须是 `ESM（ES Module）`，因为 `Tree-Shaking` 依赖 `ESM` 的静态结构。

注意：如果一个函数调用会产生副作用，那么就不能将其移除。

什么是副作用？
  - 简单地说，副作用就是，当调用函数的时候会对外部产生影响，例如修改 了全局变量。
  - 使用` /*#__PURE__*/`注释, 告诉构建工具函数的调用不会产生副作用，可以放心地对其进行`Tree-Shaking`。
:::

### 输出不同的构建产物
- 根据开发环境和生产环境输出不同的包
  - `vue.global.js` 用于开发环境，它包含必要的警告信息
  - `vue.global.prod.js` 用于生产环境，不包含警告信息
- 根据使用场景的不同而输出其他形式的产物
<img src="..\img\img.png" width="406" height="588"/>

### 错误处理
- 统一的错误处理接口：callWithErrorHandling

## 第三章 Vue.js 3的设计思路

### 声明式的描述 UI
```javascript
<div :id="id" :class="class" @click="handler">Hello World</div>
```

### 初识渲染器
- 作用: 把虚拟`DOM`转化为真实`DOM`
- 本质: createRenderer函数的返回值(`renderer`对象)
  - `renderer`对象: 包含`render`函数
    - 参数: 
      - `vnode`：虚拟`DOM`对象
      - `container`：挂载容器，真实`DOM`元素 
    - 作用: 把`vnode`挂载到`container`上
```javascript
const vnode = {
    tag: 'div',
    props: {
        onClick: () => alert('click');
    },
    children: 'click me'
}
function renderer(vnode, container) {
    // 1. 创建元素
    const el = document.createElement(vnode.tag);
    // 遍历 vnode.props，将属性、事件添加到 DOM 元素
    for (const key in vnode.props) {
        if (/^on/.test(key)) {
            // 事件名称 onClick -> click
            el.addEventListener(key.substr(2).toLowerCase(), vnode.props[key]);
        }
    }
    // 处理 children
    if (typeof vnode.children === 'string') {
        // 如果 children 是字符串，创建文本节点并添加到 DOM 元素中
        el.appendChild(document.createTextNode(vnode.children));
    } else if (Array.isArray(vnode.children)) {
        // 如果 children 是数组，递归调用 renderer 函数，将每个子节点添加到 DOM 元素中
        vnode.children.forEach(child => renderer(child, el));
    }
}
```

### 组件的本质
组件是一组 `DOM`元素的封装，它是一个独立的 `JavaScript` 对象，包含了 `DOM` 元素的结构、样式和行为。

### 模板的工作原理
- 模板编译: 将模板编译为渲染函数(`render`),
```javascript
// 模板
<div @click="handleClick">click me</div>
// 编译后的渲染函数
render() {
    return h('div', { onClick: handleClick },'click me')
}
```
- 页面渲染: 把渲染函数返回的虚拟`DOM`渲染为真实`DOM`

编译器：将模板编译成 `render` 函数，`render` 函数会返回一个 `VNode` 对象，`VNode` 对象是一个 `JavaScript` 对象，它描述了真实 `DOM` 的结构和属性。
模板的工作原理：
:::tip Vue 中的虚拟 DOM 是什么，以及它是如何工作的
虚拟 DOM 是什么
- 虚拟 `DOM（Virtual DOM）`是一种轻量级的 `JavaScript` 对象，它是真实 `DOM` 的抽象表示。在 `Vue` 等前端框架中，虚拟 `DOM` 作为真实 `DOM` 的抽象层，以对象树的形式存储在内存中，包含了真实 `DOM` 的相关信息，如标签名、属性、子节点等。
- 真实 `DOM` 是浏览器用于呈现网页的树形结构，操作真实 `DOM` 的代价比较高，因为每次修改都会引发浏览器的重排`（reflow）`和重绘`（repaint）`，这会消耗大量的性能。而虚拟 `DOM` 的出现就是为了优化这个过程，通过在内存中对虚拟 `DOM` 进行操作和比较，找出最小的更新量，然后一次性将这些更新应用到真实 `DOM` 上，从而减少对真实 `DOM` 的直接操作，提高渲染效率。

虚拟 DOM 是如何工作的
1. 初始化阶段
* 模板编译: `Vue` 会将用户编写的模板字符串（如 `<div>{ { message }}</div>`）编译成渲染函数（`render` 函数）。这个过程包括解析模板为抽象语法树（`AST`），对 `AST` 进行优化，最后根据优化后的 `AST` 生成渲染函数。
```javascript
// 示例渲染函数
function render() {
  return createVNode('div', null, this.message);
}
```
* 生成虚拟 DOM: 当 `Vue` 实例首次渲染时，会调用渲染函数，渲染函数会返回一个虚拟 DOM 节点（`VNode`）。这个虚拟 DOM 节点是一个普通的 `JavaScript` 对象，它描述了真实 `DOM` 的结构和属性。
```javascript
// 简单的虚拟 DOM 节点示例
const vnode = {
  tag: 'div',
  data: {
      class: 'container'
  },
  children: [
      {
          tag: 'span',
          text: 'Hello, Vue!'
      }
  ]
};
```
* 模板编译: `Vue` 会根据生成的虚拟 `DOM` 创建对应的真实 `DOM` 节点，并将其挂载到页面中指定的位置（即 `el` 选项指定的元素）。
2. 更新阶段
* 数据变化触发重新渲染: 当 `Vue` 实例的数据发生变化时，会重新执行渲染函数，生成新的虚拟 `DOM`。
* Diff算法比较差异: 为了找出新旧虚拟 `DOM` 之间的差异，`Vue` 使用了 `Diff` 算法。`Diff` 算法会对新旧虚拟 `DOM` 进行比较，找出需要更新的部分。`Diff` 算法采用了双指针和 `key` 的策略来提高比较效率。
  * 同层比较: `Diff` 算法只对同层的节点进行比较，不会跨层级比较，这样可以减少比较的复杂度。
  * key 的作用: 当节点有 `key` 属性时，`Diff` 算法会根据 `key` 的值来判断节点是否相同，而不是根据节点的位置来判断。这样可以更准确地找出需要更新的节点。
* 更新真实 DOM: 根据 `Diff` 算法的比较结果，`Vue` 会将需要更新的部分应用到真实 `DOM` 上。这个过程只更新发生变化的部分，而不是重新渲染整个 `DOM` 树，从而提高了性能。

总结

虚拟 `DOM` 通过在内存中进行操作和比较，减少了对真实 `DOM` 的直接操作，从而提高了渲染效率。它在初始化阶段生成虚拟 `DOM` 并挂载到真实 `DOM`，在更新阶段通过 `Diff` 算法找出差异并更新真实
:::

## 第四章 响应式统的作用和实现
### 响应式数据与副作用函数
副作用函数：会产生副作用的函数。
```javascript
// 全局变量
let val = 1

function effect() {
    val = 2 // 修改全局变量，产生副作用
}
```
响应式数据：当数据发生变化时，会自动触发副作用函数执行并导致视图的更新。

### 响应式数据的实现
