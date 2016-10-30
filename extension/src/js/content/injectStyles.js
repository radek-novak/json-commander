const css = require('../../styles')

const template = `
  <style>
  ${css}
  </style>
`

const injectStyles = () => {
  document.body.insertAdjacentHTML( 'afterbegin', template)
}

export default injectStyles
