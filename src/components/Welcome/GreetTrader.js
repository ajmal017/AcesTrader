// Welcome/GreetTrader.js
import React from 'react'
import styled from 'styled-components'
import { getReference } from '../../lib/dbReference'
// import './styles.css'

const GreetTrader = () => {
  let reference = getReference() //indicates user's role
  let cappedReference = reference.charAt(0).toUpperCase() + reference.slice(1)
  let spacedReference
  if (cappedReference.indexOf('trader') > -1) {
    spacedReference = cappedReference.replace('trader', ' Trader')
  } else {
    spacedReference = cappedReference + ' Trader'
  }
  spacedReference.trim()

  const Greeting = styled.section`
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
    margin-bottom: 16px;
  `

  return (
    <Greeting>
      <h1>Greetings {spacedReference}</h1>
    </Greeting>
  )
}
export default GreetTrader
