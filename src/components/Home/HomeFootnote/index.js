import React, { Component } from 'react'
import './styles.css'
class HomeFootnote extends Component {
  render() {
    return (
      <div className='footnote'>
        <span>
          Copyright &copy; 2018-2019{' '}
          <a href={process.env.PUBLIC_URL + '/bm.html'} target='_blank' rel=' noopener noreferrer'>
            Bruce Martin
          </a>
        </span>
        <a href="https://iexcloud.io">Data provided by IEX Cloud</a>
        <span className='duckimagecredit'>
          Duck image by{' '}
          <a href='http://delapouite.com' target='_blank' rel=' noopener noreferrer'>
            Delapouite
          </a>{' '}
          under{' '}
          <a href='http://creativecommons.org/licenses/by/3.0/' target='_blank' rel='noopener noreferrer'>
            CC BY 3.0
          </a>
        </span>
      </div>
    )
  }
}
export default HomeFootnote
