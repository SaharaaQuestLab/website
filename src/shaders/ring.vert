varying vec3 v_position;
varying vec2 v_uv;
varying vec3 v_normal;

void main() {
  v_position = position;
  v_uv = uv;
  v_normal = normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
}