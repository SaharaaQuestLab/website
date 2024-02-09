varying vec3 vNormal;
varying vec3 vPosition;
uniform vec3 outlineColor;
uniform vec3 camPosition;


void main(){
    vec3 bgColor = vec3(0.0063, 0.0067, 0.0073);
    vec3 dirToCam = camPosition - vPosition;
    float intensity = 1.0 - abs(dot(normalize(vNormal), dirToCam));
    intensity = step(0.5, intensity);
    vec3 edgeColor = vec3(intensity, intensity, intensity);
    edgeColor = clamp(edgeColor, bgColor, outlineColor);
    gl_FragColor = vec4(edgeColor.xyz, 1.0);
}