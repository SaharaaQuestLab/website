import * as THREE from 'three';
import VertexShader from '@/shaders/background.vert';
import FragmentShader from '@/shaders/background.frag';

const GroundXCount = 10;
const GroundYCount = 10;
const GroundWidth = 3.2;
const GroundHeight = 3.2;

export const createBackgroundParticle: () => [THREE.Points, THREE.ShaderMaterial] = () => {

  const particleGeometry = new THREE.BufferGeometry();

  // ground geometry
  const groundGeometry = new THREE.PlaneGeometry(GroundWidth, GroundHeight, GroundXCount, GroundYCount);


  const total_background = groundGeometry.getAttribute("position").count;

  const indices = new Uint16Array(total_background);
  const point_array = new Float32Array(total_background * 3);

  let i = 0;
  let j = 0;

  // create ground point
  point_array.set(groundGeometry.getAttribute("position").array);
  while (i < total_background) {
    indices[j] = j;
    j++;
    i++;
  }



  particleGeometry.setAttribute('a_index', new THREE.BufferAttribute(indices, 1, false));
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(point_array, 3));


  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      'uTotal': { value: total_background },
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