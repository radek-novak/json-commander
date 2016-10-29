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

let preTags = null

const main = (json) => {
  const port = chrome.extension.connect({name: PORTNAME})
  if (!port) return
  // chrome.storage.sync.clear()
  const postMessage = (msg) => {
    port.postMessage(msg)
  }

  // inject html for controls and return hooks
  const controlsHooks = viewControls()

  controlsHooks.form.addEventListener('submit', e => {
    e.preventDefault()

    postMessage({
      type: SEND_JSON_STRING,
      text: json,
      length: json.length,
      inputJsonPath: controlsHooks.input.value || '$'
    })
  })

  port.onMessage.addListener(function(msg) {
    switch(msg.type) {
      case FORMATTED:
        controlsHooks.inside.innerHTML = msg.html
        preTags = document.getElementsByTagName('pre')
        controlsHooks.errorMsg.innerText = ''
        preTags[0].hidden = true

        chrome.storage.sync.get(HISTORY_STORAGE, (history = { [HISTORY_STORAGE]: '' }) => {
          const oldHist = history.hasOwnProperty(HISTORY_STORAGE) ? history[HISTORY_STORAGE] : ''
          const oldHistSplit = oldHist.split(HISTORY_SEPARATOR)
          const newHistSplit = [...(new Set(oldHistSplit).add(msg.inputJsonPath))]
          const newHist = newHistSplit.join(HISTORY_SEPARATOR)

          chrome.storage.sync.set({[HISTORY_STORAGE]: newHist}, () => {
            controlsHooks.history.innerHTML = newHistSplit.map(jp => `<option>${jp}</input>`).join('')
          })
        })
        break;
      case ERROR_JSONPATH:
        controlsHooks.errorMsg.innerText = msg.errorText
        break;
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

  controlsHooks.history.addEventListener('change', (e) => {
    controlsHooks.input.value = e.target.value
  })

  document.addEventListener(
    'click',
    expanderClick,
    false
  )


  postMessage({
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
