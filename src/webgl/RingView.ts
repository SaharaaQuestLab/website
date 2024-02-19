import * as THREE from 'three';
import type { WebGLRenderer, Scene, PerspectiveCamera } from 'three';
import env from '@/utils/bowser.utils';
import { CircleRing } from './geometry/CircleRing';
// import { SpatialControls } from 'spatial-controls';
import { OutlineEffect } from 'three/examples/jsm/Addons.js';
import { gsap } from 'gsap';


export default class RingView {
  private _el: Window | HTMLElement;
  private _render: WebGLRenderer;
  private _scene: Scene;
  private _camera: PerspectiveCamera;
  private _clock = new THREE.Clock();
  private _composer?: OutlineEffect;
  private _requestAnimationId?: number;
  private _status: 'playing' | 'pausing' = 'pausing';
  private _stage: number = 0;
  private _requestCallback?: (timestamp: number) => void;
  private _updateCallback: ((ring: CircleRing) => void) | null = null;
  // private _controls?: SpatialControls;
  // private _isMouseMove?: boolean = false;s
  private _rings: Array<CircleRing> = [];
  private _container: THREE.Object3D = new THREE.Object3D();

  constructor(el: Window | HTMLElement) {
    this._el = el;
    this._render = this.createRender();
    this._scene = this.createScene();
    this._camera = this.createCamera();
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

  private createComposer() {
    if (this._composer) return;
    // this._composer = new EffectComposer(this._render);
  }

  private createRings() {
    this._rings = Array(2).fill(undefined).map(() => new CircleRing({ radius: 0.35, tube: 0.1 }));
    this._rings.push(...Array(3).fill(undefined).map(() => new CircleRing({ radius: 0, tube: 0 })));
    this._container.add(...this._rings.map(r => r.mesh));
    this._scene.add(this._container);
  }

  // private createControls() {
  //   this._controls = new SpatialControls(this._camera.position, this._camera.quaternion, this._render.domElement);
  //   const settings = this._controls.settings;
  //   settings.rotation.sensitivity = 2.2;
  //   settings.rotation.damping = 0.05;
  //   settings.translation.damping = 0.1;
  // }

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

    // add point light
    const pointLight = new THREE.PointLight(0xffffff, 30.0, 100);
    pointLight.position.set(-2.0, 1.5, -2.0);
    this._scene.add(pointLight);

    this._camera.position.set(-2, 2, 3);
    this._camera.lookAt(0, 0, 0);

    if (init) this.setSceneOne();

    this._composer = new OutlineEffect(this._render, { defaultColor: [8 / 16, 8 / 16, 8 / 16] });

    this._requestCallback = (timestamp: number) => {
      if (this._updateCallback !== null) {
        for (let i = 0; i < this._rings.length; i++) {
          const ring = this._rings[i];
          this._updateCallback(ring);
        }
      }
    }

    window.addEventListener("resize", () => {

    })
  }

  public setSceneOne() {
    if (this._stage > 1) return;
    this._stage = 1;
    this._scene.remove(...this._rings.map(r => r.mesh));
    const [ring1, ring2] = this._rings;
    this._scene.add(ring1.mesh, ring2.mesh);
    ring1.move(-0.175, 0, 0);
    ring2.rotateByAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    ring2.move(0.175, 0, 0);
    this._updateCallback = (ring) => { ring.selfRotate(Math.PI / 480) };
  }

  public setSceneTwo() {
    if (this._stage > 2) return;
    this._stage = 2;
    this._scene.add(this._rings[2].mesh);
    this.transToSceneTwo();
  }

  public setSceneThree() {
    if (this._stage === 3) return;
    this._stage = 3;
    const [ring1, ring2, ring3, ring4, ring5] = this._rings;
    ring1.updateCacheRotation();
    ring2.updateCacheRotation();
    ring3.updateCacheRotation();
    ring4.updateCacheRotation();
    ring5.updateCacheRotation();
    this._scene.add(ring4.mesh, ring5.mesh);
    ring4.moveTo(0, 0.25, 0);
    ring4.rotateByAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    ring5.moveTo(0, 0.5, 0);
    ring5.rotateByAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    this.transToSceneThree();
  }

  private transToSceneTwo() {
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
        update(ticker.progress / 100)
      }
    });
  }

  public setSceneThreeDirect() {
    if (this._stage === 3) return;
    this._stage = 3;
    const [ring1, ring2, ring3, ring4, ring5] = this._rings;
    ring1.update(0, 0.075).moveTo(0, -0.5, 0).rotateByXYZ(Math.PI / 2, 0, 0);
    ring2.update(0.35, 0.075).moveTo(0, -0.25, 0).rotateByXYZ(Math.PI / 2, 0, 0);
    ring3.update(0.5, 0.075).moveTo(0, 0, 0).rotateByXYZ(Math.PI / 2, 0, 0);
    ring4.update(0.35, 0.075).moveTo(0, 0.25, 0).rotateByXYZ(Math.PI / 2, 0, 0);
    ring5.update(0, 0.075).moveTo(0, 0.5, 0).rotateByXYZ(Math.PI / 2, 0, 0);
    this._camera.rotation.z = Math.PI / 16;
    this._updateCallback = (ring) => { this.upCircleRing(ring, 0.001) };
  }

  private transToSceneThree() {
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
        .rotateByXYZ(ring4.cacheRotation.x * (1 - progress) + Math.PI / 2 * progress, ring4.cacheRotation.y * (1 - progress), ring4.cacheRotation.z * (-1 + progress));

      ring5.update(0, 0.075)
        .rotateByXYZ(ring5.cacheRotation.x * (1 - progress) + Math.PI / 2 * progress, ring5.cacheRotation.y * (1 - progress), ring5.cacheRotation.z * (-1 + progress));

      this._camera.rotation.z = Math.PI / 16 * progress;
    }
    const ticker = { progress: 0 };
    gsap.to(ticker, {
      progress: 100,
      duration: 0.5,
      ease: "power2.inOut",
      onUpdate: () => {
        update(ticker.progress / 100)
      },
      onComplete: () => {
        this._updateCallback = (ring) => { this.upCircleRing(ring, 0.001) };
      }
    });
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

