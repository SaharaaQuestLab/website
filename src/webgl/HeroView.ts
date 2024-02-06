import * as THREE from 'three';
// import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
// import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import type { WebGLRenderer, Scene, PerspectiveCamera } from 'three';
import { DepthOfFieldEffect, EffectPass, EffectComposer, RenderPass, DepthEffect, BlendFunction } from 'postprocessing';
import { createGroundParticle } from './geometry/GroundParticle';
import { createSkyParticle } from './geometry/SkyParticle';
import env from '@/utils/bowser.utils';
// import { SpatialControls } from 'spatial-controls';

function easeOutQuad(t: number): number {
  const x = Math.abs(t);
  return (1 - (1 - x) * (1 - x)) * Math.sign(t);
}

export interface HeroViewOptions {
  platform?: 'mobile' | 'desktop'
}

export default class HeroView {
  private _el: Window | HTMLElement;
  private _render: WebGLRenderer;
  private _scene: Scene;
  private _camera: PerspectiveCamera;
  private _clock = new THREE.Clock();
  private _composer?: EffectComposer;
  private _requestAnimationId?: number;
  private _requestCallback?: () => void;
  // private _controls?: SpatialControls;
  private _isMouseMove?: boolean = false;

  constructor(el: Window | HTMLElement) {
    this._el = el;
    this._render = this.createRender();
    this._scene = this.createScene();
    this._camera = this.createCamera();
    this.createComposer();
    this.createEvent();
    // this.createControls();
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
    scene.background = new THREE.Color(0x000000);
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
      this._composer.render(this._clock.getElapsedTime());
    } else {
      this._render.render(this._scene, this._camera);
    }
    this._requestAnimationId = requestAnimationFrame((time: number) => this._animate(time))
  }

  public useSetup() {
    // create ground
    const [groundParticles, groundMaterial] = createGroundParticle();
    this._scene.add(groundParticles);
    groundParticles.position.set(0, 0, 0);
    // create sky
    const [skyParticles, skyMaterial] = createSkyParticle();
    this._scene.add(skyParticles);
    skyParticles.position.set(0, 0, 0);

    // const planeGeo = new THREE.PlaneGeometry(3, 3, 25, 25);
    // const plane = new THREE.Points(planeGeo, new THREE.PointsMaterial({ color: "yellow", size: 0.05 }));
    // this._scene.add(plane);
    // plane.position.set(0, 0, 0);

    // const plane2 = new THREE.Points(planeGeo, new THREE.PointsMaterial({ color: "red", size: 0.05 }));
    // this._scene.add(plane2);
    // plane2.position.set(0, 0, -1);

    this._camera.position.set(0, 0.95, 4);
    // this._controls?.position.set(0, 0.95, 4);
    // this._controls?.lookAt(0, 0.95, 0);

    const renderPass = new RenderPass(this._scene, this._camera);
    // const bokehPass = new BokehPass(this._scene, this._camera, {
    //   focus: 0,
    //   aperture: 0.01,
    //   maxblur: 0.1
    // });

    const dofEffect = new DepthOfFieldEffect(this._camera, {
      worldFocusDistance: 4.5,
      worldFocusRange: 2,
      bokehScale: 3.0,
      resolutionScale: 0.75
    });

    // const depthEffect = new DepthEffect({ blendFunction: BlendFunction.SKIP });
    const effectPass = new EffectPass(this._camera, dofEffect);
    // const outputPass = new OutputPass();
    this._composer?.addPass(renderPass);
    this._composer?.addPass(effectPass);
    // this._composer?.addPass(outputPass);

    const raycaster = new THREE.Raycaster();
    const interactPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1));

    this._requestCallback = () => {
      const elapse = this._clock.getElapsedTime();
      groundMaterial.uniforms.uTime.value = elapse;
      skyMaterial.uniforms.uTime.value = elapse;
      // fallMaterial.uniforms.uTime.value = elapse;
    }

    window.addEventListener("resize", () => {
      groundMaterial.uniforms.uPixelRatio.value = window.devicePixelRatio;
      skyMaterial.uniforms.uPixelRatio.value = window.devicePixelRatio;
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
        const NonePoint = new THREE.Vector3(999);
        skyMaterial.uniforms.uMouse.value = NonePoint;
        groundMaterial.uniforms.uMouse.value = NonePoint;
      })
      this._render.domElement.addEventListener('pointermove', (event) => {
        if (event.isPrimary === false) return;
        if (!this._isMouseMove) return;
        const e = event;
        const normalizeX = ((e.clientX - this.renderRect.left) / this.renderRect.width) * 2 - 1;
        const normalizeY = -((e.clientY - this.renderRect.top) / this.renderRect.height) * 2 + 1;
        raycaster.setFromCamera(new THREE.Vector2(normalizeX, normalizeY), this._camera);
        const targetPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(interactPlane, targetPoint);
        skyMaterial.uniforms.uMouse.value = targetPoint;
        groundMaterial.uniforms.uMouse.value = targetPoint;
        // const mouse3D = new THREE.Vector3(normalizeX, normalizeY, 4);
        // mouse3D.unproject(this._camera);
        // console.log(mouse3D);
        this._camera.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), - Math.PI * easeOutQuad(normalizeX) / 120);
        // dofEffect.bokehScale = (Math.abs(normalizeX)) * 20;
        // dofEffect.cocMaterial.worldFocusDistance = (Math.abs(normalizeX)) * 10;
        // (bokehPass.uniforms as { focus: { value: number } }).focus.value = (Math.abs(normalizeX)) * 200;
      })
    }

  }

  public play() {
    this._animate();
  }

  public destroy() {
    if (this._requestAnimationId) cancelAnimationFrame(this._requestAnimationId);
  }

}

