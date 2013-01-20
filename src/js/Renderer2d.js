function Renderer2d(canvas) {

  var ctx = canvas.getContext("2d");
  var scale = 1;

  this.scale = function(s) {
    scale = s;
    canvas.width = 128 * scale;
    canvas.height = 64 * scale;
  }

  this.render = function(video) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    var videoMem = video.memory();
    var offsetWidth = video.offsetWidth();
    var screenWidth = video.screenWidth();
    var screenHeight = video.screenHeight();

    var chip8Scale = screenWidth === 128 ? 1 : 2;

    for (var y = 0; y < screenHeight; ++y) {
      for (var x = 0; x < screenWidth; ++x) {

        var pixelState = videoMem[y * offsetWidth + x];

        if (pixelState === 1) ctx.fillStyle = 'white';
        else ctx.fillStyle = 'black';

        ctx.fillRect(x * scale * chip8Scale, y * scale * chip8Scale, scale * chip8Scale, scale * chip8Scale);
      }
    }
  }

}