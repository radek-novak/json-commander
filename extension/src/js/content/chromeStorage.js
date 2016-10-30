import {
  FORMATTED,
  HISTORY_STORAGE,
  HISTORY_SEPARATOR,
  ERROR_JSONPATH,
  SEND_JSON_STRING
} from '../constants'

export default function (jsonpath, callback) {
  chrome.storage.sync.get(HISTORY_STORAGE, (history = { [HISTORY_STORAGE]: '' }) => {
    const oldHist = history.hasOwnProperty(HISTORY_STORAGE) ? history[HISTORY_STORAGE] : ''
    const oldHistSplit = oldHist.split(HISTORY_SEPARATOR)
    const newHistSplit = [...(new Set(oldHistSplit).add(jsonpath))].filter(h => h.length > 0)
    const newHist = newHistSplit.join(HISTORY_SEPARATOR)

    chrome.storage.sync.set({[HISTORY_STORAGE]: newHist}, () => callback(newHistSplit.reverse()))
  })
}

export function clear() {
  chrome.storage.sync.clear()
}
