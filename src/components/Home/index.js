import React, { Component } from 'react'
import HomeJumbotron from './HomeJumbotron'
import HomeContent from './HomeContent'
// import HomeRow1 from './HomeRow1'
// import HomeRow2 from './HomeRow2'
// import HomeRow3 from './HomeRow3'
// import HomeRow4 from './HomeRow4'
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

        {/* <div>
                    <HomeRow1 />
                </div>
                <div>
                    <HomeRow2 />
                </div>
                <div>
                    <HomeRow3 />
                </div>
                <div>
                    <HomeRow4 />
                </div> */}

        <div>
          <HomeFootnote />
        </div>
      </div>
    )
  }
}

export default Home
