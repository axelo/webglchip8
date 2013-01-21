function Renderer3d(canvas) {
  
  var scale = 1;

  var gl = canvas.getContext("experimental-webgl");
  var shaderProgram = gl.createProgram();

  var shaderLoader = new ShadersLoader(gl);

  var mvMatrix = mat4.create(); // model-view
  var pMatrix = mat4.create(); // perspective

  var mvMatrixStack = [];

  var cuberVertexPosBuffer;
  var cubeVertexColorBuffer;
  var cubeVertexIndexBuffer;

  var pitch = 0;
  var yaw = 0;
  var roll = 0;
  var zoom = 0;
  var scalez = 1;

  var panLeft = 0;
  var panTop = 0;

  this.pan = function(left, top) {
    panLeft = left;
    panTop = top;
  }

  this.pitch = function(p) {
    pitch = p;
  }

  this.yaw = function(y) {
    yaw = y;
  }

  this.roll = function(r) {
    roll = r;
  }

  this.zoom = function(z) {
    zoom = z;
  }

  this.scalez = function(s) {
    scalez = s;
  }

  // TODO - rename
  this.scale = function(s) {
    scale = s;

    canvas.width = document.documentElement.clientWidth;  //64 * scale;
    canvas.height = document.documentElement.clientHeight; //32 * scale;

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  }

  this.render = function(video) {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //mat4.ortho(-gl.viewportWidth / scale, gl.viewportWidth / scale, -gl.viewportHeight / scale, gl.viewportHeight / scale, -5000, 5000, pMatrix);
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0, pMatrix); // auto scales :P

    mat4.identity(mvMatrix);

    //mvPushMatrix();
    var videoMem = video.memory();
    var offsetWidth = video.offsetWidth();
    var screenWidth = video.screenWidth();
    var screenHeight = video.screenHeight();
    var chip8Scale = screenWidth === 128 ? 1 : 2;
    var zoomDist = -zoom - 100;

    if (chip8Scale === 1) {
      zoomDist *= 2;
    }

    mat4.translate(mvMatrix, [-panLeft, panTop, zoomDist]);

    mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]); // pitch
    mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]); // yaw
    mat4.rotate(mvMatrix, degToRad(-roll), [0, 0, 1]); // roll

    mat4.scale(mvMatrix, [1, 1, scalez]); // Scale by 200%

    /*gl.bindBuffer(gl.ARRAY_BUFFER, cuberVertexPosBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cuberVertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0),

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);*/

    
    // draw cube
    mat4.translate(mvMatrix, [-2 * (screenWidth / 2) + 1, screenHeight-1, 0]);

    for (var y = 0; y < screenHeight; ++y) {
      for (var x = 0; x < screenWidth; ++x) {
        
        if (videoMem[y * offsetWidth + x] === 1) {
          setMatrixUniforms();
          gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

        mat4.translate(mvMatrix, [2, 0, 0]);
      }

      mat4.translate(mvMatrix, [-screenWidth * 2, -2, 0]);
    }

    //mvPopMatrix();
  }

  function bindBuffers() {
    gl.bindBuffer(gl.ARRAY_BUFFER, cuberVertexPosBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cuberVertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0),

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  }

  function degToRad(degrees) {
    return degrees * Math.PI / 180.0;
  }

  function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);      
  }

  function mvPopMatrix() {
    mvMatrix = mvMatrixStack.pop();
  }

  function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
  }

  function init() {
    initGl();
    initBuffers();
    bindBuffers();
  }

  function initGl() {
    canvas.width = 64 * scale;
    canvas.height = 32 * scale;

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    gl.clearColor(0.0, 0.0, 0.0, 1.0); // black
    gl.enable(gl.DEPTH_TEST);

    shaderLoader.load("src/shaders/shader.vert", function(vertexShader) {
      shaderLoader.load("src/shaders/shader.frag", function(fragmentShader) {
        
        initShaders(vertexShader, fragmentShader);
      });
    });
  }

  function initShaders(vertexShader, fragmentShader) {
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader)
    
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  }
  
  function initBuffers() {
     // cube position
     cuberVertexPosBuffer = gl.createBuffer();
     cuberVertexPosBuffer.itemSize = 3; // num of points for one vertex
     cuberVertexPosBuffer.numItems = 24; // num of vertices

     var vertices = [
       // Front face
       -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
       -1.0,  1.0,  1.0,

       // Back face
       -1.0, -1.0, -1.0,
       -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

       // Top face
       -1.0,  1.0, -1.0,
       -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

       // Bottom face
       -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
       -1.0, -1.0,  1.0,

       // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

       // Left face
       -1.0, -1.0, -1.0,
       -1.0, -1.0,  1.0,
       -1.0,  1.0,  1.0,
       -1.0,  1.0, -1.0
     ];

     gl.bindBuffer(gl.ARRAY_BUFFER, cuberVertexPosBuffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

     // cube color
     cubeVertexColorBuffer = gl.createBuffer();
     cubeVertexColorBuffer.itemSize = 4; // rgba
     cubeVertexColorBuffer.numSize = 24;

     var sqColors = [
        // Front face
       1.0, 1.0, 1.0, 1.0,
       1.0, 1.0, 1.0, 1.0,
       1.0, 1.0, 1.0, 1.0,
       1.0, 1.0, 1.0, 1.0,
       // Back face
       0.2, 0.2, 0.2, 1.0,
       0.2, 0.2, 0.2, 1.0,
       0.2, 0.2, 0.2, 1.0,
       0.2, 0.2, 0.2, 1.0,
       // Top face
       0.4, 0.4, 0.4, 1.0,
       0.4, 0.4, 0.4, 1.0,
       0.4, 0.4, 0.4, 1.0,
       0.4, 0.4, 0.4, 1.0,
       // Bottom face
       0.4, 0.4, 0.4, 1.0,
       0.4, 0.4, 0.4, 1.0,
       0.4, 0.4, 0.4, 1.0,
       0.4, 0.4, 0.4, 1.0,
       // Right face
       0.6, 0.6, 0.6, 1.0,
       0.6, 0.6, 0.6, 1.0,
       0.6, 0.6, 0.6, 1.0,
       0.6, 0.6, 0.6, 1.0,
       // Left face
       0.6, 0.6, 0.6, 1.0,
       0.6, 0.6, 0.6, 1.0,
       0.6, 0.6, 0.6, 1.0,
       0.6, 0.6, 0.6, 1.0
     ];

     gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sqColors), gl.STATIC_DRAW);

     // cube element buffer
     cubeVertexIndexBuffer = gl.createBuffer();
     cubeVertexIndexBuffer.itemSize = 1;
     cubeVertexIndexBuffer.numItems = 36;

     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

     var cubeVertexIndices = [
        0,  1,  2,     0,  2,  3, // Front face
        4,  5,  6,     4,  6,  7, // Back face
        8,  9, 10,     8, 10, 11, // Top face
       12, 13, 14,    12, 14, 15, // Bottom face
       16, 17, 18,    16, 18, 19, // Right face
       20, 21, 22,    20, 22, 23  // Left face
     ];

     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
  }

  init();
}