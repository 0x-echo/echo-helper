<template>
  <div
    class="app-wrapper"
    :class="{
      'is-message': message
    }">
    <div
      class="app-header">
      <img 
        class="app-header__logo"
        src="@/assets/logo.svg" 
        alt="ECHO Helper">
      
      <h1
        class="app-header__title">
        ECHO Helper
      </h1>
    </div>
      
    <template
      v-if="!message">
      <div
        class="app-content">
        <el-form
          class="app-form"
          ref="formRef"
          label-position="top"
          :model="form"
          :rules="rules"
          :show-message="false"
          size="large">
          <el-form-item
            label="Target URI"
            prop="uri">
            <el-input
              readonly
              v-model="form.uri">
            </el-input>
          </el-form-item>
          
          <el-form-item
            label="Modules"
            prop="modules">
            <el-checkbox-group 
              class="app-form__widget-group"
              v-model="form.modules">
              <el-checkbox 
                class="app-form__widget-checkbox"
                v-for="item in moduleOptions"
                :key="item.value"
                border
                :label="item.value">
                <i
                  class="app-form__widget-checkbox-icon"
                  :class="item.icon">
                </i>
                
                <div>
                  {{ item.label }}
                </div>
                
                <div
                  class="app-form__mode-placeholder"
                  v-if="item.value === 'comment' || item.value === 'tip'">
                  --
                </div>
                
                <div
                  v-if="item.value !== 'comment' && item.value !== 'tip'">
                  <el-popover
                    :ref="`${item.value}ModePopover`"
                    :offset="0"
                    placement="bottom"
                    trigger="click"
                    :width="120">
                    <template 
                      #reference>
                      <div
                        class="app-form__mode-select"
                        @click.stop.prevent>
                        <span>
                          {{ form[item.value] }}
                        </span>
                        
                        <i
                          class="ri-arrow-drop-down-line">
                        </i>
                      </div>
                    </template>
                    
                    <template 
                      #default>
                      <div
                        class="app-form__mode-option"
                        :class="{
                          'active': form[item.value] === option.value
                        }"
                        v-for="option in modeOptions"
                        :key="option.value"
                        @click="selectMode(item.value, option.value)">
                        {{ option.label }}
                      </div>
                    </template>
                  </el-popover>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          
          <el-form-item
            label="Theme"
            prop="theme">
            <el-radio-group 
              v-model="form.theme">
              <el-radio
                v-for="item in themeOptions"
                :key="item.value"
                :label="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item
            label="Receiver"
            prop="receiver">
            <el-input
              v-model="form.receiver"
              placeholder="Enter your .bit or .eth">
            </el-input>
            
            <div
              class="app-form__tip">
              To provide your avatar, display name and address for receiving tips
            </div>
          </el-form-item>

          <el-form-item
            label="description"
            prop="desc">
            <el-input
              v-model="form.desc"
              placeholder="description shown below name">
            </el-input>
          </el-form-item>
        </el-form>
        
        <div
          class="app-code"
          v-show="formCode">
          <div
            class="app-code__title">
            Embed Code 
          </div>
          
          <div
            class="app-code__block">
            {{ formCode }}
          </div>
        </div>
      </div>
      
      <div
        class="app-footer">
        <!-- <el-button
          class="app-footer__action-button"
          size="large"
          @click="reset">
          Reset
        </el-button> -->
        
        <el-button
          class="app-footer__action-button"
          size="large"
          @click="copyCode">
          Copy Code
        </el-button>
        
        <el-button
          class="app-footer__action-button"
          size="large"
          type="primary"
          @click="insertCode">
          Insert ECHO
        </el-button>
      </div>
    </template>
    
    <div
      class="app-message"
      v-if="message">
      <img 
        class="app-message__icon"
        src="@/assets/rocket.svg" 
        :alt="message">
      
      <div
        class="app-message__text">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { computed, getCurrentInstance, onMounted, reactive, ref, watch } from 'vue-demi'
