import { AdditiveBlending, Mesh, NormalBlending, ShaderMaterial, TorusGeometry } from "three";
import VertexShader from '@/shaders/ring.vert';
import FragmentShader from "@/shaders/ring.frag";
import ringMeshTongMaterial from "../material/RingMeshTong";
import ringMeshStandardMaterial from "../material/RingMeshTong";


export const createRing = () => {
  const ringGeometry = new TorusGeometry(0.35, 0.1, 4, 40);
  ringGeometry.rotateX(Math.PI / 8);
  // const ringMaterial = new ShaderMaterial({
  //   vertexShader: VertexShader,
  //   fragmentShader: FragmentShader,
  //   uniforms: {

  //   },
  //   depthTest: true,
  //   depthWrite: true,
  //   transparent: false,
  //   blending: AdditiveBlending,
  //   wireframe: false
  // });
  const ring = new Mesh(ringGeometry, ringMeshStandardMaterial);
  return ring;
}
