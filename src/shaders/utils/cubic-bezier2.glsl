float cubicBezier2D(float t) {
  // vec2 p0 = vec2(0.0, 0.0);
  // vec2 p1 = vec2(0.64, 0.02);
  // vec2 p2 = vec2(0.99, 0.04);
  // vec2 p3 = vec2(1.0, 1.0);
  vec2 p0 = vec2(1.0, 1.0);
  vec2 p1 = vec2(0.95, 0.05);
  vec2 p2 = vec2(0.65, 0.01);
  vec2 p3 = vec2(0.0, 0.0);
  float u = 1.0 - t;
  float tt = t * t;
  float uu = u * u;
  float uuu = uu * u;
  float ttt = tt * t;

  vec2 p = uuu * p0; // first
  p += 3.0 * uu * t * p1; //  second
  p += 3.0 * u * tt * p2; // third
  p += ttt * p3; // forth

  return p.y;
}