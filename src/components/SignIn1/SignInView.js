// SignInView.js
import React from 'react'
import PropTypes from 'prop-types'

const Title = 'Log In'

const localStyles = {
  wrapper: {
    backfaceVisibility: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    transform: 'rotateY(0deg)',
    width: '100%',
  },
  inputWrapper: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsWrapper: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 344,
    height: 40,
    margin: '15px 0',
  },
  recoverPasswordWrapper: {
    width: '100%',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recoverPassword: {
    textAlign: 'center',
    cursor: 'pointer',
    margin: '20px 0',
    padding: 15,
  },
  button: {
    margin: '0 15px',
    padding: 15,
  },
  title: {
    textAlign: 'center',
    height: 40,
    lineHeight: '40px',
  },
}

// {
//   console.log(styles)
//   return <div style={Object.assign(styles.wrapper, styles.mainWrapper)} />
// }

const SignInView = ({
  email,
  password,
  onSubmit,
  onSignUp,
  onDemoMode,
  onRealTrader,
  onPaperTrader,
  onDebugTrader,
  styles,
  usernameCustomLabel,
  passwordCustomLabel,
  recoverPasswordCustomLabel,
  goToSignupCustomLabel,
  submitLoginCustomLabel,
}) => {
  const handleChange = (name, value) => {
    console.log(name, value)
  }
  const handleShowRecover = (name, value) => {
    console.log(name, value)
  }
  const handleShowSignup = (name, value) => {
    console.log(name, value)
  }
  const handleLogin = (name, value) => {
    console.log(name, value)
  }
  return (
    <section id="main-wrapper" style={Object.assign(styles.wrapper)}>
      <h1 style={Object.assign(localStyles.title)}>{Title}</h1>
      <section id="login-form" style={Object.assign({}, localStyles.wrapper, styles.wrapper)}>
        <div id="fields" style={Object.assign({}, localStyles.inputWrapper, styles.inputWrapper)}>
          <input
            style={Object.assign({}, localStyles.input, styles.input)}
            type="text"
            id="username"
            name="username"
            placeholder={usernameCustomLabel}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            value={email}
          />
          <input
            style={Object.assign({}, localStyles.input, styles.input)}
            type="password"
            id="password"
            name="password"
            placeholder={passwordCustomLabel}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            value={password}
          />
        </div>
        <div style={Object.assign({}, localStyles.buttonsWrapper, styles.buttonsWrapper)}>
          <div style={Object.assign({}, localStyles.recoverPasswordWrapper, styles.recoverPasswordWrapper)}>
            <button
              id="recorver-password"
              type="button"
              style={Object.assign({}, localStyles.recoverPassword, styles.recoverPasswordButton)}
              onClick={() => {
                handleShowRecover('isRecoveringPassword', true)
              }}>
              {recoverPasswordCustomLabel}
            </button>
          </div>
          <button
            id="signup-button"
            type="button"
            style={Object.assign({}, localStyles.button, styles.button)}
            onClick={() => {
              handleShowSignup('isLogin', false)
            }}>
            {goToSignupCustomLabel}
          </button>
          <input
            id="submit-login"
            name="submit-login"
            value={submitLoginCustomLabel}
            type="submit"
            style={Object.assign({}, localStyles.button, styles.button)}
            onClick={handleLogin}
          />
        </div>
      </section>
    </section>
  )

  // return (
  //   <div>
  //     <h1>Log in</h1>
  //     <form onSubmit={onSubmit}>
  //       <span onClick={onRealTrader}>Real Trader </span> <span onClick={onPaperTrader}> Paper Trader </span> <span onClick={onDebugTrader}> Debug Trader</span>
  //       <br />
  //       <br />
  //       <label>
  //         Email
  //         <input style={{ width: '100%' }} name="email" type="email" />
  //       </label>
  //       <br />
  //       <label>
  //         Password
  //         <input style={{ width: '100%' }} name="password" type="password" />
  //       </label>
  //       <br />
  //       <button type="submit">Log in</button>
  //       <br />
  //       <br />
  //       <button onClick={onSignUp}>Sign Up</button>
  //       <br />
  //       <br />
  //       <br />
  //       <button onClick={onDemoMode}>Demo Mode</button>
  //     </form>
  //   </div>
  // )
}

SignInView.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSignUp: PropTypes.func.isRequired,
  onDemoMode: PropTypes.func.isRequired,
  onLiveTrader: PropTypes.func.isRequired,
  onPaperTrader: PropTypes.func.isRequired,
  onDebugTrader: PropTypes.func.isRequired,
  styles: PropTypes.shape({
    wrapper: PropTypes.object,
    inputWrapper: PropTypes.object,
    buttonsWrapper: PropTypes.object,
    input: PropTypes.object,
    recoverPasswordWrapper: PropTypes.object,
    recoverPasswordButton: PropTypes.object,
    button: PropTypes.object,
  }),
  usernameCustomLabel: PropTypes.string.isRequired,
  passwordCustomLabel: PropTypes.string.isRequired,
  recoverPasswordCustomLabel: PropTypes.string.isRequired,
  goToSignupCustomLabel: PropTypes.string.isRequired,
  submitLoginCustomLabel: PropTypes.string.isRequired,
}

SignInView.defaultProps = {
  styles: {},
}

export default SignInView
