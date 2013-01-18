function Renderer2d(canvas) {

  var ctx = canvas.getContext("2d");
  var scale = 1;

  this.scale = function(s) {
    scale = s;
    canvas.width = 64 * scale;
    canvas.height = 32 * scale;
  }

  this.render = function(videoMem) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (var y = 0; y < 32; ++y) {
      for (var x = 0; x < 64; ++x) {

        var pixelState = videoMem[y * 64 + x];

        if (pixelState === 1) ctx.fillStyle = 'white';
        else ctx.fillStyle = 'black';

        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }

}