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

const float noise_layer_1_amp = 1.0;
const float noise_layer_1_freq = 0.5;
const float noise_layer_3_amp = 0.02;
const float noise_layer_3_freq = 25.0;
const float noise_layer_4_amp = 0.5;
const float noise_layer_4_freq = 2.0;
const float noise_scale_amp = 1.0;
const float noise_scale_freq = 1.0;
const float noise_interact_freq = 5.0;

void main() {

	v_position = position;

	float noise_scale = snoise(v_position.xyz);
	v_color = noise_color(v_position.xyz);

	noise_scale = remap(noise_scale, -1.0, 1.0, 0.2, 1.0);
	float rnd = random(a_index);
	noise_scale = rnd < 0.00001 ? 3.0 * noise_scale : noise_scale;
	gl_PointSize = 4.0 * uPixelRatio * noise_scale;

    // noise and normal
	vec3 dest_pos = v_position;
	dest_pos.y -= 1.0;
	float offset_x_layer1 = 0.02 * uTime;
	vec3 sample_pos_layer1 = vec3(dest_pos.x + offset_x_layer1, dest_pos.y, dest_pos.z);
	vec3 noise_pos = snoise3((dest_pos.xyz + sample_pos_layer1) * noise_layer_1_freq) * noise_layer_1_amp;

	// float dist = distance(v_position.xz, vec2(0.0, 0.0));
	// vec3 dest_pos = v_position.xyz + step(0.1, dist) * rnd3 * 2.2;
	dest_pos.xyz += noise_pos;
	dest_pos.xyz = dest_pos.xyz * 1.3 / distance(dest_pos.xyz, vec3(0.0, 0.0, 0.0));

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
	dest_pos.y -= down_offset(dest_pos.xz) * noise_layer_4 * 2.5;

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
