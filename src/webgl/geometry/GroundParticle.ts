import * as THREE from 'three';
import VertexShader from '@/shaders/ground.vert';
import FragmentShader from '@/shaders/ground.frag';

export const createGroundParticle: () => [THREE.Points, THREE.ShaderMaterial] = () => {
  const width = 200;
  const height = 200;
  const groundGeometry = new THREE.PlaneGeometry(3, 3, width, height);
  groundGeometry.rotateX(Math.PI / 2);
  groundGeometry.rotateY(Math.PI / 4);
  const particleGeometry = new THREE.BufferGeometry();


  const total = groundGeometry.getAttribute("position").count;
  const indices = new Uint16Array(total);
  // const offsets = new Float32Array(total * 3);
  const size = new Float32Array(total);
  const angles = new Float32Array(total);
  const scales = new Float32Array(total);

  for (let i = 0, j = 0; i < total; i++) {
    size[i] = i;
    // offsets[j * 3 + 0] = i % width;
    // offsets[j * 3 + 1] = Math.floor(i / width);

    indices[j] = i;
    scales[i] = 1;
    angles[j] = j * Math.PI * 2 / total;

    j++;
  }

  particleGeometry.setAttribute('a_index', new THREE.BufferAttribute(indices, 1, false));
  // particleGeometry.setAttribute('offset', new THREE.BufferAttribute(offsets, 3, false));
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(groundGeometry.getAttribute("position").array, 3));
  particleGeometry.setAttribute('a_size', new THREE.BufferAttribute(size, 1));
  particleGeometry.setAttribute('a_scale', new THREE.BufferAttribute(scales, 1));
  particleGeometry.setAttribute('angle', new THREE.BufferAttribute(angles, 1));
  // particleGeometry.setAttribute('index', groundGeometry.getAttribute("index"));
  // particleGeometry.setAttribute('uv', new THREE.BufferAttribute(groundGeometry.getAttribute("uv").array, 1));

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      'uTotal': { value: total },
      'uTime': { value: 0 },
      'uPixelRatio': { value: window.devicePixelRatio },
      'uMouse': { value: new THREE.Vector3(10) }
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