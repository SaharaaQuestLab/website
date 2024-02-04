precision highp float;

varying vec3 v_position;
varying float v_color;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5, 0.5));
  float radius = 0.5;
  float edge = 0.1;
  float alpha = 1.0 - 2.0 * smoothstep(radius - edge, radius, dist);
  gl_FragColor = vec4(vec3(1.0) * v_color, alpha);
}