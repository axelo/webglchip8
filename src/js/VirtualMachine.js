function VirtualMachine(font, sound, video, keyboard) {
  
  var isRomLoaded;

  var delayTimer;
  var delayTimerPrecision;

  var soundTimer;
  var soundTimerPrecision;

  this.reset = function() {
    this.mem = new Uint8Array(4*1024); // 0x1000
    this.v = new Uint8Array(16);
    this.i = 0;
    this.pc = 0x200;
    this.stack = new Uint16Array(16);
    this.sp = 0;

    delayTimer = delayTimerPrecision = 0;
    soundTimer = soundTimerPrecision = 0;

    this.video = video;
    this.keyboard = keyboard;
    this.sound = sound;

    sound.stop();

    this.halted = false;

    isRomLoaded = false;
  }

  this.load = function(rom) {
    this.mem.set(new Uint8Array(font));
    this.mem.set(new Uint8Array(rom), 0x200); //, 0, Math.min(rom.length, 0x1000 - 0x200)), 0x200);
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

  this.soundTimer = function(val) {
    if (val !== undefined) {
      soundTimer = soundTimerPrecision = val;

      if (soundTimer > 0) sound.play();
    }

    return soundTimer;
  }

  this.updateSoundTimer = function(elapsed) {
    soundTimerPrecision -= (60 * elapsed) / 1000.0;
    
    if (soundTimerPrecision < 0) {
      soundTimerPrecision = 0;
      sound.stop();
    }

    soundTimer = Math.ceil(soundTimerPrecision) & 0xff;
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
