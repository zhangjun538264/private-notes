<template>
    <component :is="component" v-if="title" :id="formatTitle" tabindex="-1">
        {{ title }}
        <a class="header-anchor" :href="`#${formatTitle}`" aria-hidden="true"></a>
    </component>
    <div class="lt-nav-links">
        <nav-link v-for="item in items" :key="item.link" :noIcon="noIcon" v-bind="{ ...item, ...$attrs }"></nav-link>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { slugify } from '@mdit-vue/shared'
import navLink from './navLink.vue'

const props = defineProps({
    tag: {
        type: String,
        default: 'h2'
    },
    title: {
        type: String,
        default: ''
    },
    noIcon: {
        type: Boolean,
        default: false
    },
    items: {
        type: Array,
        default: () => []
    }
})

const component = computed(() => props.tag ?? 'h2')

const formatTitle = computed(() => slugify(props.title))
</script>

<style lang="scss" scoped>
.lt-nav-links {
    --nav-gap: 10px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    grid-row-gap: var(--nav-gap);
    grid-column-gap: var(--nav-gap);
    grid-auto-flow: row dense;
    justify-content: center;
    margin-top: var(--nav-gap);
}

@each $media, $size in (500px: 140px, 640px: 155px, 768px: 175px, 960px: 200px, 1440px: 240px) {
    @media (min-width: $media) {
        .lt-nav-links {
            grid-template-columns: repeat(auto-fill, minmax($size, 1fr));
        }
    }
}

@media (min-width: 960px) {
    .lt-nav-links {
        --nav-gap: 20px;
    }
}
</style>
