function Video() {
  
  var emptyRow = new Uint8Array(128);
  var memory = new Uint8Array(128 * 64);

  var screenWidth = 64;
  var screenHeight = 32;

  var offsetWidth = 128;

  this.memory = function() {
    return memory;
  }

  this.offsetWidth = function() {
    return offsetWidth;
  }

  this.screenWidth = function() {
    return screenWidth;
  }

  this.screenHeight = function() {
    return screenHeight;
  }

  // Returns 1 on 'collision', a bit got erased (1 -> 0), 0 otherwise
  this.putSprite = function(x, y, height, spriteMem, offset) {
    //console.log("x: " + (x % 64) + " y: " + y + " height: " + height);
    x %= screenWidth;
    y %= screenHeight;

    if (height > 0)  return putSprite8x(x, y, height, spriteMem, offset);
    
    return putSprite16x16(x, y, spriteMem, offset);
  }

  this.clear = function() {
    memory = new Uint8Array(128 * 64);
  }

  this.setSupeChipMode = function() {
    screenWidth = 128;
    screenHeight = 64;
  }

  this.scrollDown =  function(lines) {
    //console.log("scrolling down " + lines + " lines.");
    
    var copy = new Uint8Array(128 * 64);

    copy.set(memory.subarray(0, memory.length - 128), 128);

    memory = copy;
  }

  this.scrollLeft = function() {
    //console.log("Scrolling left");
    var copy = new Uint8Array(128 * 64);

    for (var y = 0; y < 64; ++y) {
      var row = memory.subarray(y * 128 + 4,  y * 128 + 4 + 128 - 4);
      copy.set(row, y * 128);
    }
    
    memory = copy;
  }

  this.isSuperChipMode = function() {
    return screenWidth === 128;
  }
  
  function putSprite8x(x, y, height, spriteMem, offset) {
    var endOffset = offset + height;
    var collisionFlag = 0;

    for (; offset < endOffset && y < screenWidth; ++offset) {
      collisionFlag |= xorByte(x, y++, spriteMem[offset]);
    }

    return collisionFlag;
  }

  function putSprite16x16(x, y, spriteMem, offset) {
    var endOffset = offset + 16 * 2;

    var collisionFlag = 0;

    for (; offset < endOffset && y < screenWidth; offset += 2) {
      collisionFlag |= xorWord(x, y++, (spriteMem[offset] << 8) + spriteMem[offset + 1]);
    }
  }

  function xorByte(x, y, b) {
    var erasedBitFlag = 0;

    for (var i = 7; i >= 0 && x < screenWidth; --i) {
      erasedBitFlag |= xorBit(x++, y, (b >>> i) & 1);
    }

    return erasedBitFlag;
  }

  function xorWord(x, y, w) {
    var erasedBitFlag = 0;

    for (var i = 15; i >= 0 && x < screenWidth; --i) {
      erasedBitFlag |= xorBit(x++, y, (w >>> i) & 1);
    }

    return erasedBitFlag;
  }

  function xorBit(x, y, bit) {
    var offset = y * offsetWidth + x;
    var oldPixelState = memory[offset];
    var newPixelState = oldPixelState ^ bit; 

    memory[offset] = newPixelState;

    return (oldPixelState === 1 && newPixelState === 0) ? 1 : 0;
  }

}