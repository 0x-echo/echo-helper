import Button from '@0xecho/button'
const $btns = document.querySelectorAll('.btn-share')
const $parent = $btns[$btns.length - 1].parentNode

const $div = document.createElement('div')
$div.className = 'btn-share echo-chainfeeds-btn'
$div.innerHTML = ``

$parent.appendChild($div)

new Button({
  node: 'https://node1.0xecho.com',
  targetUri: 'https://0xecho.com',
  theme: 'dark'
}).mount($div)

setTimeout(() => {
  const $commentParent = document.querySelector('.comment_wrapper')

  const list = [{
    name: 'code.bit',
    avatar: 'https://i.v2ex.co/h2ot4l5W.png',
    content: 'ETH 通过质押可以获得收益。目前大约是 4.2% 左右的年化收益。当 ETH 有了质押收益之后，ETH 本身不仅是整个网络的安全支撑者，也捕获了其生态成长的收益，ETH 从根本上发生了变化。随着生态的成长，它为 L2 及其网络提供更大规模的安全服务，ETH 最终也会受益。',
    from_uri: document.location.href,
    from: 'ChainFeeds | ECHO'
  }, {
    name: '0xecho.bit',
    background: '#fff',
    avatar: 'https://i.v2ex.co/tB9QsCLu.png',
    content: '以太坊本身有开发者基础，生态基础，用户基础，基于此，形成了较为强大的社区共识。这种社区共识，随着以太坊生态的持续发展，包括 L2 逐步超越绝大多数公链，以太坊作为加密领域最基础结算层和安全提供者的角色，只会增强其护城河。有足够护城河这一点，逐步会被更多机构和用户看到。',
    from_uri: 'https://bress.xyz',
    from: 'Bress | ECHO'
  }]

  list.forEach(one => {
    const $div = document.createElement('div')
    $div.className = 'comment'
    $div.innerHTML = `
    <div class="comment_avatar">
    <img src="${one.avatar}" alt="" style="background:${one.background};"></div>
    <div class="comment_con_wrapper"><div class="comment_con">
    <span class="comment_con_author">${one.name}</span><br>
    <p class="comment_con_date"><span>2023-01-09 03:06:46</span><span>&nbsp;·&nbsp;</span>
    <span>来源于&nbsp;</span>
    <a href="${one.from_uri}" target="_blank" class="url">${one.from}</a>&nbsp;</p><br>
    <span>${one.content}<!-- --> </span>
    </div></div>`
    console.log($commentParent)
    $commentParent.appendChild($div)
  })

  const $input = document.createElement('div')
  $input.className = 'echo-editor'

  $input.innerHTML = `
  <img class="echo-editor__avatar" alt="ECHO" src="https://i.v2ex.co/h2ot4l5W.png">
  <input class="echo-editor__input" id="echo-input" type="text" placeholder="Write a comment...">
  <button class="echo-editor__submit" id="echo-send">Send</button>
  `

  $commentParent.appendChild($input)

  const $button = document.querySelector('#echo-send')
  $button.addEventListener('click', () => {
    if (!document.querySelector('#echo-input').value) {
      return
    }
    const $div = document.createElement('div')
    $div.className = 'comment'
    $div.innerHTML = `
    <div class="comment_avatar">
    <img src="${list[1].avatar}" alt="" style="background:${list[1].background};"></div>
    <div class="comment_con_wrapper"><div class="comment_con">
    <span class="comment_con_author">${list[1].name}</span><br>
    <p class="comment_con_date"><span>2023-01-09 03:06:46</span><span>&nbsp;·&nbsp;</span>
    <span>来源于&nbsp;</span>
    <a href="${list[1].from_uri}" target="_blank" class="url">${list[0].from}</a>&nbsp;</p><br>
    <span>${document.querySelector('#echo-input').value}<!-- --> </span>
    </div></div>`
    $commentParent.insertBefore($div, $input)
    document.querySelector('#echo-input').value = ''
  })


}, 300)



