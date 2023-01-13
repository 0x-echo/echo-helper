<template>
 <div>
  <div @click="insert">Embed ECHO</div>
  <popup class="echo-mirror-popup"></popup>
 </div>
</template>

<script setup>
import Popup from '../view/popup'

const insert = () => {
  console.log('insert logic')
  const url = document.location.href
  let id
  if (url === 'https://mirror.xyz/write') {
    console.log('Please write some content')
    return
  }

  // example
  //  https://mirror.xyz/dashboard/edit/QBiJ3N06Zc3ywp-oiZh7DKxCCdHSL8csNHMykr6h_Ls
  if (url.includes('/edit/')) {
    const splits = url.split('?')[0].split('/')
    const _id = splits[splits.length - 1]
    if (_id.length === 43) {
      id = _id
    }
  }
  console.log('id', id)
}
</script>

<style scoped>
.echo-mirror-popup {
  width: 600px;
}
</style>