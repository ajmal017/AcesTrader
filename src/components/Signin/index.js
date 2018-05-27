import React from 'react'
import Button from 'react-bootstrap/lib/Button'
import './styles.css'

const Signin = () => {
  'use-strict'
  return (
    <div className="signup-container">
      <div className="item-a">
        <h1>
          <span className="duck-jumbotron">MoneyPlan</span>
        </h1>
      </div>
      <div className="item-b">
        <div>
          <h3>Sign in to MoneyPlan</h3>
        </div>
        <label for="signin-input">Username or Email</label>
        <div>
          <input id="signin-input" />
        </div>
        <label for="signin-pass">Password</label>
        <div>
          <input id="signin-pass" />
        </div>
      </div>
      <div className="item-c">
        <div>
          <input
            type="checkbox"
            name="checkbox"
            id="checkbox_id"
            value="checked"
          />
          <label for="checkbox_id">&nbsp;&nbsp;Remember me</label>
        </div>
      </div>
      <div className="item-d">
        <Button bsStyle="link">Reset password</Button>
      </div>

      <div className="item-e">
        <div className="button-block">
          <Button bsStyle="danger" block>
            &nbsp;&nbsp;&nbsp;&nbsp;Sign in&nbsp;&nbsp;&nbsp;&nbsp;
          </Button>
        </div>
      </div>

      <div className="item-f">
        <Button>&nbsp;&nbsp;&nbsp;&nbsp;Sign up&nbsp;&nbsp;&nbsp;&nbsp;</Button>
      </div>

      <div className="item-g">
        <Button>
          &nbsp;&nbsp;&nbsp;&nbsp;Sign in as guest&nbsp;&nbsp;&nbsp;&nbsp;
        </Button>
      </div>

      <div className="item-h">
        By signing in you agree to the
        <Button bsStyle="link">Privacy Policy</Button>
      </div>

      <div className="item-i">
        <div>
          <h4 style={{ color: 'red' }}>
            Note: This is a mockup of a future feature.<br />
            This page is not functional
          </h4>
        </div>
      </div>
    </div>
  )
}

export default Signin
