import qs from 'query-string'
import { matchOpensea } from './lib'

console.log('echo:opensea: injecting')

let isRendering = false

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const coinTypeMap = {
  'ethereum': '60', // https://opensea.io/assets/ethereum/0x60eb332bd4a0e2a9eeb3212cfdd6ef03ce4cb3b5/280980039013524092447328967487275980225373939388
  'solana': '501', // https://opensea.io/assets/solana/2K4stcyiX9qVBdccYB93jLCdd166HY6nAh95LW5UJCor
  'polygon': '966',  // https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/42709913817426773948389448393602650129374964425258602512162183441386789928961
  'arbitrum': '9001', // https://opensea.io/assets/arbitrum/0xb3963985de1b174462dde56418ce7d419caa4c12/3470
  'klaytn': '8217' // https://opensea.io/assets/klaytn/0xa9f07b1260bb9eebcbaba66700b00fe08b61e1e6/224527
}

async function inject () {
  if (isRendering) {
    return
  }

  const url = document.location.href

  const matched = matchOpensea(url)
  console.log('echo:opensea matched', matched)
  const params = matched.params

  if (!params) {
    console.log('echo: not matched')
    return
  }

  isRendering = true

  console.log('echo:', params)
  
  const height = 600
  const iframeParams = {
    target_uri: `nft/${coinTypeMap[params.chain]}${ params.contract ? '/' + params.contract : '' }/${params.tokenId}`,
    modules: 'comment,like,dislike',
    'color-theme': 'light',
    height,
    'target_site': 'opensea_io',
    from_uri: url
  }
  
  const iframeUrl = `https://embed.0xecho.com.ipns.page?${qs.stringify(iframeParams)}`
  
  let inserted = false
  while (!inserted) {
    const timelineDiv = document.querySelector('.item--main .item--frame')
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
      div.classList = 'Panel--isOpen item--frame'
      div.innerHTML = blockCode
      insertAfter(div, timelineDiv)
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

