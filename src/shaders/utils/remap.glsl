float remap(float value, float sourceMin, float sourceMax, float targetMin, float targetMax) {
  float normalized = (value - sourceMin) / (sourceMax - sourceMin);
  return targetMin + normalized * (targetMax - targetMin);
}