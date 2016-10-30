import React, {
  Component,
  PropTypes
} from 'react'
import {
  FORMATTED,
  HISTORY_STORAGE,
  HISTORY_SEPARATOR,
  ERROR_JSONPATH,
  SEND_JSON_STRING
} from '../../constants'
import JsonPathForm from './JsonPathForm'
import SwitchRaw from './SwitchRaw'
import chromeStorage from '../chromeStorage'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      input: '',
      history: [],
      errorMsg: '',
      isFormatted: true
    }

    this.submit = this.submit.bind(this)
    this.changeFormatted = this.props.changeFormatted.bind(this)
    this.insertHtml = this.props.insertHtml.bind(this)
  }

  componentDidMount() {
    const { port, jsonString, insertHtml } = this.props

    port.onMessage.addListener(function(msg) {
      switch(msg.type) {
        case FORMATTED:
          insertHtml(msg.html)
          this.setState(Object.assign({}, this.state, {errorMsg: ''}))

          chromeStorage(msg.inputJsonPath, (newHistSplit) => {
            this.setState(Object.assign({}, this.state, {history: newHistSplit}))
          })

          break;
        case ERROR_JSONPATH:
          this.setState(Object.assign({}, this.state, {errorMsg: msg.errorText}))

          break;
      }
    }.bind(this))

    port.postMessage({
      type: SEND_JSON_STRING,
      text: jsonString,
      length: jsonString.length,
      inputJsonPath: '$'
    })
  }

  submit(input) {
    const { port, jsonString } = this.props

    port.postMessage({
      type: SEND_JSON_STRING,
      text: jsonString,
      length: jsonString.length,
      inputJsonPath: input
    })
  }

  render() {
    return (
      <aside className="controls">
        <SwitchRaw
          callback={this.changeFormatted}
          isFormatted={this.state.isFormatted}
        />
        <JsonPathForm
          {...this.state}
          submit={this.submit}
        />
      </aside>
    )
  }
}

App.propTypes = {
  port: PropTypes.any.isRequired,
  jsonString: PropTypes.string.isRequired,
  changeFormatted: PropTypes.func.isRequired,
  insertHtml: PropTypes.func.isRequired
}
