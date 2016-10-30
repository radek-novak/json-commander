const css = require('../../styles/style')

const injectStyles = () => {
  const styleEl = document.createElement('style')
  styleEl.innerText = css
  document.head.appendChild(styleEl)
}

export default injectStyles
