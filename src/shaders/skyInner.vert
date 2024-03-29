precision highp float;

attribute float a_index;
attribute float a_is_gaussian;

varying vec3 v_position;
varying float v_color;

uniform float uTotal;
uniform float uTime;
uniform float uPixelRatio;
uniform vec3 uMouse;
uniform float uCenterHeight;
uniform float uYOffset;
uniform float uRadius;

#include "../../lygia/generative/snoise.glsl";
#include "../../lygia/generative/random.glsl";
#include "../../lygia/generative/cnoise.glsl";
#include "./utils/cubic-bezier2.glsl";
#include "./utils/noise-particle.glsl";

float down_offset(vec2 pos) {

  float dist = distance(pos, vec2(0.0, 0.0));
  // float dist_remap = smoothstep(0.0, 0.2, dist);
  float dist_remap = clamp(dist, 0.0, 0.13);
  dist_remap = mix(0.0, 1.0, dist_remap / 0.13);

  // dist > 0.1 dist_remap === 1
  // dist < 0.1 dist_remap === dist 
  return cubicBezier2D(dist_remap, vec2(0.0, 0.0), vec2(0.0, 0.0));
}

const float noise_layer_1_amp = 4.5;
const float noise_layer_1_freq = 0.25;
const float noise_gaussian_amp = 1.5;
const float noise_gaussian_freq = 1.0;
const float noise_layer_3_amp = 0.01;
const float noise_layer_3_freq = 25.0;
const float noise_layer_4_amp = 0.5;
const float noise_layer_4_freq = 2.0;
const float noise_scale_amp = 1.0;
const float noise_scale_freq = 1.0;
const float noise_interact_freq = 5.0;

void main() {

  v_position = position;

  // point scale
  float noise_scale = snoise(v_position.xyz);
  v_color = noise_color(v_position.xyz);

  noise_scale = remap(noise_scale, -1.0, 1.0, 0.2, 1.0);
  float rnd = random(a_index+0.1);
	if(rnd * 100000.0 < 1.0){
    	noise_scale *= 3.5;
    	v_color = 1.5;
  	}
  gl_PointSize = 4.0 * uPixelRatio * noise_scale;

  // noise and normal
  vec3 dest_pos = v_position;
  dest_pos.y -= 5.5;
  float offset_x_layer1 = 0.03 * uTime;
  float offset_gaussian = 0.2 * uTime;
  vec3 sample_pos_layer1 = a_is_gaussian == 0.0 ? vec3(dest_pos.x + offset_x_layer1, dest_pos.y, dest_pos.z) : vec3(dest_pos.x + offset_gaussian, dest_pos.y, dest_pos.z);
	// vec3 noise_pos = snoise3((dest_pos.xyz + sample_pos_layer1) * noise_layer_1_freq) * noise_layer_1_amp;
  vec3 noise_pos = a_is_gaussian == 0.0 ? snoise3((dest_pos.xyz + sample_pos_layer1) * noise_layer_1_freq) * noise_layer_1_amp : snoise3((dest_pos.xyz + sample_pos_layer1) * noise_gaussian_freq) * noise_gaussian_amp;

	// float dist = distance(v_position.xz, vec2(0.0, 0.0));
	// vec3 dest_pos = v_position.xyz + step(0.1, dist) * rnd3 * 2.2;
  vec3 noise_filter = vec3(1.0 - a_is_gaussian, 1.0, 1.0 - a_is_gaussian);
  dest_pos.xyz += noise_pos * noise_filter;
  dest_pos.xyz = dest_pos.xyz * 1.1 / distance(dest_pos.xyz, vec3(0.0, 0.0, 0.0));

	// detail noise
  vec3 noise_pos_detail = snoise3(v_position.xyz * noise_layer_3_freq) * noise_layer_3_amp;
  dest_pos.xyz += noise_pos_detail;

	// move up
  dest_pos.y += 2.7;

  // fall effect
  float offset_x_layer4 = 0.005 * uTime;
  vec3 sample_pos_layer4 = vec3(v_position.x - offset_x_layer4, v_position.y, v_position.z);
  float noise_layer_4 = cnoise(sample_pos_layer4 * noise_layer_4_freq) * noise_layer_4_amp;
  noise_layer_4 = remap(noise_layer_4, -1.0, 1.0, 0.15, 1.0);
  dest_pos.y -= down_offset(dest_pos.xz) * noise_layer_4 * uCenterHeight;
	// dest_pos.y -= down_offset(dest_pos.xz) * uCenterHeight;

  // interact
  vec4 world_pos = modelMatrix * vec4(dest_pos.xyz, 1.0);
  float dispalce = length(world_pos.xy - uMouse.xy);
  vec3 dir = normalize(world_pos.xyz - uMouse.xyz);
  float offset_interact = 0.1 * uTime;
  vec3 sample_pos_interact = vec3(v_position.x - offset_interact, v_position.y, v_position.z);
  float noise_displace = snoise(sample_pos_interact * noise_interact_freq);
  noise_displace = remap(noise_displace, -1.0, 1.0, 0.05, 0.3);
  world_pos.xyz += dir * 0.2 * smoothstep(noise_displace, 0.0, dispalce);
  gl_Position = projectionMatrix * modelViewMatrix * world_pos;
}
