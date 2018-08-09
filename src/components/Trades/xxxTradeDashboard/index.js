//TradeDashboard/index.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { removeResultFromList } from '../../../redux/reducerResults'
import PropTypes from 'prop-types'
import './styles.css'

class TradeDashboard extends Component {
  constructor(props) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this)
    this.state = {}
  }

  handleDelete(event) {
    event.preventDefault()
    this.props.dispatch(removeResultFromList(this.symbol))
  }

  render() {
    //handle new props with changed state of cellObjects
    this.watched = this.props.cellObject.watched
    this.entered = this.props.cellObject.entered
    this.enteredPrice = this.props.cellObject.enteredPrice
    this.exited = this.props.cellObject.exited
    this.exitedPrice = this.props.cellObject.exitedPrice
    this.symbol = this.props.cellObject.symbol
    this.tradeSide = this.props.cellObject.dashboard.tradeSide
    return (
      <div className="trade-dashboard">
        <div className="trade-dashboard-data">
          <span className="trade-dashboard-header">{this.instruction} Alert: (-not working yet-)</span>
          <form className="trade-dashboard-form">
            <div className="trade-events-log">
              <span className="trade-watched">Watched {this.watched}</span>
              <span className="trade-entered">
                Entered {this.entered}&nbsp;&nbsp; Price {this.enteredPrice}
              </span>
              <span className="trade-entered">
                Exited {this.exited}&nbsp;&nbsp; Price {this.exitedPrice}
              </span>
            </div>
          </form>
          <div className="trade-dashboard-buttons">
            <button onClick={this.handleDelete} className="delete-trade-button">
              DELETE
            </button>
          </div>
        </div>
      </div>
    )
  }
}

TradeDashboard.propTypes = {
  cellObject: PropTypes.object.isRequired,
}

//Note: this used only to get access to "this.props.dispatch", not for state access
//the new "props.cellObject" is created in a parent and passed down
function mapStateToProps(state) {
  return {}
}
export default connect(mapStateToProps)(TradeDashboard)
