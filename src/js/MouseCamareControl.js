function MouseCamareControl(canvas) {

  var yaw = 0;
  var pitch = 0;
  var zoom = 0;
  var panLeft = 0;
  var panTop = 0;

  var isMouseDown = false;
  var isLeftButton = false;
  var isRightButton = false;

  this.pitch = function() {
    return pitch;
  }

  this.yaw = function() {
    return yaw;
  }

  this.zoom = function() {
    return zoom;
  }

  this.panLeft = function() {
    return panLeft;
  }

  this.panTop = function() {
    return panTop;
  }

  function onMouseDown(e) {
    isMouseDown = true;
    isLeftButton = e.altKey === false;
    isRightButton = e.altKey === true;
  }

  function onMouseUp(e) {
    isMouseDown = false;
  }

  function onMouseMove(e) {
    if (isMouseDown) {
      if (isLeftButton) {
        yaw -= (e.webkitMovementX / 2.0);
        pitch -= (e.webkitMovementY / 2.0);
      }

      if (isRightButton) {
        panLeft -= (e.webkitMovementX / 2.0);
        panTop -= (e.webkitMovementY / 2.0);
      }
    }
  }

  function onMouseWheel(e) {
    zoom -= (e.wheelDelta / 10.0);

    zoom = Math.min(zoom, 1000.0 - 200.0);
    zoom = Math.max(zoom, 3 - 100.0);
  }
  
  function init() {
      canvas.onmousedown = onMouseDown;        
      canvas.addEventListener("mousewheel", onMouseWheel, false);   
      document.onmouseup = onMouseUp;
      document.onmousemove = onMouseMove;
  }

  init();
}
