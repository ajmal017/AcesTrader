// SignInView.js
import React from 'react'
import PropTypes from 'prop-types'
// import information from '../../images/help_icon.png'
import './styles.css'

const SignInView = ({ onSubmit }) => {
  let email, password
  return (
    <div>
      <div className={'backgroundDollar'}>
        15.0.0
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
              <button type='submit' className={process.env.NODE_ENV === 'development' ? 'buttonSigninDev' : 'buttonSignin'}>
                Sign In
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

SignInView.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  email: PropTypes.string,
  password: PropTypes.string,
}

export default SignInView
