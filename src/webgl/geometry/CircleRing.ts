import { Euler, Mesh, Quaternion, TorusGeometry, Vector3 } from "three";
import ringMeshStandardMaterial from "../material/RingMeshTong";

interface CircleRingOptions {
  radius: number,
  tube: number,
  radialSegments?: number,
  tubularSegments?: number
}

export class CircleRing {

  private radialSegments: number = 4;
  private tubularSegments: number = 96;
  private curPosition: Vector3 | null = null;
  private curQuaternion: Quaternion | null = null;

  public cacheRotation: Euler = new Euler();
  public mesh: Mesh;
  public geometry: TorusGeometry;
  public selfRotateAxis: Vector3;
  // public material: Material;

  constructor(options?: CircleRingOptions) {
    this.radialSegments = options?.radialSegments || 4;
    this.tubularSegments = options?.tubularSegments || 96;
    this.geometry = new TorusGeometry(options?.radius, options?.tube, this.radialSegments, this.tubularSegments);
    this.mesh = new Mesh(this.geometry, ringMeshStandardMaterial);
    this.selfRotateAxis = new Vector3(1, 0, 0);
  }


  public update(radius: number, tube?: number): this {
    tube = tube || this.geometry.parameters.tube;
    const parent = this.mesh.parent;
    parent?.remove(this.mesh);
    this.geometry.dispose();
    this.geometry = new TorusGeometry(radius, tube, this.radialSegments, this.tubularSegments);
    this.mesh = new Mesh(this.geometry, ringMeshStandardMaterial);
    this.mesh.matrixAutoUpdate = true;
    this.mesh.visible = radius > 0.005;

    if (this.curPosition) this.mesh.position.copy(this.curPosition);
    if (this.curQuaternion) this.mesh.setRotationFromQuaternion(this.curQuaternion);
    parent?.add(this.mesh);
    return this;
  }

  public move(x: number, y: number, z: number): this {
    this.curPosition = this.mesh.position.add(new Vector3(x, y, z));
    return this;
  }

  public moveTo(x: number, y: number, z: number): this {
    this.curPosition = this.mesh.position.set(x, y, z);
    return this;
  }

  public rotateByAxis(axis: Vector3, angle: number) {
    const quaternion = new Quaternion().setFromAxisAngle(axis, angle);
    this.curQuaternion = this.mesh.quaternion.multiplyQuaternions(quaternion, this.mesh.quaternion);
  }

  public rotateByXYZ(x: number, y: number, z: number) {
    // const euler = new Euler(x, y, z);
    const euler = this.mesh.rotation.set(x, y, z);
    this.curQuaternion = new Quaternion().setFromEuler(euler);
    // const quaternion = new Quaternion().setFromEuler(euler);
    // this.curQuaternion = this.mesh.quaternion.multiplyQuaternions(quaternion, this.mesh.quaternion);
  }

  public updateCacheRotation() {
    if (this.curQuaternion) this.cacheRotation = new Euler().setFromQuaternion(this.curQuaternion);
  }



  public setSelfRotateAxis(x: number, y: number, z: number) {
    this.selfRotateAxis = new Vector3(x, y, z);
    return this;
  }

  public selfRotate(angle: number) {
    const quaternion = new Quaternion().setFromAxisAngle(this.selfRotateAxis, angle);
    this.curQuaternion = this.mesh.quaternion.multiplyQuaternions(quaternion, this.mesh.quaternion);
  }
}


