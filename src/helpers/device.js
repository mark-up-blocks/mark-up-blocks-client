// https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
function isTouchDevice() {
  return (("ontouchstart" in window)
     || (navigator.maxTouchPoints > 0)
     || (navigator.msMaxTouchPoints > 0));
}

export default isTouchDevice;
