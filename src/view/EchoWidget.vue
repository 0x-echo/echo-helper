<template>
  <div
    class="plugin-toolbar"
    v-show="toolbarVisible">
    <div
      class="plugin-toolbar__close"
      @click="toolbarVisible = false">
      <i
        class="ri-close-line">
      </i>
    </div>
    
    <div
      class="plugin-toolbar__item"
      v-for="item in list"
      :key="item.value"
      @click="drawerVisible = true">
      <div
        class="plugin-toolbar__item-icon">
        <i
          :class="item.icon">
        </i>
      </div>
      
      <sup
        class="plugin-toolbar__item-badge"
        v-if="data[item.value] !== 0">
        {{ data[item.value] }}
      </sup>
    </div>
  </div>
  
  <transition
    name="slide-fade">
    <div
      class="plugin-drawer"
      v-show="drawerVisible">
      <div
        class="plugin-drawer__header">
        <a 
          class="plugin-drawer__logo"
          href="https://0xecho.com"
          target="_blank">
          <img 
            class="plugin-drawer__logo-image"
            :src="logo" 
            alt="ECHO">
          
          <h1
            class="plugin-drawer__title">
            ECHO
          </h1>
        </a>
        
        <div
          class="plugin-drawer__close"
          @click="drawerVisible = false">
          <i
            class="ri-close-line">
          </i>
        </div>
      </div>
      
      <div
        class="plugin-drawer__content">
        <iframe 
          allow="'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen="" 
          frameborder="0" 
          loading="lazy" 
          :src="iframeUri">
        </iframe>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { matchOpensea, matchMirror, isMirror } from '../entry/lib'
import qs from 'query-string'
import axios from 'axios'

const API = 'https://node1.0xecho.com'

let toolbarVisible = ref(true)
let drawerVisible = ref(false)

const logo = chrome.runtime.getURL('img/logo.svg')

let targetUri = ref('')
let iframeUri = ref('')
let url = ref(document.location.href)

const data = reactive({
  like: 0,
  dislike: 0,
  comment: 0
})

watch(url, async (newUrl) => {
  console.log('url changed:', newUrl)
  await doMatch()
})

const doMatch = async () => {
  // whitelist: opensea
  if (/^https:\/\/opensea\.io/.test(url.value)) {
    const matched = matchOpensea(url.value)
    if (matched && matched.targetUri) {
      targetUri.value = matched.targetUri
      const iframeParams = {
        target_uri: matched.targetUri,
        modules: 'comment,like,dislike',
        'color-theme': 'light',
        height: 729,
        'has-h-padding': 'true',
        'has-v-padding': 'true',
        'target_site': 'opensea_io'
      }

      iframeUri.value = `https://embed.0xecho.com.ipns.page?${qs.stringify(iframeParams)}`
    }
  }

  console.log('is mirror', isMirror(url.value))
  if (isMirror(url.value)) {
    console.log('is mirror', url.value)
    const matched = matchMirror(url.value)
    console.log('matched mirror', matched)
    if (matched && matched.targetUri) {
      targetUri.value = matched.targetUri

      const iframeParams = {
        target_uri: matched.targetUri,
        modules: 'comment,like,dislike',
        'color-theme': 'light',
        height: 729,
        'has-h-padding': 'true',
        'has-v-padding': 'true',
        'target_site': 'mirror_xyz'
      }

      iframeUri.value = `https://embed.0xecho.com.ipns.page?${qs.stringify(iframeParams)}`
    }
  }

  try {
    await doFetch()
  } catch (e) {
    console.log(e)
  }
}

const doFetch = async () => {
  const rs = await axios.get(`${API}/api/v1/posts`, {
    params: {
      target_uri: targetUri.value
    }
  })
  if (rs && rs.data && rs.data.data && rs.data.data.target_summary) {
    Object.assign(data, {
      like: rs.data.data.target_summary.like_counts,
      dislike: rs.data.data.target_summary.dislike_counts,
      comment: rs.data.data.target_summary.comment_counts
    })
  } else {
    console.log(rs)
  }
}

