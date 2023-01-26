import { createApp } from 'vue'
import Form from '../view/popup'

function  main() {
  const $ul = document.querySelector('[role=listbox]')
  if (!$ul) {
    console.log('try again')
    setTimeout(() => {
      main()
    }, 2000)
    return
  }
  const $parent = $ul.parentNode
  console.log($parent, $ul)
  
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
    console.log('click bar')
    $dialog.style.display = 'block'
  })
}

main()