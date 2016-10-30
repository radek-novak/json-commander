import React, {
  Component,
  PropTypes
 } from 'react'

export default class History extends Component {
  constructor(props) {
    super(props)

    this.change = this.props.change.bind(this)
  }

  render() {
    return (
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
    )
  }
}

History.propTypes = {
  historyList: PropTypes.arrayOf(PropTypes.string).isRequired,
  change: PropTypes.func.isRequired,
}
