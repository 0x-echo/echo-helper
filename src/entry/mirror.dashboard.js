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

  const parentStyle = `translateX(calc(-50% + 105px))`
  
  $parent.style.transform = "translateX(calc(-50% + 105px))"

  if (document.querySelector('#echo-mirror-bar')) {
    const $div = document.querySelector('#echo-mirror-bar')
    $div.parentNode.removeChild($div)
  }

  const $bar = document.createElement('div')
  $bar.id = 'echo-mirror-bar'
  $bar.innerHTML = `<span>Comments</span><span class="echo-mirror-bar__tip">&lt;/&gt;</span>`
  document.body.appendChild($bar)
  
  if (document.querySelector('#echo-helper__dialog')) {
    const $div = document.querySelector('#echo-helper__dialog')
    $div.parentNode.removeChild($div)
  }

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
    
    try {
      const $content = document.querySelector('.ProseMirror')
      if ($content) {
        if ($content.innerHTML.includes('https://embed.0xecho.com.ipns.page')) {
          $bar.classList.remove('has-badge')
        } else {
          $bar.classList.add('has-badge')
        }
      }
    } catch (e) {
      console.log(e)
    }
  }, 200)
}

main()

let currentUrl = location.href
setInterval(() => {
  if (location.href !== currentUrl) {
    console.error('echo mirror:', 'url change', currentUrl)
    currentUrl = location.href
    setTimeout(async () => {
      try {
        main()
      } catch (e) {
        console.log(e)
      }
    }, 10)
  }
}, 200)