import React, {
  Component,
  PropTypes
} from 'react'
import History from './History'

export default class JsonPathForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      input: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.select = this.select.bind(this)
    this.clearHistory = this.props.clearHistory.bind(this)
  }

  willReceiveProps(nextProps) {
    this.setState({
      input: nextProps.input
    })
  }

  handleChange(e) {
    this.setState({
      input: this.refs.input.value
    })
  }

  select(e) {
    this.setState({
      input: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.submit(this.refs.input.value)
  }

  render() {
    const { history, errorMsg } = this.props
    const { input } = this.state

    return (
      <div>
        <History
          historyList={history}
          change={this.select}
          clearHistory={this.clearHistory}
        />

        <form id="controls__form" onSubmit={this.handleSubmit}>
          <input
            ref="input"
            id="controls__input"
            className="controls__input"
            name="jsonpath"
            value={input}
            onChange={this.handleChange}
            placeholder="jsonpath"
          />
          <i className="controls__error">{errorMsg}</i>
          <button className="controls__submit">run</button>
        </form>
      </div>
    )
  }
}

JsonPathForm.propTypes = {
  input: PropTypes.string.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  errorMsg: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired,
  clearHistory: PropTypes.func.isRequired

}
