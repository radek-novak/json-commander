const css = require('../../styles/style')

const template = `
  <style>
  ${css}
  </style>
`

const injectStyles = () => {
  document.head.insertAdjacentHTML( 'afterbegin', template)
}

export default injectStyles
