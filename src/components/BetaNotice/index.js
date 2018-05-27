import React, { Component } from 'react'
import './styles.css'

class BetaNotice extends Component {
  constructor(props) {
    super(props)
    this.pageName = props.pageName
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    return (
      <div className="betanotice">
        <div className="box a">
          <h3>"{this.pageName}" is not working yet.</h3>
        </div>
        <div className="box b">{/* <h3>Current Project Status Information.</h3> */}</div>

        <div className="box c" />
        <div className="box d" />
        <div className="box e" />
        <div className="box f" />
      </div>
    )
  }
}

export default BetaNotice
