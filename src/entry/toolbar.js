import { createApp } from 'vue'
import EchoWidget from '../view/EchoWidget'

const app = createApp(EchoWidget)

const div = document.createElement('div')
div.id = 'chrome_echo-widget'
document.body.appendChild(div)

app.mount('#chrome_echo-widget')