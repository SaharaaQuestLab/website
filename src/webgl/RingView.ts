import * as THREE from 'three';
import type { WebGLRenderer, Scene, PerspectiveCamera } from 'three';
import env from '@/utils/bowser.utils';
// import { EffectPass, EffectComposer, RenderPass } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { createRing } from './geometry/CircleRing';
import { SpatialControls } from 'spatial-controls';
import { EffectComposer, OutlineEffect, EffectPass, RenderPass, BlendFunction } from 'postprocessing';


export interface HeroViewOptions {
  platform?: 'mobile' | 'desktop'
}

export default class RingView {
  private _el: Window | HTMLElement;
  private _render: WebGLRenderer;
  private _scene: Scene;
  private _camera: PerspectiveCamera;
  private _clock = new THREE.Clock();
  private _composer?: EffectComposer;
  private _requestAnimationId?: number;
  private _requestCallback?: () => void;
  private _controls?: SpatialControls;
  private _isMouseMove?: boolean = false;
  private _rings: Array<THREE.Mesh<THREE.TorusGeometry>> = [];

  constructor(el: Window | HTMLElement) {
    this._el = el;
    this._render = this.createRender();
    this._scene = this.createScene();
    this._camera = this.createCamera();
    this.createComposer();
    this.createEvent();
    this.createRings();
    this.createControls();
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
    camera.updateProjectionMatrix();
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
    this._composer = new EffectComposer(this._render);
  }

  private createRings() {
    this._rings = Array(5).fill(undefined).map(() => createRing());
  }

  private createControls() {
    this._controls = new SpatialControls(this._camera.position, this._camera.quaternion, this._render.domElement);
    const settings = this._controls.settings;
    settings.rotation.sensitivity = 2.2;
    settings.rotation.damping = 0.05;
    settings.translation.damping = 0.1;
  }

  private _animate(timestamp?: number) {
    if (this._controls) this._controls.update(timestamp || 0);
    if (this._requestCallback) this._requestCallback();
    if (this._composer) {
      this._composer.render(this._clock.getElapsedTime());
    } else {
      this._render.render(this._scene, this._camera);
    }
    this._requestAnimationId = requestAnimationFrame((time: number) => this._animate(time))
  }

  public useSetup() {

    this.setSceneOne();

    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 第二个参数是光照强度
    // this._scene.add(ambientLight);

    // 添加一个定向光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(2, 2, -1); // 设置光源的位置
    this._scene.add(directionalLight);

    // this._camera.position.set(0, 0.5, 4);
    this._controls?.position.set(0, 0.5, 4);
    this._controls?.lookAt(0, 0.5, 0);


    const outlineEffect = new OutlineEffect(this._scene, this._camera, {
      blendFunction: BlendFunction.SCREEN,
      multisampling: Math.min(4, this._render.capabilities.maxSamples),
      edgeStrength: 0.5,
      pulseSpeed: 0.0,
      visibleEdgeColor: 0xffffff,
      hiddenEdgeColor: 0x22090a,
      height: 480,
      blur: false,
      xRay: true
    });
    outlineEffect.selection.set(this._rings);
    const renderPass = new RenderPass(this._scene, this._camera);
    const outlinePass = new EffectPass(this._camera, outlineEffect);
    this._composer?.addPass(renderPass);
    this._composer?.addPass(outlinePass);

    this._requestCallback = () => {
      const elapse = this._clock.getElapsedTime();
      // fallMaterial.uniforms.uTime.value = elapse;
    }

    window.addEventListener("resize", () => {

    })

    if (env.platform.type === 'mobile') {
      this._render.domElement.addEventListener('touchmove', (event) => {
        // if (e.isPrimary === false) return;
        const e = event.touches[0];
        const normalizeX = ((e.clientX - this.renderRect.left) / this.renderRect.width) * 2 - 1;
        const normalizeY = -((e.clientY - this.renderRect.top) / this.renderRect.height) * 2 + 1;
        // this._camera.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), - Math.PI * normalizeX / 80);

        // (bokehPass.uniforms as { focus: { value: number } }).focus.value = (Math.abs(normalizeX)) * 200;
      })
    } else {
      this._render.domElement.addEventListener('pointerenter', () => { this._isMouseMove = true });
      this._render.domElement.addEventListener('pointerleave', () => {
        this._isMouseMove = false;
      })
      this._render.domElement.addEventListener('pointermove', (event) => {
        if (event.isPrimary === false) return;
        if (!this._isMouseMove) return;
        const e = event;
        const normalizeX = ((e.clientX - this.renderRect.left) / this.renderRect.width) * 2 - 1;
        const normalizeY = -((e.clientY - this.renderRect.top) / this.renderRect.height) * 2 + 1;
      })
    }
  }

  public setSceneOne() {
    this._scene.remove(...this._rings);
    const [ring1, ring2] = this._rings;
    this._scene.add(ring1, ring2);
    ring1.position.set(-0.25, 0, 0);
    ring1.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    ring2.position.set(0.25, 0, 0);
  }

  public setSceneTwo() {
    this._scene.remove(...this._rings);
    const [ring1, ring2, ring3] = this._rings;
    this._scene.add(ring1, ring2, ring3);
    ring1.geometry.scale(1 / 0.7, 1 / 0.7, 1 / 0.7);
    ring1.position.set(0, 0, 0);
    ring2.geometry.scale(0.7 / 0.6, 0.7 / 0.6, 0.7 / 0.6)
    ring2.position.set(0, 0, 0);
    ring3.geometry.scale(0.2 / 0.7, 0.2 / 0.7, 0.2 / 0.7)
    ring3.position.set(0, 0, 0);
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

