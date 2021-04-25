<template>
    <div>
        <div v-for="c in contents" v-html="c.html" :id="c.id" v-show="c.id === currentContentId"></div>
    </div>
</template>
<script>
import { onMounted, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useState } from '../state';

const defaultTitle = document.title
const acceptedContent = new Set()
const titles = new Map()

export default {
    setup(props) {
        const state = useState()
        const router = useRouter()
        const contents = computed(() => Array.from(state.contents.values()))
        const currentContent = () => state.contents.get(state.currentContentPath)
        const currentContentId = computed(() => {
            const c = currentContent()
            return c ? c.id : null
        })
        const acceptContent = () => {
            const content = document.getElementById(currentContentId.value)
            if (! content) {
                return;
            }
            const h1 = content.querySelector('h1')
            const hasH1 = h1 && h1.textContent && true
            if (hasH1 && h1.textContent !== defaultTitle) {
                document.title = `${h1.textContent} | ${defaultTitle}`
            } else if (document.title !== defaultTitle) {
                document.title = defaultTitle
            }
            titles.set(currentContentId.value, document.title)
            const links = Array.from(content.getElementsByTagName('A'))
            const thisSite = `${location.protocol}//${location.host}`
            links.forEach((l) => {
                if (l.href.substr(0, thisSite.length) === thisSite && !/\.\w+$/.test(l.href)) {
                    const href = l.href.substr(thisSite.length)
                    l.onclick = (e) => {
                        e.preventDefault()
                        router.push({ path: href })
                    }
                }

            })
            acceptedContent.add(currentContentId.value)
        }
        watch(currentContentId, async () => {
            await nextTick()
            if (currentContentId.value !== null) {
                if (!acceptedContent.has(currentContentId.value)) {
                    acceptContent()
                } else {
                    document.title = titles.get(currentContentId.value)
                }
            }
            window.scroll({
                top: currentContent().scrollY || 0
            })
        })
        onMounted(() => {
            acceptContent()
        })
        return { contents, currentContentId }
    }
}
</script>
<style scoped>
</style>