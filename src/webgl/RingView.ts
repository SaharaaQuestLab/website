import * as THREE from 'three';
import type { WebGLRenderer, Scene, PerspectiveCamera } from 'three';
import { CircleRing } from './geometry/CircleRing';
// import { SpatialControls } from 'spatial-controls';
import { OutlineEffect } from 'three/examples/jsm/Addons.js';
import { gsap } from 'gsap';
// import env from '@/utils/bowser.utils';

function easeOutQuad(t: number): number {
  const x = Math.abs(t);
  return (1 - (1 - x) * (1 - x)) * Math.sign(t);
}

export default class RingView {
  private _el: Window | HTMLElement;
  private _render: WebGLRenderer;
  private _scene: Scene;
  private _camera: PerspectiveCamera;
  // private _cameraRotateAxis: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private _cameraRotation: number = 0;
  // private _cameraRadius: number = 0;
  private _pointLight: THREE.PointLight;


  private _composer?: OutlineEffect;
  private _requestAnimationId?: number;
  private _status: 'playing' | 'pausing' = 'pausing';
  private _stage: number = 0;
  private _requestCallback?: (timestamp: number) => void;
  private _updateCallback: ((ring: CircleRing) => void) | null = null;
  private _rings: Array<CircleRing> = [];


  constructor(el: Window | HTMLElement) {
    this._el = el;
    this._render = this.createRender();
    this._scene = this.createScene();
    this._camera = this.createCamera();
    this._pointLight = this.createPointLight();
    this.createEvent();
    this.createRings();
  }

  get renderRect() {
    return this._el instanceof Window ?
      new DOMRect(0, 0, this._el.innerWidth, this._el.innerHeight) :
      this._el.getBoundingClientRect();
  }

  private createRender() {
    const render = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    render.setPixelRatio(window.devicePixelRatio);
    render.setSize(this.renderRect.width, this.renderRect.height);
    if (this._el instanceof Window) {
      this._el.document.body.appendChild(render.domElement);
    } else {
      this._el.appendChild(render.domElement);
    }
    return render;
  }

