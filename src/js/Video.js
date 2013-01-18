function Video() {
  
  var memory = new Uint8Array(64 * 32);

  this.memory = function() {
    return memory;
  }

  // Returns 1 on 'collision', a bit got erased (1 -> 0), 0 otherwise
  this.putSprite = function(x, y, height, spriteMem, offset) {
    var endOffset = offset + height;
    var collisionFlag = 0;

    for (; offset < endOffset && y < 32; ++offset) {
      collisionFlag |= xorByte(x, y++, spriteMem[offset]);
    }

    return collisionFlag;
  }

  this.clear = function() {
    memory = new Uint8Array(64 * 32);
  }
  
  function xorByte(x, y, b) {
    var erasedBitFlag = 0;

    for (var i = 7; i >= 0 && x < 64; --i) {
      erasedBitFlag |= xorBit(x++, y, (b >>> i) & 1);
    }

    return erasedBitFlag;
  }

  function xorBit(x, y, bit) {
    var offset = y * 64 + x;
    var oldPixelState = memory[offset];
    var newPixelState = oldPixelState ^ bit; 

    memory[offset] = newPixelState;

    return (oldPixelState === 1 && newPixelState === 0) ? 1 : 0;
  }

}