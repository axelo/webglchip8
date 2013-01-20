function Keyboard() {
  
  var keys = [];

  // G upp
  // S ned

  // R upp (R)
  // E ned (R)

  var mappings = {
    0x0 : 192,
    0x1 : 49,
    0x2 : 50,
    0x3 : 51,
    0x4 : 81,
    0x5 : 87,
    0x6 : 69,
    0x7 : 65,
    0x8 : 82,
    0x9 : 68,
    0xa : 90,
    0xb : 88,
    0xc : 67,
    0xd : 86,
    0xe : 70,
    0xf : 16
  };

  this.isKeyDown = function(keyCode) {
    return keys[keyCode] === true;
  }

  this.isHexKeyDown = function(index) {
    //console.log("isHexKeyDown", index);
    return keys[mappings[index]] === true;
  }

  this.getHexKeyPressed = function() {
    //console.log("getHexKeyPressed");
    for (var i = 0; i < 16; ++i) {
      if (this.isHexKeyDown(i)) return i;
    }
    return -1;
  }

  this.setMappings = function(map) {
    mappings = map;
    //console.log("mappings", mappings);
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
