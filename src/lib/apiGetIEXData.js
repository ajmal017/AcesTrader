// apiGetIEXData.js

import axios from 'axios'
import iexData from '../iex.json'

export const getIEXData = async function(symbol, range, closeOnly, useSandbox = false) {
  const basehtml = useSandbox ? `${iexData.BasehtmlSandbox}` : `${iexData.BasehtmlCloud}`
  const version = iexData.Version
  const query = closeOnly ? 'chartCloseOnly=true' : 'filter=date,open,high,low,close,volume'
  const token = useSandbox ? `token=${iexData.PublishableTestToken}` : `token=${iexData.PublishableToken}`

  // console.log(`### apiGetIEXData ###`)
  // console.log(`${basehtml}${version}/stock/${symbol}/chart/${range}?${query}&${token}`)
  // debugger // pause for developer

  try {
    console.log(`IEX getIEXData`) // BCM IEX
    const request = axios.get(`${basehtml}${version}/stock/${symbol}/chart/${range}?${query}&${token}`)
    let res = await request
    let values = res.data
    let data = values.map((obj) => {
      let date = obj.date
      date = date + 'T15:00:00.000Z'
      obj.date = new Date(date)
      return obj
    })
    return data
  } catch (error) {
    console.log('getIEXData axios error:', error.message)
    alert('getIEXData axios error: ' + error.message) //rude interruption to user
    debugger // pause for developer
  }
}

//     .then((res) => {
//         let values = res.data
//         let data = values.map((obj) => {
//             let date = obj.date
//             date = date + 'T15:00:00.000Z'
//             obj.date = new Date(date)
//             return obj
//         })
//         return data
//     })
//     .catch((error) => {
//         debugger // pause for developer
//         return error
//     })
// return request //let caller handle the promise's .then/.catch completion}
