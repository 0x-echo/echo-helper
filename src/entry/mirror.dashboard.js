import { createApp } from 'vue'
import MirrorBar from '../view/MirrorBar'

console.log(MirrorBar)

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

  const $bar = document.createElement('div')
  $bar.id = 'echo-mirror-bar'
  // $parent.appendChild($bar)
  document.body.appendChild($bar)
  const app = createApp(MirrorBar)
  app.mount($bar)
}

main()