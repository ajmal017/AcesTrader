// SignInView.js
import React from 'react'

const SignInView = ({ onSubmit, onSignUp, onDemoMode, onRealTrader, onPaperTrader, onDebugTrader }) => {
  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={onSubmit}>
        <span onClick={onRealTrader}>Real Trader </span> <span onClick={onPaperTrader}> Paper Trader </span> <span onClick={onDebugTrader}> Debug Trader</span>
        <br />
        <br />
        <label>
          Email
          <input style={{ width: '100%' }} name="email" type="email" />
        </label>
        <br />
        <label>
          Password
          <input style={{ width: '100%' }} name="password" type="password" />
        </label>
        <br />
        <button type="submit">Log in</button>
        <br />
        <br />
        <button onClick={onSignUp}>Sign Up</button>
        <br />
        <br />
        <br />
        <button onClick={onDemoMode}>Demo Mode</button>
      </form>
    </div>
  )
}

export default SignInView
