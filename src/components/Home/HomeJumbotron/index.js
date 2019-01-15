import React, { Component } from 'react'
import logo from './../../../images/duck.svg'
import './styles.css'
import styled from 'styled-components'

class HeadJumbotron extends Component {
  render() {
    const HeaderContainer = styled.section`
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-items: center;
    `
    return (
      <div>
        <div id='featured' className='jumbotron home-row0 home-row0-background'>
          {/* <div> */}
          {/* <HeaderContainer className='container text-center'> */}
          <HeaderContainer>
            <h1>
              <span className='duck-jumbotron'>AcesTrader</span>
            </h1>
          </HeaderContainer>
          <HeaderContainer>
            <h3>
              <img id='duck-home' src={logo} alt='Logo' width='40' />
              <em>
                <span className='duck-slogan'>An End-of-Day Trading Tool</span>
              </em>
            </h3>
          </HeaderContainer>
        </div>
      </div>
    )
  }
}
export default HeadJumbotron
