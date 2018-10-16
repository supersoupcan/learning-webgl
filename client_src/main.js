import vertShader from './shaders/vertex.glsl';
import fragShader from './shaders/fragment.glsl';

import { mat4, mat3 } from 'gl-matrix';

import HelperGL from './HelperGL';

function main(canvas){
  const helperGL = new HelperGL(canvas.getContext('webgl')); 
  const gl = helperGL.gl;

  helperGL.initShaders(vertShader, fragShader);

  helperGL.initUniform('uProjectionMatrix');
  helperGL.initUniform('uModelViewMatrix');

  helperGL.initAttrib('aVertexPosition');
  helperGL.initBuffer('square', {
    target: gl.ARRAY_BUFFER,
    srcData: new Float32Array([
      1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
      -1.0, -1.0,
    ]),
    usage: gl.STATIC_DRAW
  });

  helperGL.initBuffer('triangle', {
    target: gl.ARRAY_BUFFER,
    srcData: new Float32Array([
      0.0,  1.0,
     -1.0, -1.0,
      1.0, -1.0,
    ]),
    usage: gl.STATIC_DRAW
  });

  function angle(a){
    return Math.PI * a / 3;
  }

  let hexagonVertices = [
    0.0, 0.0,
    Math.cos(angle(0)), Math.sin(angle(0)),
    Math.cos(angle(1)), Math.sin(angle(1)),
    Math.cos(angle(2)), Math.sin(angle(2)),
    Math.cos(angle(3)), Math.sin(angle(3)),
    Math.cos(angle(4)), Math.sin(angle(4)),
    Math.cos(angle(5)), Math.sin(angle(5)),
    Math.cos(angle(6)), Math.sin(angle(6)),
  ];

  helperGL.initBuffer('hexagon', {
    target: gl.ARRAY_BUFFER,
    srcData: new Float32Array(
      hexagonVertices
    ),
    usage: gl.STATIC_DRAW
  })

  gl.clearColor(0.0, 0.0, 0.0, 1.0); 
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST); 
  gl.depthFunc(gl.LEQUAL);  

  helperGL.draw();
}

export default main;