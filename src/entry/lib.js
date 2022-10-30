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
    targetUri: `nft/${coinTypeMap[params.chain]}${ params.contract ? '/' + params.contract : '' }/${params.tokenId}`
  }
}
