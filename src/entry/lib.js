import { match } from 'path-to-regexp'

// https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const coinTypeMap = {
  'ethereum': '60', // https://opensea.io/assets/ethereum/0x60eb332bd4a0e2a9eeb3212cfdd6ef03ce4cb3b5/280980039013524092447328967487275980225373939388
  'solana': '501', // https://opensea.io/assets/solana/2K4stcyiX9qVBdccYB93jLCdd166HY6nAh95LW5UJCor
  'polygon': '966',  // https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/42709913817426773948389448393602650129374964425258602512162183441386789928961
  'arbitrum': '9001', // https://opensea.io/assets/arbitrum/0xb3963985de1b174462dde56418ce7d419caa4c12/3470
  'klaytn': '8217' // https://opensea.io/assets/klaytn/0xa9f07b1260bb9eebcbaba66700b00fe08b61e1e6/224527
}

export function matchOpensea (url) {
  const isSolana = url.includes('/assets/solana/')
  const reg = isSolana ? '/assets/:chain/:tokenId' : '/assets/:chain/:contract/:tokenId'
  const fn = match(reg, { decode: decodeURIComponent })
  const val = '/assets' + url.split('/assets')[1]
  const matched = fn(val)
  const params = matched.params

  return {
    params,
    targetUri: params ? `nft/${coinTypeMap[params.chain]}${ params.contract ? '/' + params.contract : '' }/${params.tokenId}` : null
  }
}

export function isMirror (url) {
  const splits = url.split('/')
  const id = splits[splits.length - 1]
  if (id.length === 43) {
    return true
  }
  return false
}

export function matchMirror (url) {
  const splits = url.split('/')
  const id = splits[splits.length - 1]
  if (id.length === 43) {
    return {
      params: {
        id
      },
      targetUri: `dapp/mirror/${id}`
    }
  }

  return {

  }
}

export function matchX2y2 (url) {
  const reg = '/:chain/:contract/:tokenId'
  const fn = match(reg, { decode: decodeURIComponent })
  const matched1 = fn(url.replace('https://x2y2.io', ''))

  const reg2 = '/:lang/:chain/:contract/:tokenId'
  const matched2 = match(reg2, { decode: decodeURIComponent })(url.replace('https://x2y2.io', ''))

  const matched = matched1 || matched2

  if (url.includes('https://x2y2.io/collection')) {
    return {

    }
  }

  if (!matched.params || !matched.params.contract) {
    return {

    }
  }

  // make sure contract address starts with 0x
  if (!matched.params.contract.startsWith('0x')) {
    return {

    }
  }

  return {
    params: matched.params,
    targetUri: `nft/60/${matched.params.contract}/${matched.params.tokenId}`
  }
}

// https://looksrare.org/collections/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/7336079498597523296313895257641164104914542749044156962331103551815549273787?queryID=d45e7e84ca128893d1c593791dff16ce
export function matchLooksrare (url) {
  console.log('url', url, url.replace('https://looksrare.org', ''))
  const reg = '/collections/:contract/:tokenId'
  const fn = match(reg, { decode: decodeURIComponent })
  const matched = fn(url.replace('https://looksrare.org', '').split('?')[0])
  console.log('matched', matched)
  return {
    params: matched.params,
    targetUri: `nft/60/${matched.params.contract}/${matched.params.tokenId}`
  }
}