import { ElButton, ElCheckbox, ElCheckboxGroup, ElForm, ElFormItem, ElInput, ElMessage, ElPopover, ElRadio, ElRadioGroup } from 'element-plus'
import 'element-plus/dist/index.css'
import 'remixicon/fonts/remixicon.css'
import qs from 'query-string'
import { toClipboard } from '@soerenmartius/vue3-clipboard'

const formRef = ref(null)
const form = reactive({
  uri: '',
  modules: [],
  theme: 'light',
  receiver: '',
  like: 'normal',
  dislike: 'normal',
  desc: ''
})

let message = ref('')
let url = ref('')

onMounted (() => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    url.value = tabs[0].url
    form.uri = tabs[0].url

    if (tabs[0].url.includes('https://mirror.xyz/write')) {
      message.value = 'Please save draft first.'
      return
    }

    if (tabs[0].url.includes('https://mirror.xyz/dashboard/edit/')) {
      const splits = tabs[0].url.split('/')
      const uri = `dapp/mirror/${splits[splits.length - 1]}`
      form.uri = uri
      message.value = ''
      return
    }

    message.value = 'Only Mirror entry is supported.'
  })
  
  chrome.storage.local.get('form', function(result){
    const _result = result.form ? JSON.parse(result.form) : {}
    if (!_result.modules.length) {
      delete _result.modules
    }
    if (_result.uri) {
      delete _result.uri
    }
    Object.assign(form, _result)
  })
})

watch(form, (value) => {
  const pure = JSON.parse(JSON.stringify(value))
  delete pure.uri
  chrome.storage.local.set({ form: JSON.stringify(pure) }, () => {
  })
})

const rules = reactive({
  uri: [{
    required: true, 
    trigger: 'blur'
  }],
  modules: [{
    type: 'array',
    required: true,
    trigger: 'change'
  }],
  theme: [{
    required: true,
    trigger: 'change'
  }],
  receiver: [{
    required: true,
    trigger: 'blur'
  }]
})

const moduleOptions = [{
  icon: 'ri-chat-3-line',
  label: 'Comment',
  value: 'comment'
}, {
  icon: 'ri-thumb-up-line',
  label: 'Like',
  value: 'like'
}, {
  icon: 'ri-thumb-down-line',
  label: 'Dislike',
  value: 'dislike'
}, {
  icon: 'ri-money-dollar-circle-line',
  label: 'Tip',
  value: 'tip'
}]

const modeOptions = [{
  label: 'Normal',
  value: 'normal'
}, {
  label: 'Lite',
  value: 'lite'
}]

const themeOptions = [{
  label: 'Light',
  value: 'light'
}, {
  label: 'Dark',
  value: 'dark'
}, {
  label: 'Auto',
  value: 'auto'
}]

const instance = getCurrentInstance()
const likeModePopover = ref(null) 
const dislikeModePopover = ref(null) 
const tipModePopover = ref(null) 
const selectMode = (value, option) => {
  form[value] = option
  instance.refs[`${value}ModePopover`][0].hide()
}

const formGenURL = computed(() => {
  let modules = form.modules
  const allModules = []
  for (const module of modules) {
    if (module === 'like') {
      if (form.like === 'lite') {
        allModules.push('like-lite')
      } else {
        allModules.push('like')
      }
    } else if (module === 'dislike') {
       if (form.dislike === 'lite') {
          allModules.push('dislike-lite')
        } else {
          allModules.push('dislike')
        }
    } else {
      allModules.push(module)
    }
  }

  const params = {
    'has-v-padding': 'true',
    'has-h-padding': 'true',
    modules: allModules.join(','),
    'target_uri': form.uri || 'preview-demo',
    'color-theme': form.theme,
    receiver: form.receiver,
    desc: form.desc
  }
  
  if (form.uri_type === 'Mirror entry') {
    Object.assign(params, {
      // 'dark-theme-color': '#141414',
    })
  }

  return `https://embed.0xecho.com.ipns.page/?` + qs.stringify(params)
  
  // `show-comment-dislike=true&has-v-padding=true&has-h-padding=true&modules=${form.modules.join(',')}&color-theme=light&target_uri=https%3A%2F%2Fmirror.xyz%2Fthirdchat.eth%2F8cCUKVDKXGco4-O6JRSlX5_zZkmb7C0YwCurcIVyZ2g&rpc_url=https%3A%2F%2Flocal-dev.third.chat%2F&dark-theme-color=%23141414&width=720&display=iframe`
})