  private createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121315);
    return scene;
  }

  private createCamera() {
    const houdiniFocalLength = 80;
    const houdiniAperture = 41.4214;
    const fov = 2 * Math.atan(houdiniAperture / (2 * houdiniFocalLength)) * (180 / Math.PI);
    const camera = new THREE.PerspectiveCamera(fov, this.renderRect.width / this.renderRect.height, 0.1, 2000);
    return camera;
  }

  private createPointLight() {
    const pointLight = new THREE.PointLight(0xffffff, 30.0, 100);
    pointLight.position.set(-2.0, 1.5, -2.0);
    this._scene.add(pointLight);
    return pointLight;
  }

  private createEvent() {
    window.addEventListener("resize", () => {
      const { width, height } = this.renderRect;
      this._render.setSize(width, height);
      this._render.setPixelRatio(window.devicePixelRatio);
      this._camera.aspect = width / height;
      this._camera.updateProjectionMatrix();
      if (this._composer) this._composer.setSize(width, height);
    })

    if (import.meta.env.DEV) {
      window.addEventListener("keydown", (evt) => {
        if (evt.ctrlKey && evt.shiftKey && evt.key === "R") {
          evt.preventDefault();
          this.snapshot();
        }
      });
    }
  }

  private createRings() {
    this._rings = Array(2).fill(undefined).map(() => new CircleRing({ radius: 0.35, tube: 0.1 }));
    this._rings.push(...Array(3).fill(undefined).map(() => new CircleRing({ radius: 0, tube: 0 })));
    this._scene.add(...this._rings.map(r => r.mesh));
  }

  private _animate(timestamp?: number) {
    if (this._status === 'pausing') return;
    // if (this._controls) this._controls.update(timestamp || 0);
    if (this._requestCallback) this._requestCallback(timestamp || 0);
    if (this._composer) {
      this._composer.render(this._scene, this._camera);
    } else {
      this._render.render(this._scene, this._camera);
    }
    this._requestAnimationId = requestAnimationFrame((time: number) => this._animate(time));
  }

  private upCircleRing(ring: CircleRing, deltaY: number) {
    let dy = ring.mesh.position.y + deltaY;
    dy = dy > 0.5 ? -0.75 : dy;
    const ringRadius = 0.5 * Math.cos(Math.PI / 2 * dy / 0.5);
    ring.update(ringRadius, 0.075).moveTo(0, dy, 0);
  }

  public useSetup(init: boolean = true) {

    // 添加一个定向光源
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    // directionalLight.position.set(-3, 1.5, -3); // 设置光源的位置
    // this._scene.add(directionalLight);

    this._camera.position.set(0, 0, 4);
    // const { x, y, z } = this._camera.position;
    // this._cameraRadius = 4;//Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    // this._camera.lookAt(0, 0, 0);

    // init rings
    const [ring1, ring2, _, ring4, ring5] = this._rings;
    ring1.move(-0.175, 0, 0);
    ring2.rotateByAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    ring2.move(0.175, 0, 0);
    ring4.moveTo(0, 0.25, 0);
    ring4.rotateByAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    ring5.moveTo(0, 0.5, 0);
    ring5.rotateByAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);

    if (init) this.scene0To1();
    this._camera.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 12);
    this._composer = new OutlineEffect(this._render, { defaultColor: [8 / 16, 8 / 16, 8 / 16] });

    this._requestCallback = () => {
      if (this._updateCallback !== null) {
        for (let i = 0; i < this._rings.length; i++) {
          const ring = this._rings[i];
          this._updateCallback(ring);
        }
      }
    }

    // if (env.platform.type === "desktop") {
    //   this._render.domElement.addEventListener('pointermove', (event) => {
    //     if (event.isPrimary === false) return;
    //     const e = event;
    //     const normalizeX = ((e.clientX - this.renderRect.left) / this.renderRect.width) * 2 - 1;
    //     const angle = Math.PI / 6;
    //     const destAngle = - easeOutQuad(normalizeX) * angle;
    //     this.rotateAroundWorldAxis(new THREE.Vector3(0.5, 1, 0), destAngle - this._cameraRotation);
    //     this._cameraRotation = destAngle;
    //   }, { passive: true });
    // }
  }

  public scene0To1() {
    if (this._stage >= 1) return;
    this._stage = 1;
    const [ring1, ring2] = this._rings;
    this._scene.add(ring1.mesh, ring2.mesh);
    this._updateCallback = (ring) => { ring.selfRotate(Math.PI / 480) };
  }

  public scene1To2() {
    if (this._stage >= 2) return;
    this._stage = 2;
    this._scene.add(this._rings[2].mesh);
    this.transScene1To2();
  }

  private transScene1To2() {
    const update = (progress: number) => {
      const [ring1, ring2, ring3] = this._rings;
      ring1.update(0.35 + (0.5 - 0.35) * progress, 0.1 - 0.025 * progress)
        .moveTo((-0.175 + (0.175) * progress), 0, 0)
        .setSelfRotateAxis(1 + (-1 - 1) * progress, 0 + (1 - 0) * progress, 0)
      ring2.update(0.35 + (0.3 - 0.35) * progress, 0.1 - 0.025 * progress)
        .moveTo(0.175 + (-0.175) * progress, 0, 0)
        .setSelfRotateAxis(1, 0, -1 * progress);
      ring3.update(0.1 * progress, 0.1 - 0.025 * progress)
        .setSelfRotateAxis(1 - progress, 1 * progress, 1 * progress);
    }

    const ticker = { progress: 0 };
    gsap.to(ticker, {
      progress: 100,
      duration: 0.5,
      ease: "power2.inOut",
      onUpdate: () => {
        update(ticker.progress / 100);
      }
    });
  }

  public scene2To3() {
    if (this._stage === 3) return;
    this._stage = 3;
    const [ring1, ring2, ring3, ring4, ring5] = this._rings;
    ring1.updateCacheStatus();
    ring2.updateCacheStatus();
    ring3.updateCacheStatus();
    ring4.updateCacheStatus();
    ring5.updateCacheStatus();
    this._scene.add(ring4.mesh, ring5.mesh);
    this.transScene2To3();
  }

  private transScene2To3() {
    const update = (progress: number) => {
      const [ring1, ring2, ring3, ring4, ring5] = this._rings;
      ring1.update(0.5 - 0.5 * progress, 0.075)
        .moveTo(0, -0.5 * progress, 0)
        .rotateByXYZ(ring1.cacheRotation.x * (1 - progress) + Math.PI / 2 * progress, ring1.cacheRotation.y * (1 - progress), ring1.cacheRotation.z * (-1 + progress));

      ring2.update(0.3 + (0.35 - 0.3) * progress, 0.075)
        .moveTo(0, -0.25 * progress, 0)
        .rotateByXYZ(ring2.cacheRotation.x * (1 - progress) + Math.PI / 2 * progress, ring2.cacheRotation.y * (1 - progress), ring2.cacheRotation.z * (-1 + progress));

      ring3.update(0.1 + (0.5 - 0.1) * progress, 0.075)
        .rotateByXYZ(ring3.cacheRotation.x * (1 - progress) + Math.PI / 2 * progress, ring3.cacheRotation.y * (1 - progress), ring3.cacheRotation.z * (-1 + progress));

      ring4.update(0.35 * progress, 0.075)
        .moveTo(0, 0.25 * progress, 0)
        .rotateByXYZ(ring4.cacheRotation.x * (1 - progress) + Math.PI / 2 * progress, ring4.cacheRotation.y * (1 - progress), ring4.cacheRotation.z * (-1 + progress));

      ring5.update(0, 0.075)
        .moveTo(0, 0.5 * progress, 0)
        .rotateByXYZ(ring5.cacheRotation.x * (1 - progress) + Math.PI / 2 * progress, ring5.cacheRotation.y * (1 - progress), ring5.cacheRotation.z * (-1 + progress));

      // this._camera.rotation.z = Math.PI / 12 * progress;
    }
    const ticker = { progress: 0 };
    gsap.to(ticker, {
      progress: 100,
      duration: 0.5,
      ease: "power2.inOut",
      onUpdate: () => {
        update(ticker.progress / 100);
      },
      onComplete: () => {
        this._updateCallback = (ring) => { this.upCircleRing(ring, 0.001) };
        // this._updateCallback = null;
      }
    });
  }

  public scene3To2() {
    if (this._stage !== 3) return;
    this._stage = 2;
    const [ring1, ring2, ring3, ring4, ring5] = this._rings;
    ring1.updateCacheStatus();
    ring2.updateCacheStatus();
    ring3.updateCacheStatus();
    ring4.updateCacheStatus();
    ring5.updateCacheStatus();
    ring4.update(0, 0.075).moveTo(0, 0.5, 0);
    ring5.update(0, 0.075).moveTo(0, 0.5, 0);
    this._scene.remove(ring4.mesh, ring5.mesh);
    this._pointLight.position.setX(-2);
    this.transScene3To2();
  }

  private transScene3To2() {
    const update = (progress: number) => {
      const [ring1, ring2, ring3] = this._rings;
      ring1.update(ring1.cacheGeometry.radius + (0.5 - ring1.cacheGeometry.radius) * progress, 0.075)
        .moveTo(0, ring1.cachePosition.y * (1 - progress), 0)
        .rotateByXYZ(ring1.cacheRotation.x * (1 - progress), ring1.cacheRotation.y * (1 - progress), ring1.cacheRotation.z * (-1 + progress));

      ring2.update(ring2.cacheGeometry.radius + (0.3 - ring2.cacheGeometry.radius) * progress, 0.075)
        .moveTo(0, ring2.cachePosition.y * (1 - progress), 0)
        .rotateByXYZ(ring2.cacheRotation.x * (1 - progress), ring2.cacheRotation.y * (1 - progress), ring2.cacheRotation.z * (-1 + progress));

      ring3.update(ring3.cacheGeometry.radius + (0.1 - ring3.cacheGeometry.radius) * progress, 0.075)
        .moveTo(0, ring3.cachePosition.y * (1 - progress), 0)
        .rotateByXYZ(ring3.cacheRotation.x * (1 - progress), ring3.cacheRotation.y * (1 - progress), ring3.cacheRotation.z * (-1 + progress));

      // this._camera.rotation.z = Math.PI / 16 * (1 - progress);
    }
    const ticker = { progress: 0 };
    gsap.to(ticker, {
      progress: 100,
      duration: 0.5,
      ease: "power2.inOut",
      onUpdate: () => {
        update(ticker.progress / 100);
      },
      onComplete: () => {
        this._updateCallback = (ring) => { ring.selfRotate(Math.PI / 480) };
      }
    });
  }

  public scene2To1() {
    if (this._stage !== 2) return;
    this._stage = 1;
    const [ring1, ring2, ring3] = this._rings;
    ring1.updateCacheStatus();
    ring2.updateCacheStatus();
    this._scene.remove(ring3.mesh);
    this.transScene2To1();
  }

  private transScene2To1() {
    const update = (progress: number) => {
      const [ring1, ring2] = this._rings;
      ring1.update(0.5 + (0.35 - 0.5) * progress, 0.075 + 0.025 * progress)
        .moveTo((-0.175 * progress), 0, 0)
        .setSelfRotateAxis(1, 0, 0)
        .rotateByXYZ(ring1.cacheRotation.x * (1 - progress), ring1.cacheRotation.y * (1 - progress), ring1.cacheRotation.z * (-1 + progress))
      ring2.update(0.3 + (0.35 - 0.3) * progress, 0.075 + 0.025 * progress)
        .moveTo(0.175 * progress, 0, 0)
        .setSelfRotateAxis(1, 0, 0)
        .rotateByXYZ(ring2.cacheRotation.x * (1 - progress) + Math.PI * progress / 2, ring2.cacheRotation.y * (1 - progress), ring2.cacheRotation.z * (-1 + progress))
    }

    const ticker = { progress: 0 };
    gsap.to(ticker, {
      progress: 100,
      duration: 0.5,
      ease: "power2.inOut",
      onUpdate: () => {
        update(ticker.progress / 100);
      },
      onComplete: () => {
        // this._updateCallback = null;
      }
    });
  }

  public scene0To3() {
    if (this._stage === 3) return;
    this._stage = 3;
    this._camera.position.set(-2, 2, 3);
    this._camera.lookAt(0, 0, 0);
    const [ring1, ring2, ring3, ring4, ring5] = this._rings;
    ring1.update(0, 0.075).moveTo(0, -0.5, 0).rotateByXYZ(Math.PI / 2, 0, 0);
    ring2.update(0.35, 0.075).moveTo(0, -0.25, 0).rotateByXYZ(Math.PI / 2, 0, 0);
    ring3.update(0.5, 0.075).moveTo(0, 0, 0).rotateByXYZ(Math.PI / 2, 0, 0);
    ring4.update(0.35, 0.075).moveTo(0, 0.25, 0).rotateByXYZ(Math.PI / 2, 0, 0);
    ring5.update(0, 0.075).moveTo(0, 0.5, 0).rotateByXYZ(Math.PI / 2, 0, 0);
    this._camera.rotation.z = Math.PI / 16;
    this._updateCallback = (ring) => { this.upCircleRing(ring, 0.001) };
  }

  public snapshot() {
    if (this._composer) {
      this._composer.render(this._scene, this._camera);
    } else {
      this._render.render(this._scene, this._camera);
    }
    const canvas = this._render.domElement;
    const imgData = canvas.toDataURL('image/png');

    // 将图像数据保存为文件
    const a = document.createElement('a');
    a.href = imgData;
    a.download = `screenshot-ring-${this._stage}.png`;
    a.click();
  }

  public rotateAroundWorldAxis(axis: THREE.Vector3, radians: number) {
    const rotationMatrix = new THREE.Matrix4();

    // 旋转的中心点，这里假设为世界坐标原点
    const center = new THREE.Vector3(0, 0, 0);

    // 计算摄像机相对于旋转中心的位置向量
    const relativePosition = this._camera.position.clone().sub(center);

    // 使用旋转矩阵对相对位置进行旋转
    rotationMatrix.makeRotationAxis(axis.normalize(), radians);
    relativePosition.applyMatrix4(rotationMatrix);

    // 更新摄像机的位置
    this._camera.position.copy(center.clone().add(relativePosition));

    // 确保摄像机仍然朝向旋转中心
    this._camera.lookAt(center);
    this._camera.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 12);
  };

  public rotateLightAroundAxis(axis: THREE.Vector3, radians: number) {
    const rotationMatrix = new THREE.Matrix4();

    // 旋转的中心点，这里假设为世界坐标原点
    const center = new THREE.Vector3(0, 0, 0);

    // 计算摄像机相对于旋转中心的位置向量
    const relativePosition = this._camera.position.clone().sub(center);

    // 使用旋转矩阵对相对位置进行旋转
    rotationMatrix.makeRotationAxis(axis.normalize(), radians);
    relativePosition.applyMatrix4(rotationMatrix);
    this._pointLight.position.copy(center.clone().add(relativePosition));
  }


  public onPointMove(normalizeX: number) {
    const angle = Math.PI / 6;
    // if (this._cameraRotation > angle || this._cameraRotation < -angle) return;
    const destAngle = - easeOutQuad(normalizeX) * angle;
    // const normalize = easeOutQuad(normalizeX);
    // const angleSpan = - Math.PI / 100 * Math.sign(normalizeX) * (1 - Math.abs(normalizeX));
    // this._cameraRotation += angleSpan;
    this.rotateAroundWorldAxis(new THREE.Vector3(0.5, 1, 0), destAngle - this._cameraRotation);
    this._cameraRotation = destAngle;
    // this.rotateLightAroundAxis(new THREE.Vector3(0, 1, 0), angleSpan);
  }

  public movePointLight(options: { x: number, y: number }) {
    this._pointLight.position.set(
      options.x,
      options.y,
      this._pointLight.position.z
    )
  }

  public play() {
    this._status = 'playing';
    this._animate();
  }

  public stop() {
    this._status = 'pausing';
    if (this._requestAnimationId) cancelAnimationFrame(this._requestAnimationId);
  }

  public destroy() {
    this._status = 'pausing';
    if (this._requestAnimationId) cancelAnimationFrame(this._requestAnimationId);
  }

}

