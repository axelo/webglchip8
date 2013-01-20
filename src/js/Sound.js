function Sound() {
  
  var context = new webkitAudioContext();
  var gainNode = context.createGainNode();
  var oscillator = context.createOscillator();

  var isPlaying = false;
  var isMuted = false;
  var isForcedMute = false;

  gainNode.connect(context.destination);
  gainNode.gain.value = 0.5;

  oscillator.type = 2; // sawtooth
  oscillator.frequency = 440;
  oscillator.noteOn(0);

  this.isPlaying = function() {
    return isPlaying;
  }

  this.play = function() {
    oscillator.connect(gainNode);
    isPlaying = true;
  }

  this.stop = function() {
    if (isPlaying) {
      console.log("stopping sound.");
      oscillator.disconnect();
      isPlaying = false;
    }
  }

  this.isMuted = function() {
    return isMuted;
  }

  this.mute = function() {
    gainNode.gain.value = 0;
    isMuted = true;
  }

  this.unmute = function() {
    gainNode.gain.value = 0.5;
    isMuted = false;
    isForcedMute = false;
  }

  this.forceMute = function() {
    if (!isMuted) {
      this.mute();
      isForcedMute = true;
    }
  }

  this.isForcedMute = function() {
    return isForcedMute;
  }

}