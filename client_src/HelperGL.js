import { mat4, mat3 } from 'gl-matrix';

const HelperGL = function(gl){
  this.gl = gl;
  this.program = null;
  this.buffers = new Map();
  this.uniforms = new Map();
  this.attribs = new Map();
}

HelperGL.prototype.loadShader = function(type, source){
  const gl = this.gl;
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if(!this.gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
    alert('an error occured compiling the shaders' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

HelperGL.prototype.initShaders = function(vsSource, fsSource){
  const gl = this.gl;
  const vertexShader = this.loadShader(gl.VERTEX_SHADER, vsSource);
  const fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
  }
  this.program = program;
  gl.useProgram(this.program);
}

HelperGL.prototype.initBuffer = function(key, init){
  const gl = this.gl;
  const buffer = gl.createBuffer();
  gl.bindBuffer(init.target, buffer);
  gl.bufferData(init.target, init.srcData, init.usage);
  this.buffers.set(key, {
    target: init.target,
    buffer,
  });
}

HelperGL.prototype.initUniform = function(name){
  let location = this.gl.getUniformLocation(this.program, name);
  this.uniforms.set(name, {
    location,
    value: mat4.create()
  });
}

HelperGL.prototype.initAttrib = function(name){
  let location = this.gl.getAttribLocation(this.program, name);
  this.gl.enableVertexAttribArray(location);
  this.attribs.set(name, {
    location
  });
}

HelperGL.prototype.draw = function(){
  const gl = this.gl;   
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const uModelViewMatrix = this.uniforms.get('uModelViewMatrix');
  const uProjectionMatrix = this.uniforms.get('uProjectionMatrix');
  const aVertexPosition = this.attribs.get('aVertexPosition');

  mat4.perspective(
    uProjectionMatrix.value, 
    45 * Math.PI / 180, 
    gl.canvas.clientWidth / gl.canvas.clientHeight, 
    0.1, 100
  );
  mat4.translate(uModelViewMatrix.value, mat4.create(), [-1.5, 0.0, -7.0]);

  gl.uniformMatrix4fv(uModelViewMatrix.location, false, uModelViewMatrix.value);
  gl.uniformMatrix4fv(uProjectionMatrix.location, false, uProjectionMatrix.value);

  //draw square
  const square = this.buffers.get('square');
  
  gl.bindBuffer(square.target, square.buffer);
  gl.vertexAttribPointer(aVertexPosition.location, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  //Draw triangle
  const triangle = this.buffers.get('hexagon');

  mat4.translate(uModelViewMatrix.value, uModelViewMatrix.value, [3.0, 0.0, 0.0])
  gl.uniformMatrix4fv(uModelViewMatrix.location, false, uModelViewMatrix.value);

  gl.bindBuffer(triangle.target, triangle.buffer);
  gl.vertexAttribPointer(aVertexPosition.location, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 8);
}

export default HelperGL;
