import React, { Component } from 'react'
import HomeJumbotron from './HomeJumbotron'
import HomeContent from './HomeContent'
import HomeFootnote from './HomeFootnote'

class Home extends Component {
  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    return (
      <div>
        <div>
          <HomeJumbotron />
        </div>
        <div>
          <HomeContent />
        </div>
        <div>
          <HomeFootnote />
        </div>
      </div>
    )
  }
}

export default Home
