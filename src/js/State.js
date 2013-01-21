function State(vm) {
  
  // TODO - state/game OR save mappings + cam
  this.save = function() {
    console.log("Saving state...");

    var state = {
      mem : ArraySerializer.encode(vm.mem),
      v : ArraySerializer.encode(vm.v),
      stack : ArraySerializer.encode(vm.stack),
      hp48flag : ArraySerializer.encode(vm.hp48flag),
      videomem : ArraySerializer.encode(vm.video.memory()),
      pc : vm.pc,
      sp : vm.sp,
      i : vm.i,
      delay : vm.delayTimer(),
      delayPrecision : vm.delayTimerPrecision(),
      sound : vm.soundTimer(),
      soundPrecision : vm.soundTimerPrecision(),
      isHalted : vm.halted,
      isSuperChip : vm.video.isSuperChipMode()
    }

    var serialized = JSON.stringify(state);

    localStorage.quickstate =  serialized;

    var size = serialized.length;

    console.log("Saved " + size + " chars");
  }

  this.load = function() {
    var state = localStorage.quickstate;

    if (!state) {
      console.log("No state saved.")
      return;
    }

    console.log("Restoring state...");

    state = JSON.parse(state);

    vm.halted = true;

    vm.mem = ArraySerializer.decode8(state.mem);
    vm.v = ArraySerializer.decode8(state.v);
    vm.stack = ArraySerializer.decode16(state.stack);
    vm.hp48flag = ArraySerializer.decode8(state.hp48flag);
    vm.video.setMemory(ArraySerializer.decode8(state.videomem));
    vm.pc = parseInt(state.pc);
    vm.sp = parseInt(state.sp);
    vm.i = parseInt(state.i);
    vm.delayTimer(parseInt(state.delay));
    vm.delayTimerPrecision(parseFloat(state.delayPrecision));
    vm.soundTimer(parseInt(state.sound));
    vm.soundTimerPrecision(parseFloat(state.soundPrecision));

    if (state.isSuperChip) vm.video.setSupeChipMode();
    else vm.video.setChip8Mode();

    vm.halted = state.isHalted;

    if (!vm.halted && vm.soundTimer() > 0) vm.sound.play();
  }

};