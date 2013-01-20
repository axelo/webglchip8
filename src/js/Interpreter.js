function Interpreter(vm) {
  
  this.interpret = function(opcode) {

    var highByte = opcode >>> 12;

    switch (highByte) {
      case 0x0:
        if (opcode >>> 8 !== 0) halt(opcode); // 1802 machine code program, this is just a virtual machine

        switch (opcode & 0xff) {
          case 0xe0:
            vm.video.clear();
            break;

          case 0xee:
            if (vm.pc < 0) throw "Stack pointer underflow.";
            vm.pc = vm.stack[--vm.sp];
            break;

          default:
            halt(opcode);
        }
        break;

      case 0x1:
        var val = opcode & 0xfff;
        vm.pc = val;
        break;

      case 0x2:
        var val = opcode & 0xfff;
        vm.stack[vm.sp++] = vm.pc; // return address is current pc as it has been increased already by vm
        vm.pc = val;
        break;

      case 0x3:
        var i = (opcode >>> 8) & 0xf;
        var val = opcode & 0xff;
        if (vm.v[i] === val) vm.pc += 2;
        break;

      case 0x4:
        var i = (opcode >>> 8) & 0xf;
        var val = opcode & 0xff;
        if (vm.v[i] !== val) vm.pc += 2;
        break;

      case 0x5:
        var desti = (opcode >>> 8) & 0xf;
        var srci = (opcode >>> 4) & 0xf;
        if (vm.v[desti] === vm.v[srci]) vm.pc += 2;
        break;

      case 0x6:
        var i = (opcode >>> 8) & 0xf;
        var val = opcode & 0xff;
        vm.v[i] = val;
        break;

      case 0x7:
        var i = (opcode >>> 8) & 0xf;
        var val = opcode & 0xff;
        vm.v[i] = (vm.v[i] + val) & 0xff; // TODO: Must i mask it to 0..ff or should Uint8array fix it for me?
        break;

      case 0x8:
        var desti = (opcode >>> 8) & 0xf;
        var srci = (opcode >>> 4) & 0xf;

        switch (opcode & 0xf) {
          case 0x0:
            vm.v[desti] = vm.v[srci];
            break;

          case 0x1:
            vm.v[desti] |= vm.v[srci];
            break;

          case 0x2:
            vm.v[desti] &= vm.v[srci];
            break;

          case 0x3:
            vm.v[desti] ^= vm.v[srci];
            break;

          case 0x4:
            var res = vm.v[desti] + vm.v[srci];
            vm.v[desti] = res & 0xff;
            vm.v[0xf] = (res >>> 8) & 1;
            break;

          case 0x5:
            var res = vm.v[desti] - vm.v[srci];
            vm.v[desti] = res & 0xff;
            vm.v[0xf] = ~(res >>> 8) & 0x1;
            break;

          case 0x6:
            var carry = vm.v[desti] & 0x1;
            vm.v[desti] >>>= 1;
            vm.v[0xf] = carry;
            break;

          case 0x7:
            var res = vm.v[srci] - vm.v[desti];
            vm.v[desti] = res & 0xff;
            vm.v[0xf] = ~(res >>> 8) & 0x1;
            break;

          case 0xe:
            var carry = (vm.v[desti] >>> 7) & 1;
            vm.v[desti] <<= 1;
            vm.v[desti] &= 0xff;
            vm.v[0xf] = carry;
            break;

          default:
            halt(opcode);
        }
        break;

      case 0x9:
        var desti = (opcode >>> 8) & 0xf;
        var srci = (opcode >>> 4) & 0xf;
        if (vm.v[desti] !== vm.v[srci]) vm.pc += 2;
        break;

      case 0xa:
        var val = opcode & 0xfff;
        vm.i = val;
        break;

      case 0xc:
        var i = (opcode >>> 8) & 0xf;
        var mask = opcode & 0xff;
        vm.v[i] = Math.floor(Math.random() * 0x100) & mask;
        break;

      case 0xd:
        var xi = (opcode >>> 8) & 0xf;
        var yi = (opcode >>> 4) & 0xf;
        var height = opcode & 0xf;
        if (height === 0) console.log("height 0");
        vm.v[0xf] = vm.video.putSprite(vm.v[xi], vm.v[yi], height, vm.mem, vm.i);
        break;

      case 0xe:
        switch (opcode & 0xff) {
          case 0x9e:
            var i = (opcode >>> 8) & 0xf;
            if (vm.keyboard.isHexKeyDown(vm.v[i])) vm.pc += 2;
            break;

          case 0xa1:
            var i = (opcode >>> 8) & 0xf;
            if (!vm.keyboard.isHexKeyDown(vm.v[i])) vm.pc += 2;
            break;

          default:
            halt(opcode);
        }
        break;

      case 0xf:
        switch (opcode & 0xff) {
          case 0x07:
            var i = (opcode >>> 8) & 0xf;
            vm.v[i] = vm.delayTimer();
            break;

          case 0x0a:
            var keypressedi = vm.keyboard.getHexKeyPressed();
            if (keypressedi === -1) vm.pc -= 2; // Try again until any key is pressed
            var i = (opcode >>> 8) & 0xf;
            vm.v[i] = keypressedi;
            break;

          case 0x15:
            var i = (opcode >>> 8) & 0xf;
            vm.delayTimer(vm.v[i]);
            break;

          case 0x18:
            var i = (opcode >>> 8) & 0xf;
            vm.soundTimer(vm.v[i]);
            break;

          case 0x1e:
            var i = (opcode >>> 8) & 0xf;
            vm.i = (vm.i + vm.v[i]) & 0xffff; // 16 or 12 bits, uses 16-bit for now
            break;

          case 0x29: // Point mem reg (i) to font mem, val in reg decides fontchar
            var i = (opcode >>> 8) & 0xf;
            vm.i = vm.v[i] * 5;
            break;

          case 0x33: // Binary Coded Decimal
            var i = (opcode >>> 8) & 0xf;
            var decimal = vm.v[i];
            vm.mem[vm.i] = (decimal / 100) & 0xf;
            vm.mem[vm.i + 1] = ((decimal / 10) % 10) & 0xf;
            vm.mem[vm.i + 2] = (decimal % 10) & 0xf;
            break;

          case 0x55: // Save vreg 0..opcode index to mem
            var endi = (opcode >>> 8) & 0xf;
            for (var i = 0; i <= endi; ++i) vm.mem[vm.i + i] = vm.v[i];
            break;

          case 0x65: // Load from mem into vregs, 0..opcode index
            var endi = (opcode >>> 8) & 0xf;
            for (var i = 0; i <= endi; ++i) vm.v[i] = vm.mem[vm.i + i];
            break;

          default:
            halt(opcode);
        } 
        break;

      default:
        halt(opcode);
    }

  }

  function halt(opcode) {
    vm.halted = true;
    throw padWord(vm.pc) + " : " + opcodeToString(opcode) + " could not interpret.";
  }

  function opcodeToString(opcode) {
    // Big-endian
    return "0x" + ("00" + (opcode >>> 8).toString(16)).substr(-2) + ("00" + (opcode & 0xff).toString(16)).substr(-2)
  }

  function padWord(pc) {
    return "0x" + ("0000" + pc.toString(16)).substr(-4);
  }

}
