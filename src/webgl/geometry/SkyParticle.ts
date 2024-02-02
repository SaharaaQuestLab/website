import * as THREE from 'three';
import SkyVertexShader from '@/shaders/sky.vert';
import SkyFragmentShader from '@/shaders/sky.frag';

export const createSkyParticle: (radius: number) => [THREE.Points, THREE.ShaderMaterial] = (radius: number = 0.5) => {
  const width = 50;
  const height = 50;
  const skyGeometry = new THREE.SphereGeometry(radius, width, height);
  const particleGeometry = new THREE.BufferGeometry();

  const total = skyGeometry.getAttribute("position").count;
  const indices = new Uint16Array(total);
  // const offsets = new Float32Array(total * 3);
  const size = new Float32Array(total);
  // const angles = new Float32Array(numVisible);

  for (let i = 0, j = 0; i < total; i++) {
    size[i] = i;
    // offsets[j * 3 + 0] = i % width;
    // offsets[j * 3 + 1] = Math.floor(i / width);

    indices[j] = i;

    // angles[j] = Math.random() * Math.PI;

    j++;
  }

  particleGeometry.setAttribute('pindex', new THREE.BufferAttribute(indices, 1, false));
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(skyGeometry.getAttribute("position").array, 3));
  particleGeometry.setAttribute('a_size', new THREE.BufferAttribute(size, 1));

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      'uTotal': { value: total },
      'uTime': { value: 0 }
    },
    vertexShader: SkyVertexShader,
    fragmentShader: SkyFragmentShader,
    depthTest: false,
    transparent: true,
    wireframe: false
  })
  return [new THREE.Points(particleGeometry, particleMaterial), particleMaterial];
}