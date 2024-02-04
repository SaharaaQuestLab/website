import * as THREE from 'three';
// import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
// import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import type { WebGLRenderer, Scene, PerspectiveCamera } from 'three';
import { DepthOfFieldEffect, EffectPass, EffectComposer, RenderPass } from 'postprocessing';
import { createGroundParticle } from './geometry/GroundParticle';
import { createSkyParticle } from './geometry/SkyParticle';
import env from '@/utils/bowser.utils';

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

  constructor(el: Window | HTMLElement) {
    this._el = el;
    this._render = this.createRender();
    this._scene = this.createScene();
    this._camera = this.createCamera();
    this.createComposer();
    this.createEvent();
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
    const camera = new THREE.PerspectiveCamera(fov, this.renderRect.width / this.renderRect.height, 0.1, 1000);
    return camera;
  }

  private createEvent() {
    window.addEventListener("resize", () => {
      const { width, height } = this.renderRect;
      this._render.setSize(width, height);
      this._render.setPixelRatio(window.devicePixelRatio);
      this._camera.aspect = width / height;
      this._camera.updateProjectionMatrix();
    })
  }

  private createComposer() {
    if (this._composer) return;
    this._composer = new EffectComposer(this._render);
  }

  private _animate() {
    if (this._requestCallback) this._requestCallback();
    if (this._composer) {
      this._composer.render(this._clock.getElapsedTime());
    } else {
      this._render.render(this._scene, this._camera);
    }
    this._requestAnimationId = requestAnimationFrame(() => this._animate())
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

    this._camera.position.set(0, 0.95, 4);

    const renderPass = new RenderPass(this._scene, this._camera);
    // const bokehPass = new BokehPass(this._scene, this._camera, {
    //   focus: 0,
    //   aperture: 5 * 0.00001,
    //   maxblur: 0.01
    // });
    const dofEffect = new DepthOfFieldEffect(this._camera, {
      focusDistance: 0.9,
      focalLength: 0.9,
      bokehScale: 25.0
    });
    // const depthEffect = new DepthEffect({ blendFunction: BlendFunction.SKIP });
    const effectPass = new EffectPass(this._camera, dofEffect);
    // const outputPass = new OutputPass();
    this._composer?.addPass(renderPass);
    this._composer?.addPass(effectPass);
    // this._composer?.addPass(outputPass);

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
      this._render.domElement.addEventListener('touchmove', (e) => {
        // if (e.isPrimary === false) return;
        const p = e.touches[0];
        const normalizeX = ((p.clientX + this.renderRect.x) / this.renderRect.width) * 2 - 1;
        this._camera.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), - Math.PI * normalizeX / 80);

        // (bokehPass.uniforms as { focus: { value: number } }).focus.value = (Math.abs(normalizeX)) * 200;
      })
    } else {
      this._render.domElement.addEventListener('pointermove', (e) => {
        if (e.isPrimary === false) return;
        const normalizeX = ((e.clientX + this.renderRect.x) / this.renderRect.width) * 2 - 1;
        this._camera.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), - Math.PI * normalizeX / 80);
        // dofEffect.bokehScale = (Math.abs(normalizeX)) * 20;
        // dofEffect.cocMaterial.uniforms.focalLength.value = (Math.abs(normalizeX));
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

