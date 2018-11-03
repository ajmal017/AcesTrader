// SignInView.js
import React from 'react'
import PropTypes from 'prop-types'
import { referenceRealtrader, referencePapertrader, referenceDebugtrader } from '../../lib/dbReference'
import information from '../../images/help_icon.png'
import './styles.css'

const SignInView = ({ onSubmit, onSignUp, handleChange, handleDemoMode, handleDemoInfo, reference }) => {
  const handleDemoInfoClick = function(e) {
    // alert('handleInfoClick')
    handleDemoInfo(e)
  }

  return (
    <div>
      0.1.30
      <span className={'header'}>
        <h1>Sign In</h1>
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
                Sign In
              </button>
              {/* <button className={'buttonSignup'} onClick={onSignUp}>
              Sign Up
            </button> */}
            </span>
          </div>

          <span className={'buttonsWrapper buttonsDemo'}>
            <div>
              <button onClick={handleDemoMode} className={'demomode'}>
                Guest Sign In
              </button>
              <img onClick={handleDemoInfoClick} src={information} className={'guestInfoIcon'} alt="" width={30} height={30} />
            </div>
          </span>
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
  handleDemoInfo: PropTypes.func.isRequired,
  reference: PropTypes.string.isRequired,
}

export default SignInView
