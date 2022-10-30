import { createApp } from 'vue'
import EchoWidget from '../view/EchoWidget'

const url = document.location.href

// whitelist: opensea
if (/^https:\/\/opensea\.io/.test(url)) {
  const app = createApp(EchoWidget)

  app.config.errorHandler = (err) => {
    console.error('echo:', err)
  }

  const div = document.createElement('div')
  div.id = 'chrome_echo-widget'
  document.body.appendChild(div)
  
  app.mount('#chrome_echo-widget')
}
