// canapprun

export default function() {
  // The test for CSS Grid Layout is the @supports(display:grid) used in css .
  // See the splash.css file for the @supports(display:grid) logic.
  var element = document.getElementById('no-cssgrid')
  var style = window.getComputedStyle(element)
  var display = style.getPropertyValue('display')
  //alert("display:" + display);
  if (display === 'block') {
    //Message is turned on by the @supports CSS at-rule
    document.getElementById('loading-gif').className = 'hide'
    document.body.style.paddingTop = 0
    document.getElementById('splashId').style.display = '' //show the splash screen with message
    return false //can not run here, no Grid Layout, error display is shown
  }

  // For testing...
  // https://stackoverflow.com/questions/16162639/difference-between-screen-and-window-property
  var sw = window.screen.width
  var sh = window.screen.height
  // var cw = document.body.clientWidth
  // var ch = document.body.clientHeight
  // var iw = window.innerWidth
  // var ih = window.innerHeight
  // var ow = window.outerWidth
  // var oh = window.outerHeight
  //const msg = `sw=${sw} sh=${sh} iw=${iw} ih=${ih} ow=${ow} oh=${oh} cw=${cw} ch=${ch}`
  // console.log(msg)
  //alert(msg)
  if (sw < 412 || sh < 412) {
    //this is too small a device
    //switch class "hide" ; the warning is shown and the splash screen stays
    document.getElementById('too-small').className = '' //show the message
    document.getElementById('loading-gif').className = 'hide'
    document.body.style.paddingTop = 0
    document.getElementById('splashId').style.display = '' //show the splash screen with message
    return false //should not run here, device too small, error display is shown
  }

  document.getElementById('loading-gif').className = 'hide'
  return true //screen size and grid support are both okay, splash screen still showing for PIN entry
}
