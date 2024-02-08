import * as THREE from 'three';
import type { WebGLRenderer, Scene, PerspectiveCamera } from 'three';
import env from '@/utils/bowser.utils';
// import { EffectPass, EffectComposer, RenderPass } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { CircleRing } from './geometry/CircleRing';
// import { SpatialControls } from 'spatial-controls';
import { OutlineEffect } from 'three/examples/jsm/Addons.js';

// import { EffectComposer, OutlineEffect, EffectPass, RenderPass, BlendFunction } from 'postprocessing';


export interface HeroViewOptions {
  platform?: 'mobile' | 'desktop'
}

export default class RingView {
  private _el: Window | HTMLElement;
  private _render: WebGLRenderer;
  private _scene: Scene;
  private _camera: PerspectiveCamera;
  private _clock = new THREE.Clock();
  private _composer?: OutlineEffect;
  private _requestAnimationId?: number;
  private _requestCallback?: () => void;
  // private _controls?: SpatialControls;
  // private _isMouseMove?: boolean = false;
  private _rings: Array<CircleRing> = [];

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
  }

  private createComposer() {
    if (this._composer) return;
    // this._composer = new EffectComposer(this._render);
  }

  private createRings() {
    this._rings = Array(5).fill(undefined).map(() => new CircleRing());
  }

  // private createControls() {
  //   this._controls = new SpatialControls(this._camera.position, this._camera.quaternion, this._render.domElement);
  //   const settings = this._controls.settings;
  //   settings.rotation.sensitivity = 2.2;
  //   settings.rotation.damping = 0.05;
  //   settings.translation.damping = 0.1;
  // }

  private _animate(timestamp?: number) {
    // if (this._controls) this._controls.update(timestamp || 0);
    if (this._requestCallback) this._requestCallback();
    if (this._composer) {
      this._composer.render(this._scene, this._camera);
    } else {
      this._render.render(this._scene, this._camera);
    }
    this._requestAnimationId = requestAnimationFrame((time: number) => this._animate(time))
  }

  public useSetup() {

    this.setSceneOne();

    // 添加一个定向光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(2, 2, -0.5); // 设置光源的位置
    this._scene.add(directionalLight);

    // add point light
    const pointLight = new THREE.PointLight(0xffffff, 0.5, 20);
    pointLight.position.set(-1.0, -0.3, 0);
    this._scene.add(pointLight);

    this._camera.position.set(0, 0, 4);
    this._camera.lookAt(0, 0, 0);


    // const outlineEffect = new OutlineEffect(this._scene, this._camera, {
    //   blendFunction: BlendFunction.SCREEN,
    //   multisampling: Math.min(4, this._render.capabilities.maxSamples),
    //   edgeStrength: 10.0,
    //   pulseSpeed: 0.0,
    //   visibleEdgeColor: 0x333333,
    //   hiddenEdgeColor: 0x000000,
    //   width: this.renderRect.width,
    //   height: this.renderRect.height,
    //   blur: false,
    //   xRay: false
    // });
    // outlineEffect.selection.set(this._rings);
    // const renderPass = new RenderPass(this._scene, this._camera);
    // const outlinePass = new EffectPass(this._camera, outlineEffect);
    // this._composer?.addPass(renderPass);
    // this._composer?.addPass(outlinePass);
    this._composer = new OutlineEffect(this._render, { defaultColor: [3 / 16, 3 / 16, 3 / 16] });



    this._requestCallback = () => {
      const elapse = this._clock.getElapsedTime();
      const delta = this._clock.getDelta();
      const [ring1, ring2] = this._rings;
      const deltaRotate = Math.PI / 90;
      // ring1.update(0.35 + 0.1 * Math.sin(elapse));
      ring1.rotate(new THREE.Vector3(1, 0, 0), deltaRotate);
      // ring2.update(0.35 + 0.1 * Math.sin(elapse));
      ring2.rotate(new THREE.Vector3(0, 1, 0), deltaRotate);
    }

    window.addEventListener("resize", () => {

    })
  }

  public setSceneOne() {
    this._scene.remove(...this._rings.map(r => r.mesh));
    const [ring1, ring2] = this._rings;
    this._scene.add(ring1.mesh, ring2.mesh);
    ring1.move(-0.125, 0, 0);
    ring2.move(0.125, 0, 0);
  }

  public setSceneTwo() {

  }

  public setSceneThree() {

  }

  public play() {
    this._animate();
  }

  public destroy() {
    if (this._requestAnimationId) cancelAnimationFrame(this._requestAnimationId);
  }

}

