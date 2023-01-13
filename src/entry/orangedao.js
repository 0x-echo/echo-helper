import Button from '@0xecho/button'

setTimeout(() => {
  const $box = document.querySelector('.widgetHOC').parentNode
  const $like = document.createElement('div')
  $like.className = 'echo-like-box'
  $like.innerHTML = '<div>like</div>'
  $box.appendChild($like)

  new Button({
    node: 'https://node1.0xecho.com',
    targetUri: 'https://0xecho.com'
  }).mount($like)

  const $comment = document.createElement('div')
  $comment.className = 'echo-comment'
  $box.appendChild($comment)
  $comment.innerHTML = `<div
    class="echo-comment__body">
  <p class="echo-comment__title">What our community members think about OrangeDAO</p>
  <iframe
    frameborder="0"
    style="width:100%;height:480px;"
    src="https://embed.0xecho.com.ipns.page/?show-comment-dislike=false&has-v-padding=false&has-h-padding=false&modules=comment,like&color-theme=light&target_uri=https%3A%2F%2F0xecho.com&width=720&display=iframe&receiver=0xecho.bit&desc=Long%20Live%20Our%20Opinion.&dark-theme-color=%230d0f17">
  </div><div class="echo-comment__right-space"></div>`

}, 3000)
