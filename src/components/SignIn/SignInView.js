// SignInView.js
import React from 'react'
import PropTypes from 'prop-types'
import information from '../../images/help_icon.png'
import './styles.css'

const SignInView = ({ onSubmit, onSignUp, handleDemoMode, handleDemoInfo, email, password }) => {
  const handleDemoInfoClick = function(e) {
    handleDemoInfo(e)
  }

  return (
    <div>
      <div className={'backgroundDollar'}>
        0.2.1
        <span className={'header'}>
          <span>Sign In</span>
        </span>
      </div>
      <div className={'formWrapper'}>
        <form onSubmit={onSubmit} id='fields'>
          <div id={'loginWrapper'}>
            <div className={'input-wrapper'}>
              <label>
                Email
                <input name='email' type='email' className={'inputWrapper'} value={email} />
              </label>
              <br />
              <label>
                Password
                <input name='password' type='password' className={'inputWrapper'} value={password} />
              </label>
            </div>

            <span className={'buttonsWrapper'}>
              <button type='submit' className={'buttonSignin'}>
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
              <img onClick={handleDemoInfoClick} src={information} className={'guestInfoIcon'} alt='' width={30} height={30} />
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
  handleDemoMode: PropTypes.func.isRequired,
  handleDemoInfo: PropTypes.func.isRequired,
  email: PropTypes.string,
  password: PropTypes.string,
}

export default SignInView
