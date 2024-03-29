/*
contributors: Patricio Gonzalez Vivo
description: returns a 2x2 rotation matrix
use: rotate2d(<float> radians)
*/

#ifndef FNC_ROTATE2D
#define FNC_ROTATE2D
float2x2 rotate2d(in float radians){
    float c = cos(radians);
    float s = sin(radians);
    return float2x2(c, -s, s, c);
}
#endif
