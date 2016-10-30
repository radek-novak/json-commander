import React, {
  Component,
  PropTypes
 } from 'react'

import { clear } from '../chromeStorage'

export default class History extends Component {
  constructor(props) {
    super(props)

    this.change = this.props.change.bind(this)
    this.clearHistory = this.props.clearHistory.bind(this)
  }

  render() {
    return (
      <div>
        <div className="controls__history-header">
          <label className="controls__history-label">history</label>
          <button
            onClick={this.clearHistory}
            className="controls__clear-history">clear</button>
        </div>
        <select
          onChange={this.change}
          className="controls__history"
          size="5"
        >
          {
            this.props.historyList.map((item, i) =>
              <option key={`historyItem${i}`}>{item}</option>
            )
          }
        </select>
      </div>
    )
  }
}

History.propTypes = {
  historyList: PropTypes.arrayOf(PropTypes.string).isRequired,
  change: PropTypes.func.isRequired,
}
