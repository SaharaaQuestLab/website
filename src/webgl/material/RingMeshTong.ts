import { Color, MeshToonMaterial, CanvasTexture, MeshStandardMaterial, AdditiveBlending, DataTexture, NormalBlending } from "three";
// import VertexShader from "@/shaders/ring.vert";
// import FragmentShader from "@/shaders/ring.frag";

function createStepTexture() {

  const steps = [
    0x000000,
    0x222222,
    0xaaaaaa,
    0xffffff
  ]

  const size = steps.length;
  const data = new Uint8Array(4 * size);

  for (let i = 0; i < size; i++) {
    const v = steps[i];
    const stride = i * 4;
    data[stride] = v;
    data[stride + 1] = v;
    data[stride + 2] = v;
    data[stride + 3] = 255;

  }
  const texture = new DataTexture(data, size, 1);
  texture.needsUpdate = true;
  return texture;
}

function createGradientTexture() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const gradient = ctx.createLinearGradient(0, 0, 256, 0); // 创建横向渐变

  // 添加颜色断点
  gradient.addColorStop(0.5, '#000000');
  // gradient.addColorStop(0.5, '#aaaaaa');
  gradient.addColorStop(0.7, '#ffffff');

  // 设置canvas大小
  canvas.width = 256;
  canvas.height = 1;

  // 填充渐变
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);

  // 使用canvas创建纹理
  return new CanvasTexture(canvas);
}


// const ringMeshTongMaterial = new MeshToonMaterial({
//   gradientMap: createGradientTexture(),
//   color: 0xffffff,
// });

// const ringMeshStandardMaterial = new MeshStandardMaterial({
//   color: 0xffffff,
//   flatShading: true,
//   blending: NormalBlending
// })

const ringMeshStandardMaterial = new MeshStandardMaterial({
    color: 0xffffff,
    flatShading: true,
    blending: NormalBlending
  })

ringMeshStandardMaterial.onBeforeCompile = function (shader) {
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `varying vec3 v_position;
     varying vec2 v_uv;
#include <common>`
  ).replace(
    '#include <begin_vertex>',
    [
      'v_position = position;',
      'v_uv = uv;',
      'vec3 transformed = vec3(position);'
    ].join('\n')
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `#include <common>
    varying vec3 v_position;
    varying vec2 v_uv;

    float remap(float value, float sourceMin, float sourceMax, float targetMin, float targetMax) {
      float normalized = (value - sourceMin) / (sourceMax - sourceMin);
      return targetMin + normalized * (targetMax - targetMin);
    }

    vec2 hash(vec2 p) {
      //p = mod(p, 4.0); // tile
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 18.5453);
    }

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
    
    vec3 overlayBlend(vec3 baseColor, vec3 blendColor){
      vec3 result;
      for(int i=0; i<3; i++){
        if(baseColor[i] < 0.5){
          result[i] = 2.0 * baseColor[i] * blendColor[i];
        }else{
          result[i] = 1.0 - 2.0 * (1.0 - baseColor[i]) * (1.0 - blendColor[i]);
        }
      }
      return result;
    }
    `
  ).replace(
    '#include <dithering_fragment>',
    `
    #include <dithering_fragment>
      vec3 bgColor = vec3(0.08, 0.083, 0.09);
      float noise = voronoi(vec2(v_uv.x, 0.2 * v_uv.y) * 450.0).x;
      float color_p = step(0.4, noise);
      vec3 noiseColor = vec3(color_p, color_p, color_p);

      vec3 baseColor = vec3(gl_FragColor.x, gl_FragColor.y, gl_FragColor.z);

      vec3 fragColor = overlayBlend(baseColor, noiseColor) + bgColor;
      gl_FragColor = vec4(fragColor.xyz, 1.0);      
    `
  );
}

export default ringMeshStandardMaterial;