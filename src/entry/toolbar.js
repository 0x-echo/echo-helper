import { createApp } from 'vue'
import EchoWidget from '../view/EchoWidget'
// import { matchOpensea } from './lib'

async function main (url) {
  // const isOpenseaUrl = /^https:\/\/opensea\.io/.test(url)
  const isMirrorUrl = /^https:\/\/mirror\.xyz/.test(url)
  let isMirrorPost = false
  let isOpensea = false
  
  if (isMirrorUrl && !url.includes('dashboard')) {
    const splits = url.split('/')
    if (splits[splits.length - 1].length === 43) {
      isMirrorPost = true
    }
  }
  
  // hide opensea toolbar
  // if (isOpenseaUrl) {
  //   const matched = matchOpensea(url)
  //   if (matched && matched.targetUri) {
  //     isOpensea = true
  //     console.log('echo toolbar:', 'is Opensea')
  //   }
  // }
  
  if (isOpensea || isMirrorPost) {
    removeExisted()
    const app = createApp(EchoWidget)
  
    app.config.errorHandler = (err) => {
      console.error('echo toolbar:', err)
    }
  
    const div = document.createElement('div')
    div.id = 'chrome_echo-widget'
    document.body.appendChild(div)
    
    app.mount('#chrome_echo-widget')
  } else {
    removeExisted()
  }
}

let currentUrl = location.href

setInterval(() => {
  if (location.href !== currentUrl) {
    console.error('echo toolbar:', 'url change', currentUrl)
    currentUrl = location.href
    setTimeout(async () => {
      try {
        await main(currentUrl)
      } catch (e) {
        console.log(e)
      }
    }, 10)
  }
}, 200)

main(currentUrl).then(() => {})

function removeExisted () {
 // remove existed element
 const elem = document.querySelector('#chrome_echo-widget')
 if (elem) {
   elem.parentNode.removeChild(elem)
 }
}