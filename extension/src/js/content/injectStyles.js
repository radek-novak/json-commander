const css = require('../../styles')

const template = `
  <style>
  ${css}
  </style>
`

const injectStyles = () => {
  document.head.insertAdjacentHTML( 'afterbegin', template)
}

export default injectStyles
