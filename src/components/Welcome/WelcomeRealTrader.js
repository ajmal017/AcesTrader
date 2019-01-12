// WelcomeRealTrader.js

import React, { Component } from 'react'

import { putReference, getReference, ameritrade, schwab, paper } from '../../lib/dbReference'
import { referenceRealtrader, referencePapertrader, referenceDebugtrader } from '../../lib/dbReference'
import './styles.css'

class WelcomeRealTrader extends Component {
  //
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleStart = this.handleStart.bind(this)
    this.state = getReference() ? { reference: getReference() } : {}
  }

  componentDidMount() {
    this.setState({ reference: getReference() })
  }

  handleChange = (event) => {
    putReference(event.target.value)
    this.setState({ reference: event.target.value }) //change Database selection
  }

  handleStart = async (event) => {
    event.preventDefault()
    putReference(this.state.reference) // this is the selected database reference
    this.props.history.push('/startUp')
  }

  render() {
    putReference(this.state.reference)
    return (
      <div className={'welcome-content'}>
        <h2>Choose The Account To Trade</h2>
        <div className='radio-row'>
          <div className='radio-item'>
            <input type='radio' className={'radioWrapper'} name={ameritrade} value={ameritrade} checked={this.state.reference === ameritrade} onChange={this.handleChange} />
            <label htmlFor='public'>&nbsp;TD Ameritrade</label>
          </div>
          <div className='radio-item'>
            <input type='radio' className={'radioWrapper'} name={schwab} value={schwab} checked={this.state.reference === schwab} onChange={this.handleChange} />
            <label htmlFor='public'>&nbsp;Schwab</label>
          </div>
          <div className='radio-item'>
            <input type='radio' className={'radioWrapper'} name={paper} value={paper} checked={this.state.reference === paper} onChange={this.handleChange} />
            <label htmlFor='private'>&nbsp;Paper</label>
          </div>
        </div>

        {process.env.NODE_ENV === 'development' ? (
          <div className='radio-row'>
            <div className='radio-item'>
              <input
                type='radio'
                className={'radioWrapper'}
                name={referenceRealtrader}
                value={referenceRealtrader}
                checked={this.state.reference === referenceRealtrader}
                onChange={this.handleChange}
              />
              <label htmlFor='public'>&nbsp;Live Trading</label>
            </div>
            <div className='radio-item'>
              <input
                type='radio'
                className={'radioWrapper'}
                name={referencePapertrader}
                value={referencePapertrader}
                checked={this.state.reference === referencePapertrader}
                onChange={this.handleChange}
              />
              <label htmlFor='public'>&nbsp;Paper Money Trading</label>
            </div>
            <div className='radio-item'>
              <input
                type='radio'
                className={'radioWrapper'}
                name={referenceDebugtrader}
                value={referenceDebugtrader}
                checked={this.state.reference === referenceDebugtrader}
                onChange={this.handleChange}
              />
              <label htmlFor='private'>&nbsp;Simulated Trading</label>
            </div>
          </div>
        ) : (
          <div />
        )}

        <span className={'buttonsWrapper'}>
          <button className={'buttonSignup'} onClick={this.handleStart}>
            Start
          </button>
        </span>
      </div>
    )
  }
}
export default WelcomeRealTrader
