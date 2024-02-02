import * as THREE from 'three';
import VertexShader from '@/shaders/ground.vert';
import FragmentShader from '@/shaders/ground.frag';
import { randomGaussian } from '@/utils/gaussian.utils';

export const createUpParticle: () => [THREE.Points, THREE.ShaderMaterial] = () => {
  const width = 30;
  const height = 30;
  const total = width * height;

  const points = new Float32Array(total * 3);
  const indices = new Uint16Array(total);
  const size = new Float32Array(total);
  const angles = new Float32Array(total);
  const scales = new Float32Array(total);



  for (let i = 0, j = 0; i < total; i++) {
    size[i] = i;
    points[j * 3] = randomGaussian(0, 1) * 0.1;
    points[j * 3 + 1] = 0;
    points[j * 3 + 2] = randomGaussian(0, 1) * 0.1;
    indices[j] = i;
    scales[i] = 1;
    angles[j] = j * Math.PI * 2 / total;
    j++;
  }


  const particleGeometry = new THREE.BufferGeometry();


  particleGeometry.setAttribute('a_index', new THREE.BufferAttribute(indices, 1, false));
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
  particleGeometry.setAttribute('a_size', new THREE.BufferAttribute(size, 1));
  particleGeometry.setAttribute('a_scale', new THREE.BufferAttribute(scales, 1));
  particleGeometry.setAttribute('angle', new THREE.BufferAttribute(angles, 1));


  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      'uTotal': { value: total },
      'uTime': { value: 0 }
    },
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
    depthTest: true,
    depthWrite: false,
    transparent: true,
    blending: THREE.AdditiveBlending,
    wireframe: false
  })
  return [new THREE.Points(particleGeometry, particleMaterial), particleMaterial];
}