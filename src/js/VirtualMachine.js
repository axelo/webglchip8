function VirtualMachine(font, video, keyboard) {
  
  var isRomLoaded;

  var delayTimer;
  var delayTimerPrecision;

  this.reset = function() {
    this.mem = new Uint8Array(4*1024); // 0x1000
    this.v = new Uint8Array(16);
    this.i = 0;
    this.pc = 0x200;
    this.stack = new Uint16Array(16);
    this.sp = 0;

    delayTimer = delayTimerPrecision = 0;

    this.st = 0;
    this.video = video;
    this.keyboard = keyboard;
    this.halted = false;

    isRomLoaded = false;
  }

  this.load = function(rom) {
    this.mem.set(new Uint8Array(font));
    this.mem.set(new Uint8Array(rom), 0x200);
    isRomLoaded = true;
  }

  this.isRomLoaded = function() {
    return isRomLoaded;
  }

  this.fetch = function() {
    if (this.pc >= this.mem.length || this.pc < 0) throw "Program counter out of bounds: " + this.pc.toString(16);

    var opcode = (this.mem[this.pc++] << 8) + this.mem[this.pc++];

    // console.log(padWord(this.pc-2) + " : " + opcodeToString(opcode));
    return opcode;
  }

  this.delayTimer = function(val) {
    if (val !== undefined) delayTimer = delayTimerPrecision = val;
    return delayTimer;
  }

  this.updateDelayTimer = function(elapsed) {
    delayTimerPrecision -= (60 * elapsed) / 1000.0;
    if (delayTimerPrecision < 0) delayTimerPrecision = 0;

    delayTimer = Math.ceil(delayTimerPrecision) & 0xff;
  }

  function opcodeToString(opcode) {
    // Big-endian
    return "0x" + ("00" + (opcode >>> 8).toString(16)).substr(-2) + ("00" + (opcode & 0xff).toString(16)).substr(-2)
  }

  function padWord(pc) {
    return "0x" + ("0000" + pc.toString(16)).substr(-4);
  }

  this.reset();
}
