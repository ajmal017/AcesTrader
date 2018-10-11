// SignInView.js
import React from 'react'
import PropTypes from 'prop-types'
import { referenceRealtrader, referencePapertrader, referenceDebugtrader } from '../../lib/dbReference'
import './styles.css'

const SignInView = ({ onSubmit, onSignUp, handleChange, handleDemoMode, reference }) => {
  return (
    <div>
      0.1.15
      <span className={'header'}>
        <h1>Log In</h1>
      </span>
      <div className={'formWrapper'}>
        <form onSubmit={onSubmit} id="fields">
          <div id={'loginWrapper'}>
            <label>
              Email
              <input name="email" type="email" className={'inputWrapper'} />
            </label>
            <br />
            <label>
              Password
              <input name="password" type="password" className={'inputWrapper'} />
            </label>
            <div className="radio-row">
              <div className="input-row">
                <input
                  type="radio"
                  className={'radioWrapper'}
                  name={referenceRealtrader}
                  value={referenceRealtrader}
                  checked={reference === referenceRealtrader}
                  onChange={handleChange}
                />
                <label htmlFor="public">&nbsp;Live Trading</label>
              </div>
              <div className="input-row">
                <input
                  type="radio"
                  className={'radioWrapper'}
                  name={referencePapertrader}
                  value={referencePapertrader}
                  checked={reference === referencePapertrader}
                  onChange={handleChange}
                />
                <label htmlFor="public">&nbsp;Paper Money</label>
              </div>
              {process.env.NODE_ENV === 'development' ? (
                <div className="input-row">
                  <input
                    type="radio"
                    className={'radioWrapper'}
                    name={referenceDebugtrader}
                    value={referenceDebugtrader}
                    checked={reference === referenceDebugtrader}
                    onChange={handleChange}
                  />
                  <label htmlFor="private">&nbsp;Beta Testing</label>
                </div>
              ) : (
                <div />
              )}
            </div>
            <span className={'buttonsWrapper'}>
              <button type="submit" className={'buttonSignin'}>
                Log in
              </button>
              {/* <button className={'buttonSignup'} onClick={onSignUp}>
              Sign Up
            </button> */}
            </span>
          </div>

          <button onClick={handleDemoMode} className={'buttonsWrapper demomode'}>
            Guest Mode - Paper Trading
          </button>
        </form>
      </div>
    </div>
  )
}

SignInView.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onSignUp: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleDemoMode: PropTypes.func.isRequired,
  reference: PropTypes.string.isRequired,
}

export default SignInView
