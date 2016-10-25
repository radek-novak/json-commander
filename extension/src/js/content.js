import isJson from './content/isJson'
import getJson from './content/getJson'
import controls from './content/controls'
import {
  MESSAGE,
  SEND_JSON_STRING,
  PORTNAME,
  FORMATTED
} from './constants'
import expanderClick from './content/expanderClick'

// var css = require('../content')
let preTags = null

const main = (json) => {
  const port = chrome.extension.connect({name: PORTNAME})
  if (!port) return

  // inject html for controls and return hooks
  const controlsHooks = controls()

  controlsHooks.form.addEventListener('submit', e => {
    e.preventDefault()

    port.postMessage({
      type: SEND_JSON_STRING,
      text: json,
      length: json.length,
      inputJsonPath: controlsHooks.input.value || '$'
    })
  })

  port.onMessage.addListener(function(msg) {
    console.log('msg from bg', msg);
    if (msg[0] === FORMATTED) {
      controlsHooks.inside.innerHTML = msg[1]
      // document.getElementsByTagName('pre')[0].hidden = true
      preTags = document.getElementsByTagName('pre')

      preTags[0].hidden = true
    }
  })

  controlsHooks.switcherRaw.addEventListener('change', (e) => {
    controlsHooks.inside.hidden = true
    document.querySelector('pre').hidden = false
  })
  controlsHooks.switcherFormatted.addEventListener('change', (e) => {
    controlsHooks.inside.hidden = false
    document.querySelector('pre').hidden = true
  })
  document.addEventListener(
    'click',
    expanderClick,
    false // No need to propogate down
  )

  port.postMessage({
    type: SEND_JSON_STRING,
    text: json,
    length: json.length,
    inputJsonPath: controlsHooks.input.value || '$'
  })
}

window.onload = () => {
  const jsonString = getJson()

  if (jsonString) {

    main(jsonString)

  }
}
