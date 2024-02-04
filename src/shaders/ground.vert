precision highp float;

attribute float a_index;

varying vec3 v_position;
varying float v_color;

uniform float uTime;
uniform float uPixelRatio;

#include "../../lygia/generative/random.glsl";
#include "../../lygia/generative/cnoise.glsl";
#include "./utils/cubic-bezier2.glsl";
#include "./utils/noise-particle.glsl";

float up_offset(vec2 pos) {

  float dist = distance(pos, vec2(0.0, 0.0));
  float dist_remap = smoothstep(0.0, 0.1, dist) * 0.1;
  // dist > 0.1 dist_remap === 1
  // dist < 0.1 dist_remap === dist 
  return cubicBezier2D(dist_remap / 0.1);
}

const float noise_layer_1_amp = 0.2;
const float noise_layer_1_freq = 1.5;
const float noise_layer_2_amp = 0.1;
const float noise_layer_2_freq = 0.6;
const float noise_layer_3_amp = 0.05;
const float noise_layer_3_freq = 25.0;
const float noise_layer_4_amp = 0.5;
const float noise_layer_4_freq = 9.0;

void main() {

  v_position = position;

  float offset_x_layer1 = 0.1 * uTime;
  float offset_x_layer2 = 0.2 * uTime;
  float offset_x_layer4 = 0.05 * uTime;
  vec3 sample_pos_layer1 = vec3(v_position.x + offset_x_layer1, v_position.y, v_position.z);
  vec3 sample_pos_layer2 = vec3(v_position.x - offset_x_layer2, v_position.y, v_position.z);
  vec3 sample_pos_layer4 = vec3(v_position.x - offset_x_layer4, v_position.y, v_position.z);
  float noise_layer_1 = cnoise(sample_pos_layer1 * noise_layer_1_freq) * noise_layer_1_amp;
  float noise_layer_2 = cnoise(sample_pos_layer2 * noise_layer_2_freq) * noise_layer_2_amp;
  float noise_layer_3 = cnoise(v_position.xyz * noise_layer_3_freq) * noise_layer_3_amp;
  float noise_layer_4 = cnoise(sample_pos_layer4 * noise_layer_4_freq) * noise_layer_4_amp;

  float noise_scale = noise_scale(v_position.xyz);
  v_color = noise_color(v_position.xyz);

  float rnd = random(a_index);
  noise_scale = rnd < 0.00001 ? 3.0 * noise_scale : noise_scale;
  gl_PointSize = 4.5 * uPixelRatio * noise_scale;

  v_position.y += (noise_layer_3 + noise_layer_1 + noise_layer_2);
  v_position.x += noise_layer_3;

  noise_layer_4 = remap(noise_layer_4, 0.0, 1.0, 0.15, 1.0);
  v_position.y += up_offset(v_position.xz) * noise_layer_4 * 4.5;

  // float dispalce = length(v_position.xyz - uMouse.xyz);
  // vec3 dir = normalize(v_position.xyz - uMouse.xyz);
  // v_position.xyz += dir * 0.5 * smoothstep(0.3, 0.0, dispalce);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
}