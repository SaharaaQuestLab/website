import { AdditiveBlending, Mesh, NormalBlending, ShaderMaterial, TorusGeometry } from "three";
import VertexShader from '@/shaders/ring.vert';
import FragmentShader from "@/shaders/ring.frag";
import ringMeshTongMaterial from "../material/RingMeshTong";


export const createRing = () => {
  const ringGeometry = new TorusGeometry(0.7, 0.1, 4, 40);
  const ringMaterial = new ShaderMaterial({
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
    uniforms: {

    },
    depthTest: true,
    depthWrite: true,
    transparent: false,
    blending: AdditiveBlending,
    wireframe: false
  });
  const ring = new Mesh(ringGeometry, ringMeshTongMaterial);
  return ring;
}
