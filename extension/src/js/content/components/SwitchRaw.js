import React, {
  Component,
  PropTypes
 } from 'react'


export default class SwitchRaw extends Component {
  render() {
    const { callback, isFormatted } = this.props
    return (
      <div className="controls__raw-switch">
        <div className="col-50">
          <input
            onChange={callback(false)}
            type="radio"
            name="switcher"
            value="raw"
            id="controls__raw"
            defaultChecked={!isFormatted}
            />
          <label htmlFor="controls__raw">raw</label>
        </div>
        <div className="col-50">
          <input
            onChange={callback(true)}
            type="radio"
            name="switcher"
            value="formatted"
            id="controls__formatted"
            defaultChecked={isFormatted}
          />
          <label htmlFor="controls__formatted">formatted</label>
        </div>
      </div>
    )
  }
}

SwitchRaw.propTypes = {
  callback: PropTypes.func.isRequired,
  isFormatted: PropTypes.bool.isRequired
}
