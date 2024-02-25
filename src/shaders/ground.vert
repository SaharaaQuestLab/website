precision highp float;

attribute float a_index;

varying vec3 v_position;
varying float v_color;

uniform float uTime;
uniform float uPixelRatio;
uniform vec3 uMouse;
uniform float uCenterHeight;
uniform float uSampleBase4Layer1;

#include "../../lygia/generative/random.glsl";
#include "../../lygia/generative/cnoise.glsl";
#include "../../lygia/generative/snoise.glsl";
#include "./utils/cubic-bezier2.glsl";
#include "./utils/noise-particle.glsl";

float up_offset(vec2 pos) {

  float dist = distance(pos, vec2(0.0, 0.0));
  float dist_remap = smoothstep(0.0, 0.1, dist);
  // dist > 0.1 dist_remap === 1
  // dist < 0.1 dist_remap === dist 
  return cubicBezier2D(dist_remap, vec2(0.95, 0.05), vec2(0.65, 0.01));
}

const float noise_layer_1_amp = 0.82;
const float noise_layer_1_freq = 0.67;
const float noise_layer_2_amp = 0.3;
const float noise_layer_2_freq = 0.5;
const float noise_layer_3_amp = 0.015;
const float noise_layer_3_freq = 50.0;
const float noise_layer_4_amp = 0.5;
const float noise_layer_4_freq = 3.0;
const float noise_scale_amp = 0.9;
const float noise_scale_freq = 2.0;
const float noise_color_amp = 3.0;
const float noise_color_freq = 3.0;
const float noise_interact_freq = 5.0;

void main() {

  v_position = position;

  float offset_x_layer1 = 0.03 * uTime;
  float offset_x_layer2 = 0.05 * uTime;
  float offset_x_layer4 = 0.05 * uTime;
  float offset_color = 0.2 * uTime;
  vec3 sample_pos_layer1 = vec3(v_position.x + offset_x_layer1, v_position.y + uSampleBase4Layer1, v_position.z);
  vec3 sample_pos_layer2 = vec3(v_position.x - offset_x_layer2, v_position.y, v_position.z);
  vec3 sample_pos_layer4 = vec3(v_position.x - offset_x_layer4, v_position.y, v_position.z);
  vec3 sample_pos_color = vec3(v_position.x + 3.0, v_position.y - offset_color, 2.5 * v_position.z);
  vec3 sample_pos_scale = vec3(v_position.x - offset_color, v_position.y + 1.0, v_position.z);
  float noise_layer_1 = snoise(sample_pos_layer1 * noise_layer_1_freq) * noise_layer_1_amp;
  float noise_layer_2 = snoise(sample_pos_layer2 * noise_layer_2_freq + 0.5) * noise_layer_2_amp;
  float noise_layer_3 = cnoise(v_position.xyz * noise_layer_3_freq) * noise_layer_3_amp;
  float noise_layer_4 = cnoise(sample_pos_layer4 * noise_layer_4_freq) * noise_layer_4_amp;
  float noise_scale = cnoise(sample_pos_scale * noise_scale_freq + 1.0) * noise_scale_amp;

  float noise_color = cnoise(sample_pos_color * noise_color_freq) * noise_color_amp;
  v_color = remap(noise_color, -1.0, 1.0, 0.2, 1.0);

  noise_scale = remap(noise_scale, -1.0, 1.0, 0.3, 0.9);
  float rnd = random(a_index);
  noise_scale = rnd < 0.00001 ? 3.0 * noise_scale : noise_scale;

  gl_PointSize = 4.0 * uPixelRatio * noise_scale;

  v_position.y += (noise_layer_3 + noise_layer_1 * noise_layer_1);
  v_position.x += noise_layer_3 * 3.0;

  noise_layer_4 = remap(noise_layer_4, 0.0, 1.0, 0.15, 1.0);
  v_position.y += up_offset(v_position.xz) * noise_layer_4 * uCenterHeight;

  // float dispalce = length(v_position.xyz - uMouse.xyz);
  // vec3 dir = normalize(v_position.xyz - uMouse.xyz);
  // v_position.xyz += dir * 0.5 * smoothstep(0.3, 0.0, dispalce);

  // gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
  vec4 world_pos = modelMatrix * vec4(v_position.xyz, 1.0);
  float dispalce = length(world_pos.xy - uMouse.xy);
  vec3 dir = normalize(world_pos.xyz - uMouse.xyz);
  float offset_interact = 0.1 * uTime;
  vec3 sample_pos_interact = vec3(v_position.x - offset_interact, v_position.y, v_position.z);
  float noise_displace = snoise(sample_pos_interact * noise_interact_freq);
  noise_displace = remap(noise_displace, -1.0, 1.0, 0.05, 0.6);
  world_pos.xyz += dir * 0.2 * smoothstep(noise_displace * noise_displace, 0.0, dispalce);
  gl_Position = projectionMatrix * modelViewMatrix * world_pos;
}