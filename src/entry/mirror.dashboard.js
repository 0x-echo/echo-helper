import { createApp } from 'vue'
import Form from '../view/popup'
import { isMirror } from './lib'

function  main() {
  // match https://mirror.xyz/write
  const url = document.location.href
  if (!url.includes('https://mirror.xyz/write') && !isMirror(url)) {
    console.log('echo: not in mirror writing page')
    return
  }

  let $ul = document.querySelector('[role=listbox]')
  if (!$ul) {
    console.log('try again')
    setTimeout(() => {
      main()
    }, 500)
    return
  }
  const $parent = $ul.parentNode

  const parentStyle = `translateX(calc(-50% + 110px))`
  
  $parent.style.transform = "translateX(calc(-50% + 110px))"

  const $bar = document.createElement('div')
  $bar.id = 'echo-mirror-bar'
  const logo = chrome.runtime.getURL('img/logo.svg')
  $bar.innerHTML = `<img
  class="echo-mirror-bar__logo"
  src="${logo}"
  alt="ECHO"> <span>Embed ECHO</span>`
  document.body.appendChild($bar)


  const $dialog = document.createElement('div')
  $dialog.id = 'echo-helper__dialog'
  // $dialog.style = `width:600px;height:600px;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);display:none;`
  document.body.appendChild($dialog)

  const app = createApp(Form)
  // console.log('app', app)
  app.mount($dialog)

  $bar.addEventListener('click', () => {
    $dialog.style.display = 'block'
  })

  setInterval(() => {
    $ul = document.querySelector('[role=listbox]')
    if ($ul) {
      if ($ul.style.transform !== parentStyle) {
        $ul.parentNode.style.transform = parentStyle
      }
      $bar.style.display = 'flex'
    } else {
      $bar.style.display = 'none'
    }
  }, 200)
}

main()