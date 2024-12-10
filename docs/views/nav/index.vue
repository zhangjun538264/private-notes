<template>
    <nav-links v-if="items.length" title="最近使用" @nav-click="handleClick" :items="items" />
    <nav-links v-for="item in navData" v-bind="item" @nav-click="handleClick" />
</template>

<script setup>
import { ref } from 'vue'
import { inBrowser } from 'vitepress'
import { navData } from './data'
const RECENT_LINKS_KEY = 'notes-recent-links'

const getItems = () => {
    if (!inBrowser) {
        return []
    }
    const value = localStorage.getItem(RECENT_LINKS_KEY)
    if (value) {
        try {
            return JSON.parse(value)
        } catch (e) {
            return []
        }
    }
    return []
}

const items = ref(getItems())

const handleClick = (data) => {
    let newData = items.value.filter(item => item.link !== data.link)
    newData.unshift(data)
    if (newData.length > 4) {
        newData = newData.slice(0, 4)
    }
    localStorage.setItem(RECENT_LINKS_KEY, JSON.stringify(newData))
    items.value = newData
}
</script>

<style src="./index.scss"></style>
