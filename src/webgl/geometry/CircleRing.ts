import { AdditiveBlending, Material, Mesh, NormalBlending, Quaternion, ShaderMaterial, TorusGeometry, Vector3 } from "three";
import VertexShader from '@/shaders/ring.vert';
import FragmentShader from "@/shaders/ring.frag";
import ringMeshTongMaterial from "../material/RingMeshTong";
import ringMeshStandardMaterial from "../material/RingMeshTong";

interface CircleRingOptions {
  radius: number,
  tube: number,
  radialSegments: number,
  tubularSegments: number
}

export class CircleRing {

  private radialSegments: number = 4;
  private tubularSegments: number = 40;
  private curPosition: Vector3 | null = null;
  private curQuaternion: Quaternion | null = null;

  public mesh: Mesh;
  public geometry: TorusGeometry;
  // public material: Material;

  constructor(options?: Partial<CircleRingOptions>) {
    this.radialSegments = options?.radialSegments || 4;
    this.tubularSegments = options?.tubularSegments || 40;
    this.geometry = new TorusGeometry(options?.radius || 0.35, options?.tube || 0.1, this.radialSegments, this.tubularSegments);
    this.mesh = new Mesh(this.geometry, ringMeshStandardMaterial);
  }


  public update(radius: number, tube?: number): this {
    tube = tube || this.geometry.parameters.tube;
    const parent = this.mesh.parent;
    parent?.remove(this.mesh);
    this.geometry.dispose();
    this.geometry = new TorusGeometry(radius, tube, this.radialSegments, this.tubularSegments);
    this.mesh = new Mesh(this.geometry, ringMeshStandardMaterial);
    this.mesh.matrixAutoUpdate = true;

    if (this.curPosition) this.mesh.position.copy(this.curPosition);
    if (this.curQuaternion) this.mesh.setRotationFromQuaternion(this.curQuaternion);
    parent?.add(this.mesh);
    return this;
  }

  public move(x: number, y: number, z: number): this {
    this.curPosition = this.mesh.position.add(new Vector3(x, y, z));
    return this;
  }

  public rotate(axis: Vector3, angle: number) {
    const quaternion = new Quaternion().setFromAxisAngle(axis, angle);
    this.curQuaternion = this.mesh.quaternion.multiplyQuaternions(quaternion, this.mesh.quaternion);
  }
}


