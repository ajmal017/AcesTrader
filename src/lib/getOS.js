// getOS.js

// var userOS = null
export default function() {
  window.userOS = 'unknown' //create a windows global variable
  var ua = navigator.userAgent
  // determine OS
  if (ua.match(/iPad/i) || ua.match(/iPhone/i)) {
    window.userOS = 'iOS'
  } else if (ua.match(/Android/i)) {
    window.userOS = 'Android'
  }
}
