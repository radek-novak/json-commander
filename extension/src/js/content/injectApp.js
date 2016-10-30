import React from 'react'
import {render} from 'react-dom'
import App from './components/App'

function injectApp( port, jsonString, changeFormatted, insertHtml) {
  const appElement = document.createElement('div')
  const formatted = document.createElement('div')
  appElement.id = 'The_Application'
  formatted.id = 'formatted'
  appElement.innerText = 'app error' // does this work?
  document.body.append(appElement)
  document.body.append(formatted)

  render(<App
    port={port}
    jsonString={jsonString}
    changeFormatted={changeFormatted}
    insertHtml={insertHtml}
  />, appElement)
}


export default injectApp
