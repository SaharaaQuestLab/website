import * as THREE from 'three';
import VertexShader from '@/shaders/ground.vert';
import FragmentShader from '@/shaders/ground.frag';
import { randomGaussian } from '@/utils/gaussian.utils';

const GroundXCount = 140;
const GroundYCount = 140;
const GroundWidth = 3.2;
const GroundHeight = 3.2;
const GaussianRadius = 0.1;
const GaussianXCount = 30;
const GaussianYCount = 30;

export const createGroundParticle: () => [THREE.Points, THREE.ShaderMaterial] = () => {

  const particleGeometry = new THREE.BufferGeometry();

  // ground geometry
  const groundGeometry = new THREE.PlaneGeometry(GroundWidth, GroundHeight, GroundXCount, GroundYCount);
  groundGeometry.rotateX(Math.PI / 2);
  groundGeometry.rotateY(Math.PI / 4);
  //groundGeometry.rotateX(-Math.PI / 60);


  const total_ground = groundGeometry.getAttribute("position").count;
  const total_gaussian = GaussianXCount * GaussianYCount;
  const total_point = total_ground + total_gaussian;
  const indices = new Uint16Array(total_point);
  const point_array = new Float32Array(total_point * 3);

  let i = 0;
  let j = 0;

  // create ground point
  point_array.set(groundGeometry.getAttribute("position").array);
  while (i < total_ground) {
    indices[j] = j;
    j++;
    i++;
  }

  // create gaussian point
  i = 0;
  while (i < total_gaussian) {
    indices[j] = j;
    point_array[j * 3] = randomGaussian(0, 1) * GaussianRadius;
    point_array[j * 3 + 1] = 0;
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
      'uPixelRatio': { value: window.devicePixelRatio },
      'uMouse': { value: new THREE.Vector3(999, 999, 0) },
      'uTouch': { value: null },
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