import * as THREE from 'three';
import VertexShader from '@/shaders/skyInner.vert';
import FragmentShader from '@/shaders/skyInner.frag';
import { randomGaussian } from '@/utils/gaussian.utils';

const SphereXCount = 64;
const SphereYCount = 64;
const SphereRadius = 1;
const GaussianRadius = 0.1;
const GaussianXCount = 30;
const GaussianYCount = 30;

export const createSkyInnerParticle: (options: { xCount: number, yCount: number, shaders: { centerHeight: number, offsetY: number, radius: number } }) => [THREE.Points, THREE.ShaderMaterial] = ({
  xCount, yCount, shaders
}) => {

  const particleGeometry = new THREE.BufferGeometry();

  // sphere geometry
  const skyGeometry = new THREE.SphereGeometry(SphereRadius, xCount || SphereXCount, yCount || SphereYCount);


  const total_sphere = skyGeometry.getAttribute("position").count;
  const total_gaussian = GaussianXCount * GaussianYCount;
  const total_point = total_sphere + total_gaussian;
  const indices = new Uint16Array(total_point);
  const is_gaussian = new Uint16Array(total_point);
  const point_array = new Float32Array(total_point * 3);

  let i = 0;
  let j = 0;

  // create ground point
  point_array.set(skyGeometry.getAttribute("position").array);
  while (i < total_sphere) {
    indices[j] = j;
    is_gaussian[j] = 0;
    j++;
    i++;
  }

  // create gaussian point
  i = 0;
  while (i < total_gaussian) {
    indices[j] = j;
    is_gaussian[j] = 1;
    point_array[j * 3] = randomGaussian(0, 1) * GaussianRadius;
    point_array[j * 3 + 1] = -SphereRadius;
    point_array[j * 3 + 2] = randomGaussian(0, 1) * GaussianRadius;
    j++;
    i++;
  }

  particleGeometry.setAttribute('a_index', new THREE.BufferAttribute(indices, 1, false));
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(point_array, 3));
  particleGeometry.setAttribute('a_is_gaussian', new THREE.BufferAttribute(is_gaussian, 1, false));


  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      'uTotal': { value: total_point },
      'uTime': { value: 0 },
      'uPixelRatio': { value: window.devicePixelRatio },
      'uMouse': { value: new THREE.Vector3(999, 999, 0) },
      'uCenterHeight': { value: shaders.centerHeight },
      'uYOffset': { value: shaders.offsetY },
      'uRadius': { value: shaders.radius }
    },
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
    depthTest: true,
    depthWrite: true,
    transparent: true,
    blending: THREE.NormalBlending,
    wireframe: false
  })
  const points = new THREE.Points(particleGeometry, particleMaterial);
  // points.customDepthMaterial = new THREE.MeshDepthMaterial();
  return [points, particleMaterial];
}