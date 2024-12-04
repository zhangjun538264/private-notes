// https://vitepress.dev/guide/custom-theme
import { h,watch } from 'vue'
import DefaultTheme from 'vitepress/theme'
import layout from './components/layout.vue'
// import './style.css'
import './styles/index.scss'


let homePageStyle = ''
/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    const props = {}
    return h(layout,props)
  },
  enhanceApp({ app, router, siteData }) {
    if (typeof window !== 'undefined') {
      watch(
          () => router.route.data.relativePath,
          () => updateHomePageStyle(location.pathname === '/'),
          { immediate: true },
      )
    }
  }
}

function updateHomePageStyle(value) {
  if (value) {
    if (homePageStyle) return

    homePageStyle = document.createElement('style')
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
    document.body.appendChild(homePageStyle)
  } else {
    if (!homePageStyle) return

    homePageStyle.remove()
    homePageStyle = undefined
  }
}
