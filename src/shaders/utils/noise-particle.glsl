#include "../../../lygia/generative/cnoise.glsl";
#include "./remap.glsl";

const float noise_particle_freqX = 2.0;
const float noise_particle_freqY = 1.0;
const float noise_particle_freqZ = 6.0;

float noise_value(vec3 pos) {
  vec3 scale_sample_pos = vec3(pos.x * noise_particle_freqX, pos.y * noise_particle_freqY, pos.z * noise_particle_freqZ);
  return cnoise(scale_sample_pos);
}

float noise_scale(vec3 pos) {
  return remap(noise_value(pos), -1.0, 1.0, 0.1, 0.7);
}

float noise_color(vec3 pos) {
  return remap(noise_value(pos), -1.0, 1.0, 0.2, 1.0);
}