import isJson from './content/isJson'
import getJson from './content/getJson'
import viewControls from './content/viewControls'
import {
  MESSAGE,
  SEND_JSON_STRING,
  PORTNAME,
  FORMATTED,
  ERROR_JSONPATH,
  HISTORY_STORAGE,
  HISTORY_SEPARATOR
} from './constants'
import expanderClick from './content/expanderClick'
import injectApp from './content/injectApp'
import injectStyles from './content/injectStyles'


const main = (json) => {
  const port = chrome.extension.connect({name: PORTNAME})
  if (!port) return

  const postMessage = (msg) => {
    port.postMessage(msg)
  }
  const preTags = document.getElementsByTagName('pre')
  const preTag = preTags[0]

  const jsonString = preTag.innerText
  preTag.hidden = true

  injectStyles()

  injectApp(port, jsonString, (hideOrig) => () => {
    const formatted = document.getElementById('formatted')

    preTag.hidden = hideOrig
    formatted.hidden = !preTag.hidden

  }, (html) => {
      const formatted = document.getElementById('formatted')

      if (typeof html === 'string')
        formatted.innerHTML = html
    }
  )

  document.addEventListener(
    'click',
    expanderClick,
    false
  )
}

window.onload = () => {
  const jsonString = getJson()

  if (jsonString) {
    main(jsonString)
  }
}
