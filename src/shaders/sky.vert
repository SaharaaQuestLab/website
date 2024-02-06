precision highp float;

attribute float a_index;

varying vec3 v_position;
varying float v_color;

uniform float uTotal;
uniform float uTime;
uniform float uPixelRatio;
uniform vec3 uMouse;

#include "../../lygia/generative/snoise.glsl";
#include "../../lygia/generative/random.glsl";
#include "../../lygia/generative/cnoise.glsl";
#include "./utils/cubic-bezier2.glsl";
#include "./utils/noise-particle.glsl";

float down_offset(vec2 pos) {

	float dist = distance(pos, vec2(0.0, 0.0));
	float dist_remap = smoothstep(0.0, 0.1, dist) * 0.1;
  // dist > 0.1 dist_remap === 1
  // dist < 0.1 dist_remap === dist 
	return cubicBezier2D(dist_remap / 0.1);
}

const float noise_layer_1_amp = 1.5;
const float noise_layer_1_freq = 1.0;
const float noise_layer_4_amp = 0.5;
const float noise_layer_4_freq = 9.0;

void main() {

	v_position = position;

	float noise_scale = noise_scale(v_position.xyz);
	v_color = noise_color(v_position.xyz);

	float rnd = random(a_index);
	noise_scale = rnd < 0.00001 ? 3.0 * noise_scale : noise_scale;
	gl_PointSize = 4.5 * uPixelRatio * noise_scale;

  // noise and normal
	vec3 dest_pos = v_position;
	dest_pos.y -= 1.5;
	vec3 noise_pos = snoise3(v_position.xyz * noise_layer_1_freq) * noise_layer_1_amp;

	// float dist = distance(v_position.xz, vec2(0.0, 0.0));
	// vec3 dest_pos = v_position.xyz + step(0.1, dist) * rnd3 * 2.2;
	dest_pos.xyz += noise_pos;
	dest_pos.xyz = dest_pos.xyz * 1.2 / distance(dest_pos.xyz, vec3(0.0, 0.0, 0.0));
	dest_pos.y += 2.4;

  // fall effect
	float offset_x_layer4 = 0.05 * uTime;
	vec3 sample_pos_layer4 = vec3(dest_pos.x - offset_x_layer4, dest_pos.y, dest_pos.z);
	float noise_layer_4 = cnoise(sample_pos_layer4 * noise_layer_4_freq) * noise_layer_4_amp;
	noise_layer_4 = remap(noise_layer_4, -1.0, 1.0, 0.15, 1.0);
	dest_pos.y -= down_offset(dest_pos.xz) * noise_layer_4 * 5.5;

	vec4 world_pos = modelMatrix * vec4(dest_pos.xyz, 1.0);
	float dispalce = length(world_pos.xy - uMouse.xy);
	vec3 dir = normalize(world_pos.xyz - uMouse.xyz);
	world_pos.xyz += dir * 0.2 * smoothstep(0.3, 0.0, dispalce);
	gl_Position = projectionMatrix * modelViewMatrix * world_pos;
}
