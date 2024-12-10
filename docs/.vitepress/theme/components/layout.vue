/*
* @author: zhang jun
* @date:  2024-12-03 14:23:01
* @desc:
*/
<template>
    <Layout v-bind="$attrs">

    </Layout>
</template>

<script setup>
import { nextTick, provide } from 'vue'
import { useData, inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
const { isDark, theme, frontmatter } = useData()
const { comment } = theme.value

const enableTransitions = () => {
    return  'startViewTransition' in document && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
}
function updateMetaThemeColor() {
    if (inBrowser) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]')
        // #1b1b1f 是 vitepress 在 dark 模式下的背景色
        metaThemeColor.setAttribute('content', isDark.value ? '#1b1b1f' : '#3eaf7c')
    }
}

updateMetaThemeColor()

provide('toggle-appearance', async ({ clientX: x, clientY: y }) => {
    if (!enableTransitions()) {
        isDark.value = !isDark.value
        updateMetaThemeColor()
        return
    }

    const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y),
        )}px at ${x}px ${y}px)`,
    ]

    await document.startViewTransition(async () => {
        isDark.value = !isDark.value
        updateMetaThemeColor()
        await nextTick()
    }).ready

    document.documentElement.animate(
        { clipPath: isDark.value ? clipPath.reverse() : clipPath },
        {
            duration: 300,
            easing: 'ease-in',
            pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
        },
    )
})

</script>

<style scoped>

</style>