const formCode = computed(() => {
  return formGenURL.value + '&height=800&display=iframe'
})

const reset = () => {
  formRef.value.resetFields()
}
   
const copyCode = async () => {
  try {
    await formRef.value.validate()
    await toClipboard(formCode.value)
    ElMessage({
      message: 'Copied!',
      type: 'success'
    })
  } catch (e) {
  }
}

const insertIframe = (text) => {
  const element = document.querySelector('.ProseMirror')
  const e = document.createElement('p')
  e.innerHTML = text
  element.appendChild(e)
}

const insertCode = async () => {
  try {
    await formRef.value.validate()
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      const tabId = tabs[0].id
      chrome.scripting.executeScript({ 
        target: {
          tabId: tabId
        },  
        func: insertIframe,
        args: [formCode.value]        
      }, () => {
      })
    })
    ElMessage({
      message: 'Done! Please save draft and preview the post to check if ECHO works right.',
      type: 'success'
    })
  } catch (e) {
  }
}

</script>

<script>
export default {
  name: 'popupView',
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
:root {
  --theme-bg-color: white;
  --color-primary-rgb: 78,117,246;
  --color-danger-rgb: 255,72,56;
  --color-primary: #4E75F6;
  --color-primary-light: #E9EFFE;
  --color-primary-lighter: #F8FAFF;
  --color-primary-dark: #3864F5;
  --color-primary-disabled: #94B1FC;
  --color-success: #83BF1C;
  --color-warning: #FFAA02;
  --color-danger: #FF4838;
  --text-color-primary: #16171C;
  --text-color-secondary: #4C545D;
  --text-color-muted: #929AB2;
  --bg-color: #F4F5FA;
  --bg-color-dark: #16171C;
  --border-color: #E6E8ED;
  --border-radius: 12px;
  --border-radius-small: 6px;
  --border-radius-large: 20px;
  --popover-box-shadow: 0 10px 10px rgba(0, 0, 0, .08);
  --fill-color-blank: white;
  --skeleton-to-color: var(--color-primary-lighter);
  --menu-item-bg-color: var(--color-primary-lighter);
  
  /* element plus */
  --el-color-primary: var(--color-primary);
  --el-color-success: var(--color-success);
  --el-color-warning: var(--color-warning);
  --el-color-danger: var(--color-danger);
  --el-color-info: var(--text-color-muted);
  --el-text-color-regular: var(--text-color-secondary);
  --el-border-color: var(--border-color);
  --el-border-color-hover: var(--el-color-primary);
  --el-border-radius-base: var(--border-radius);
  --el-fill-color-blank: var(--fill-color-blank);
  --el-popover-border-radius: var(--border-radius);
  --el-font-family: var(--font-family);
}

// reset 
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
  color: var(--color-primary);
  transition: color .3s;
  
  &:hover {
    color: var(--color-primary-dark);
  }
}

li {
  list-style: none;
}

body {
  background: white;
  color: var(--text-color-primary);
  -webkit-font-smoothing: antialiased;
  line-height: 1.5;
  -webkit-tap-highlight-color: transparent;
}

