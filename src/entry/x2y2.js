import qs from 'query-string'
import { matchX2y2 } from './lib'

console.log('echo:x2y2: injecting')

let isRendering = false

// function insertAfter(newNode, referenceNode) {
//   referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
// }

function insertBefore(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.previousSibling);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const coinTypeMap = {
  'eth': '60' // https://opensea.io/assets/ethereum/0x60eb332bd4a0e2a9eeb3212cfdd6ef03ce4cb3b5/280980039013524092447328967487275980225373939388
}

async function inject () {
  if (isRendering) {
    return
  }

  const url = document.location.href

  const matched = matchX2y2(url)
  console.log('echo:x2y2 matched', matched)
  const params = matched.params

  if (!params) {
    console.log('echo: not matched')
    return
  }

  isRendering = true

  console.log('echo:', params)
  
  const height = 600
  const iframeParams = {
    target_uri: `nft/${coinTypeMap[params.chain]}${ params.contract ? '/' + params.contract.toLowerCase() : '' }/${params.tokenId}`,
    modules: 'comment,like,dislike',
    'color-theme': 'light',
    height,
    'target_site': 'x2y2_io'
  }
  
  const iframeUrl = `https://embed.0xecho.com.ipns.page?${qs.stringify(iframeParams)}`
  
  let inserted = false
  while (!inserted) {
    const _timelineDiv = document.querySelector('[role=tablist]')
    const timelineDiv = _timelineDiv.parentNode
    console.log('timeline', timelineDiv)
    if (!timelineDiv) {
      console.log('echo: target not exist yet')
      await sleep(200)
    } else {
      const blockCode = `<div class="echo-panel">
      <iframe
        frameborder="0"
        style="width:100%;height:${height}px;"
        src="${iframeUrl}"
      ></iframe>
      </div>`
    
      const div = document.createElement('div')
      div.innerHTML = blockCode
      insertBefore(div, timelineDiv)
      inserted = true
    }
  }
  isRendering = false
}

let currentUrl = location.href;

setInterval(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href
    setTimeout(async () => {
      try {
        await inject()
      } catch (e) {
        console.log(e)
      }
    }, 10)
  }
}, 200)

inject().then(() => {})

