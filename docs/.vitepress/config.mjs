import {defineConfig} from 'vitepress'
import {algolia, head, nav, sidebar} from './configs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    lang: 'zh-CN',
    title: "月色藏于云雾",
    description: "我的成长之路，包含前端常用知识、源码阅读笔记、各种奇淫技巧、日常提效工具等",
    head,
    lastUpdated: true,
    cleanUrls: true,
    /* markdown 配置 */
    markdown: {
        lineNumbers: true,
        image: {
            lazyLoading: true,
        },
    },
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        i18nRouting: false,
        logo: '/logo.png',
        nav,
        sidebar,

        socialLinks: [
            {icon: 'github', link: 'https://github.com/vuejs/vitepress'}
        ],
        search: {
            provider: 'local',
            options: algolia
        }
    }
})