const list = [{
  icon: 'ri-thumb-up-line',
  value: 'like'
}, {
  icon: 'ri-thumb-down-line',
  value: 'dislike'
}, {
  icon: 'ri-chat-3-line',
  value: 'comment'
}]

let currentUrl = document.location.href

onMounted(async () => {
  await doMatch()
  setInterval(() => {
    if (location.href !== currentUrl) {
      currentUrl = document.location.href
      url.value = document.location.href
    }
  }, 300)
})
</script>

<style lang="scss">
@import '../css/widget.css';

.plugin-toolbar,
.plugin-drawer {
  color: var(--echo-ex-text-color-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    outline: none;
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
  }
  
  a {
    text-decoration: none;
    color: var(--echo-ex-color-primary);
    transition: color .3s;
  }

  a:hover {
    color: var(--echo-ex-color-primary-dark);
  }
  
  li {
    list-style: none;
  }
}

.plugin-toolbar {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 99999;
  
  &.is-dark {
    .plugin-toolbar__close {
      border-color: rgba(white, .1);
      background: #0d0f17;
      color: rgba(white, .9);
      box-shadow: 0 0 20px rgba(white, .1);
    }
    
    .plugin-toolbar__item-icon {
      border-color: var(--echo-ex-color-primary);
      background: var(--echo-ex-color-primary);
      color: rgba(white, .9);
      box-shadow: 0 0 20px rgba(white, .1);
    }
    
    .plugin-toolbar__item-badge {
      font-weight: 500;
      background: white;
      color: var(--echo-ex-color-primary);
    }
  }
  
  &:hover {
    .plugin-toolbar__close {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-bottom: 16px;
    border-radius: 50%;
    border: 1px solid var(--echo-ex-border-color);
    font-size: 18px;
    color: var(--echo-ex-text-color-muted);
    background: white;
    box-shadow: 0 0 10px rgba(black, .1);
    transform: translateY(20%);
    opacity: 0;
    cursor: pointer;
    transition: all .3s ease;
    
    &:hover {
      color: var(--echo-ex-text-color-secondary);
    }
  }
  
  &__item {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all .3s ease;
    
    & + & {
      margin-top: 16px;
    }
    
    &:hover {
      transform: scale(1.1);
    }
  }
  
  &__item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: 1px solid var(--echo-ex-border-color);
    font-size: 16px;
    color: var(--echo-ex-text-color-secondary);
    background: white;
    box-shadow: 0 0 10px rgba(black, .1);
  }
  
  &__item-badge {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(40%, -40%);
    height: 16px;
    padding: 0 6px;
    border-radius: 10px;
    font-size: 12px;
    line-height: 17px;
    background: var(--echo-ex-color-primary);
    color: white;
  }
}

.plugin-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 415px;
  height: 100vh;
  border-left: 1px solid var(--echo-ex-border-color);
  box-shadow: 0px 16px 48px 16px rgba(0, 0, 0, .08);
  background: white;
  color: var(--echo-ex-text-color-primary);
  display: flex;
  flex-direction: column;
  z-index: 99999;
  
  &.is-dark {
    border-color: rgba(white, .1);
    background: #0d0f17;
    
    .plugin-drawer__logo {
      color: rgba(white, .9);
    }
    
    .plugin-drawer__close {
      color: rgba(white, .9);
      
      &:hover {
        background: rgba(white, .1);
      }
    }
  }
  
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 0;
  }
  
  &__logo {
    display: flex;
    align-items: center;
    
    &,
    &:hover {
      color: var(--echo-ex-text-color-primary);
    }
  }
  
  &__logo-image {
    width: 40px;
    margin-right: 10px;
  }
  
  &__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--echo-ex-text-color-primary);
  }
  
  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 22px;
    color: var(--echo-ex-text-color-primary);
    cursor: pointer;
    transition: all .3s ease;
    
    &:hover {
      background: var(--echo-ex-bg-color);
    }
  }
  
  &__content {
    flex: 1;
    
    iframe {
      width: 100%;
      height: 100%;
    }
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all .3s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
}
</style>