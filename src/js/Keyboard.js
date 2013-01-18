function Keyboard() {
  
  var keys = [];

  // G upp
  // S ned

  // R upp (R)
  // E ned (R)

  var mappings = {
    0x0 : 65,
    0x1 : 83, // Down, left player
    0x2 : 68,
    0x3 : 70,
    0x4 : 87, // Up, left player
    0x5 : 90,
    0x6 : 88,
    0x7 : 67,
    0x8 : 86,
    0x9 : 66,
    0xa : 81,
    0xb : 79,
    0xc : 40, // Down, right player
    0xd : 38, // Up, right player
    0xe : 84,
    0xf : 49
  };

  this.isKeyDown = function(index) {
    return keys[mappings[index]] === true;
  }

  this.isAnyKeyPressed = function() {
    for (var i = 0; i < 16; ++i) {
      if (this.isKeyDown(i)) return true;
    }
    return false;
  }

  this.setMappings = function(map) {
    mappings = map;
  }

  function init() {
    document.onkeydown = onKeyDown;
    document.onkeyup = onKeyUp;
  }

  function onKeyDown(e) {
    keys[e.keyCode] = true;
  }

  function onKeyUp(e) {
    keys[e.keyCode] = false;
  }

  init();
}
