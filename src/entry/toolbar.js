import { createApp } from 'vue'
import EchoWidget from '../view/EchoWidget'


// whitelist
const url = document.location.href
if (/^https:\/\/opensea\.io/.test(url)) {
  const app = createApp(EchoWidget)

  const div = document.createElement('div')
  div.id = 'chrome_echo-widget'
  document.body.appendChild(div)
  
  app.mount('#chrome_echo-widget')
}
