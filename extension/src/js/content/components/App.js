import React, {
  Component,
  PropTypes
} from 'react'
import {
  FORMATTED,
  ERROR_JSONPATH,
  SEND_JSON_STRING
} from '../../constants'
import JsonPathForm from './JsonPathForm'
import SwitchRaw from './SwitchRaw'
import chromeStorage from '../chromeStorage'
import { clear } from '../chromeStorage'


export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      input: '',
      history: [],
      errorMsg: '',
      isFormatted: true,
      showControls: true
    }

    this.submit = this.submit.bind(this)
    this.initMessage = this.initMessage.bind(this)
    this.clearHistory = this.clearHistory.bind(this)
    this.changeFormatted = this.changeFormatted.bind(this)
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

    this.initMessage()
  }

  initMessage() {
    const { port, jsonString } = this.props

    port.postMessage({
      type: SEND_JSON_STRING,
      text: jsonString,
      length: jsonString.length,
      inputJsonPath: '$'
    })
  }

  clearHistory() {
    if (confirm('Delete history?')) {
      clear()
      this.setState({
        history: []
      })
    }
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

  changeFormatted(hideOrig) {
    return function() {
      this.setState({
        showControls: hideOrig
      })

      this.props.changeFormatted(hideOrig)()
      this.initMessage()
    }.bind(this)
  }

  render() {
    return (
      <aside className="controls">
        <SwitchRaw
          callback={this.changeFormatted}
          isFormatted={this.state.isFormatted}
        />
        {this.state.showControls ?
          <JsonPathForm
            {...this.state}
            submit={this.submit}
            clearHistory={this.clearHistory}
          />
          :
          null}
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