// element plus
.el-button {
  --el-button-hover-bg-color: white;
  --el-button-hover-border-color: var(--color-primary); 
  background-clip: padding-box;
  font-family: var(--font-family);
  transition: all .3s ease;
  
  &:focus:not(.el-button:hover) {
    border-color: var(--border-color);
    color: var(--text-color-secondary);
  }
  
  &--primary {
    --el-button-hover-bg-color: var(--color-primary-dark);
    --el-button-hover-border-color: var(--color-primary-dark);
    --el-button-disabled-border-color: var(--color-primary-disabled);
    --el-button-disabled-bg-color: var(--color-primary-disabled);
    font-weight: 600;
    
    &,
    &:focus:not(.el-button:hover) {
      border-color: var(--color-primary);
      background-color: var(--color-primary);
      color: white;
    }
  }
}

.el-input,
.el-textarea {
  --el-input-placeholder-color: var(--text-color-muted);
  --el-input-border-color: var(--border-color);
}

.el-checkbox {
  margin-right: 20px;
}

.el-message {
  min-width: 0;
  padding: 12px 20px 12px 15px;
  border-color: var(--theme-bg-color);
  background-color: var(--theme-bg-color);
  box-shadow: var(--popover-box-shadow);

  &__content {
    font-weight: 700;
    line-height: 20px;
  }
  
  &__icon {
    margin-right: 8px;
    font-size: 20px;
  }
}

// app
#app {
  width: 600px;
  height: 600px;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &.is-message {
    .app-header {
      padding-bottom: 15px;
    }
  }
}

.app-header {
  display: flex;
  align-items: center;
  padding: 15px 30px 30px;
  
  &__logo {
    width: 40px;
    margin-right: 10px;
  }
  
  &__title {
    font-size: 16px;
  }
}

.app-content {
  flex: 1;
  overflow: scroll;
  padding: 0 30px;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.app-form {
  .el-input {
    max-width: 400px;
  }
  
  &__tip {
    width: 100%;
    margin-top: 8px;
    font-size: 12px;
    line-height: 1.5;
    color: var(--text-color-muted);
  }
  
  &__widget-group {
    width: 100%;
  }
  
  &__widget-checkbox {
    width: 120px;
    transition: all .3s ease;
    
    &:hover:not(.is-checked) {
      border-color: var(--color-primary);
    }
    
    .is-error & {
      border-color: var(--color-danger);
    }
    
    &.el-checkbox {
      height: 104px;
      padding: 20px 0 0 !important;
    }
    
    &.is-checked {
      box-shadow: 0 0 4px rgba(var(--color-primary-rgb), .5);
      
      .landing-form__widget-checkbox-icon {
        color: var(--color-primary);
      }
    }
    
    .el-checkbox__input {
      display: none;
    }
    
    .el-checkbox__label {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0;
      font-size: 12px !important;
      color: var(--text-color-secondary);
    }
    
    &-icon {
      margin-bottom: 10px;
      font-size: 20px;
      color: var(--text-color-muted);
    }
  }
  
  &__mode-placeholder,
  &__mode-select {
    font-size: 12px;
    line-height: 30px;
    color: var(--text-color-muted);
    opacity: .9;
  }
  
  &__mode-select {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: opacity .3s ease;
    
    &:hover {
      opacity: 1;
    }
    
    i {
      position: relative;
      top: 1px;
    }
  }
  
  &__mode-option {
    padding: 0 10px;
    border-radius: 6px;
    font-size: 12px;
    line-height: 30px;
    color: var(--text-color-secondary);
    transition: all .3s ease;
    cursor: pointer;
    
    &:hover,
    &.active {
      color: var(--color-primary);
    }
    
    &.active {
      background: var(--menu-item-bg-color);
    }
  }
}

.app-code {
  padding: 20px;
  border-radius: var(--border-radius);
  background: var(--bg-color);
    
  &__title {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color-secondary);
  }
  
  &__block {
    font-size: 14px;
    color: var(--text-color-secondary);
  }
}

.app-footer {
  padding: 30px;
  text-align: right;
  
  &__action-button {
    width: 120px;
  }
}

.app-message {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 100px;
  
  &__icon {
    width: 200px;
  }
  
  &__text {
    margin-top: 10px;
    font-size: 16px;
  }
}
</style>
