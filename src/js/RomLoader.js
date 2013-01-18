function RomLoader() {
  
  this.load = function(romName, cb, cberror) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "chip8roms/" + romName, true);
    xhr.responseType = "arraybuffer";
    
    xhr.onload = function(e) {
      if (xhr.status === 200) {
        console.log("Rom '" + romName + "' loaded.");
        cb(xhr.response);
      }
      else {
        console.log("Rom load error", romName);
        cberror();
      }
    };

    xhr.onerror = function(e) {
      console.log("Rom load error", romName);
      cberror();
    }

    xhr.send();
  }

  this.loadMeta = function(romName) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "chip8roms/" + romName + ".json", false); // TODO: async

    xhr.onerror = function(e) {
      console.log("Rom meta error", romName);
    }

    xhr.send();

    if (xhr.status === 200) {
      console.log("Rom meta for '" + romName + "' loaded.");
      return JSON.parse(xhr.responseText);
    }
    else {
      console.log("Rom meta load error", romName);
    }
  }

}