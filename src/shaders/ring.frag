varying vec3 v_position;
varying vec2 v_uv;
varying vec3 v_normal;

vec2 hash(vec2 p) {
    //p = mod(p, 4.0); // tile
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 18.5453);
}

// return distance, and cell id
vec2 voronoi(in vec2 x) {
  vec2 n = floor(x);
  vec2 f = fract(x);

  vec3 m = vec3(8.0);
  for(int j = -1; j <= 1; j++) for(int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash(n + g);
      //vec2  r = g - f + o;
      vec2 r = g - f + (0.5 + 0.5 * sin(6.2831 * o));
      float d = dot(r, r);
      if(d < m.x)
        m = vec3(d, o);
    }

  return vec2(sqrt(m.x), m.y + m.z);
}

float noise_freq = 200.0;

void main() {
  float noise = voronoi(v_position.xy * noise_freq).x;
  float color = step(0.4, noise);
  gl_FragColor = vec4(vec3(color), 1.0);

}