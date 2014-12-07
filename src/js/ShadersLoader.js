function ShadersLoader(gl) {

  this.load = function(shader, cb) {    
    var xhr = new XMLHttpRequest();

    xhr.open("GET", shader, true); // TODO: async this maddafacka
    //xhr.responseType = "plain";
    
    xhr.onload = function(e) {
      if (endsWith(shader, ".frag")) cb(compileFragmentShader(xhr.response));
      else if (endsWith(shader, ".vert")) cb(compileVertexShader(xhr.response));
      else console.log("Unknown shader type", shader);
    };

    xhr.onerror = function(e) {
      console.log("Shader.load error", shader);
    }

    xhr.send();
  }
  
  function endsWith(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  function compileFragmentShader(str) {
    var shader = gl.createShader(gl.FRAGMENT_SHADER);
    
    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    return shader;
  }

  function compileVertexShader(str) {
    var shader = gl.createShader(gl.VERTEX_SHADER);
    
    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    return shader;
  }

}