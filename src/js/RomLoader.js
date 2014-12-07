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

  this.loadMeta = function(romName, cb) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "chip8roms/" + romName + ".json", true);
    xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2005 00:00:00 GMT");
    
    xhr.onerror = function(e) {
      console.log("Rom meta error", romName);
      cb(e);
    }

    xhr.onload = function(e) {
      console.log("Rom meta for '" + romName + "' loaded.");
      cb(undefined, JSON.parse(xhr.responseText));
    }

    xhr.send();
  }

}