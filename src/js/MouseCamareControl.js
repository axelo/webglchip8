function MouseCamareControl(canvas) {

  var yaw = 0;
  var pitch = 0;
  var roll = 0;
  var zoom = 0;
  var scalez = 1;
  var panLeft = 0;
  var panTop = 0;

  var isMouseDown = false;
  var isAltKeyDown = false;
  var isShiftKeyDown = false;

  this.setCamera = function(cam) {
    yaw = cam.yaw;
    pitch = cam.pitch;
    roll = cam.roll;
    zoom = cam.zoom;
    scalez = cam.scalez;
    panLeft = cam.panLeft;
    panTop = cam.panTop;
  }

  this.pitch = function() {
    return pitch;
  }

  this.yaw = function() {
    return yaw;
  }

  this.roll = function() {
    return roll;
  }

  this.zoom = function() {
    return zoom;
  }

  this.scalez = function() {
    return scalez;
  }

  this.panLeft = function() {
    return panLeft;
  }

  this.panTop = function() {
    return panTop;
  }

  function onMouseDown(e) {
    isMouseDown = true;
    isAltKeyDown = e.altKey;
    isShiftKeyDown = e.shiftKey;
  }

  function onMouseUp(e) {
    isMouseDown = false;
  }

  function onMouseMove(e) {
    if (isMouseDown) {
      if (isAltKeyDown) {
        panLeft -= (e.webkitMovementX / 2.0);
        panTop -= (e.webkitMovementY / 2.0);
      }
      else if (isShiftKeyDown) {
        roll -= (e.webkitMovementX / 2.0);
      }
      else {
        yaw -= (e.webkitMovementX / 2.0);
        pitch -= (e.webkitMovementY / 2.0);
      }
    }
  }

  function onMouseWheel(e) {
    if (e.shiftKey) {
      scalez += (e.wheelDelta / 10.0);
      if (scalez <= 0) scalez = 0.0;
    }
    else {
      zoom -= (e.wheelDelta / 10.0);

      zoom = Math.min(zoom, 1000.0 - 200.0);
      zoom = Math.max(zoom, 3 - 100.0);
    }
  }
  
  function init() {
      canvas.onmousedown = onMouseDown;        
      canvas.addEventListener("mousewheel", onMouseWheel, false);   
      document.onmouseup = onMouseUp;
      document.onmousemove = onMouseMove;
  }

  init();
}
