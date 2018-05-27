import React, { Component } from 'react'
import BetaNotice from '../BetaNotice'
import './styles.css'

class Readme extends Component {
  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    return (
      <div>
        <BetaNotice pageName={'Readme'} />

        {/* <div className={'about-text'}>
          <p className={'about-paragraph'}>
            <em>
              <h3>Click "MoneyPlan" in the navigation bar for Plans and Charts</h3>
            </em>
          </p>
        </div> */}

        <br />

        <div className={'about-footer'}>
          Located in NYC:
          <span className={'about-email'}>
            <a href="&#109;&#97;&#105;&#108;&#116;&#111;&#058;&#115;&#117;&#112;&#112;&#111;&#114;&#116;&#064;&#109;&#097;&#114;&#116;&#105;&#110;&#097;&#112;&#112;&#115;&#046;&#099;&#111;&#109;">
              {' '}
              &#115;&#117;&#112;&#112;&#111;&#114;&#116;&#064;&#109;&#097;&#114;&#116;&#105;&#110;&#097;&#112;&#112;&#115;&#046;&#099;&#111;&#109;
            </a>
          </span>
        </div>

        <br />

        <div className={'about-footer'}>
          <span>
            Copyright &copy; 2018{' '}
            <a href={process.env.PUBLIC_URL + '/bm.html'} target="_blank" rel=" noopener noreferrer">
              Bruce Martin
            </a>
          </span>
        </div>

        {/* <div className={'about-footer'}>
          <span>
            Toolbar icons by <a href="https://icons8.com/color-icons">Icons8</a> under{' '}
            <a href="https://creativecommons.org/licenses/by-nd/3.0/" target="_blank" rel="noopener noreferrer">
              {' '}
              CC BY-ND 3.0
            </a>
          </span>
        </div> */}

        {/* <div className={'about-footer'}>
          <span>
            Duck image by{' '}
            <a href="http://delapouite.com" target="_blank" rel=" noopener noreferrer">
              Delapouite
            </a>{' '}
            under{' '}
            <a href="http://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">
              CC BY 3.0
            </a>
          </span>
        </div>*/}

        <div className={'about-footer'}>{/* <span id="owner">By <a href="http://www.martinapps.com" target="_blank">MartinApps</a></span> */}</div>

        <br />
        <br />
      </div>
    )
  }
}

export default Readme
