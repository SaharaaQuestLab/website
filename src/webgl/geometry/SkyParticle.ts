import * as THREE from 'three';
import VertexShader from '@/shaders/sky.vert';
import FragmentShader from '@/shaders/sky.frag';
import { randomGaussian } from '@/utils/gaussian.utils';

const SphereXCount = 50;
const SphereYCount = 50;
const SphereRadius = 1.2;
const GaussianRadius = 0.1;
const GaussianXCount = 40;
const GaussianYCount = 40;

export const createSkyParticle: (radius: number) => [THREE.Points, THREE.ShaderMaterial] = (radius: number = 1.2) => {

  const particleGeometry = new THREE.BufferGeometry();

  // sphere geometry
  const skyGeometry = new THREE.SphereGeometry(SphereRadius, SphereXCount, SphereYCount);


  const total_sphere = skyGeometry.getAttribute("position").count;
  const total_gaussian = GaussianXCount * GaussianYCount;
  const total_point = total_sphere + total_gaussian;
  const indices = new Uint16Array(total_point);
  const point_array = new Float32Array(total_point * 3);

  let i = 0;
  let j = 0;

  // create ground point
  point_array.set(skyGeometry.getAttribute("position").array);
  while (i < total_sphere) {
    indices[j] = j;
    j++;
    i++;
  }

  // create gaussian point
  i = 0;
  while (i < total_gaussian) {
    indices[j] = j;
    point_array[j * 3] = randomGaussian(0, 1) * GaussianRadius;
    point_array[j * 3 + 1] = -SphereRadius;
    point_array[j * 3 + 2] = randomGaussian(0, 1) * GaussianRadius;
    j++;
    i++;
  }

  particleGeometry.setAttribute('a_index', new THREE.BufferAttribute(indices, 1, false));
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(point_array, 3));



  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      'uTotal': { value: total_point },
      'uTime': { value: 0 },
      'uPixelRatio': { value: window.devicePixelRatio }
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