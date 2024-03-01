import * as THREE from 'three';
import type { WebGLRenderer, Scene, PerspectiveCamera } from 'three';
import { DepthOfFieldEffect, EffectPass, EffectComposer, RenderPass, BlendFunction, OutlineEffect, } from 'postprocessing';
import { createGroundParticle } from './geometry/GroundParticle';
import env from '@/utils/bowser.utils';
import { DesktopOptions, MobileOptions, type FooterOptions } from './FooterOptions';


const footerOptions: FooterOptions = env.platform.type === 'mobile' ? MobileOptions : DesktopOptions;


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
  // private _isMouseMove?: boolean = false;
  private _status: 'playing' | 'pausing' = 'pausing';

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

  // private createControls() {
  //   this._controls = new SpatialControls(this._camera.position, this._camera.quaternion, this._render.domElement);
  //   const settings = this._controls.settings;
  //   settings.rotation.sensitivity = 2.2;
  //   settings.rotation.damping = 0.05;
  //   settings.translation.damping = 0.1;
  // }

  private _animate() {
    if (this._status === 'pausing') return;
    // if (this._controls) this._controls.update(timestamp || 0);
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
    const [groundParticles, groundMaterial] = createGroundParticle({
      xCount: footerOptions.ground.xCount,
      yCount: footerOptions.ground.yCount,
      gCount: 0,
      shaders: {
        centerHeight: footerOptions.ground.shaders.centerHeight,
        sampleBase4Layer1: 12.5
      }
    });

    this._scene.add(groundParticles);
    const groundPos = footerOptions.ground.position;
    groundParticles.position.set(groundPos.x, groundPos.y, groundPos.z);


    // create sky
    // const [skyParticles, skyMaterial] = createSkyParticle({
    //   xCount: heroOptions.sky.xCount,
    //   yCount: heroOptions.sky.yCount,
    //   shaders: heroOptions.sky.shaders
    // });
    // this._scene.add(skyParticles);
    // const skyPos = heroOptions.sky.position;
    // skyParticles.position.set(skyPos.x, skyPos.y, skyPos.z);


    // create sky inner
    // const [skyInnerParticles, skyInnerMaterial] = createSkyInnerParticle({
    //   xCount: heroOptions.skyInner.xCount,
    //   yCount: heroOptions.skyInner.yCount,
    //   shaders: heroOptions.skyInner.shaders
    // });
    // this._scene.add(skyInnerParticles);
    // const skyInnerPos = heroOptions.skyInner.position;
    // skyInnerParticles.position.set(skyInnerPos.x, skyInnerPos.y, skyInnerPos.z);


    // const [backgroundParticles, backgroundMaterial] = createBackgroundParticle();
    // this._scene.add(backgroundParticles);
    // backgroundParticles.position.set(0, 0, 0);

    // black sphere
    // const sphereGeo01 = new THREE.SphereGeometry(
    //   heroOptions.sphere1.radius[this._layout],
    //   heroOptions.sphere1.xCount,
    //   heroOptions.sphere1.yCount);
    // const sphereGeo02 = new THREE.SphereGeometry(
    //   heroOptions.sphere2.radius[this._layout],
    //   heroOptions.sphere2.xCount,
    //   heroOptions.sphere2.yCount);

    // const sphere1CamPos = heroOptions.sphere1.shaders.camPosition[this._layout];
    // const sphereMaterial01 = new THREE.ShaderMaterial({
    //   uniforms: {
    //     outlineColor: {
    //       value: new THREE.Color(0x666666)
    //     },
    //     camPosition: {
    //       value: new THREE.Vector3(sphere1CamPos.x, sphere1CamPos.y, sphere1CamPos.z)
    //     },
    //   },
    //   vertexShader: BlackSphereVertexShader,
    //   fragmentShader: BlackSphereFragmentShader
    // });
    // const sphere2CamPos = heroOptions.sphere2.shaders.camPosition[this._layout];
    // const sphereMaterial02 = new THREE.ShaderMaterial({
    //   uniforms: {
    //     outlineColor: {
    //       value: new THREE.Color(0x666666)
    //     },
    //     camPosition: {
    //       value: new THREE.Vector3(sphere2CamPos.x, sphere2CamPos.y, sphere2CamPos.z)
    //     }
    //   },
    //   vertexShader: BlackSphereVertexShader,
    //   fragmentShader: BlackSphereFragmentShader
    // });

    // const sphere01 = new THREE.Mesh(sphereGeo01, sphereMaterial01);
    // const sphere02 = new THREE.Mesh(sphereGeo02, sphereMaterial02);
    // this._scene.add(sphere01, sphere02);
    // const sphere1Pos = heroOptions.sphere1.position[this._layout];
    // sphere01.position.set(sphere1Pos.x, sphere1Pos.y, sphere1Pos.z);
    // const sphere2Pos = heroOptions.sphere2.position[this._layout];
    // sphere02.position.set(sphere2Pos.x, sphere2Pos.y, sphere2Pos.z);

    const cameraPosition = footerOptions.cameraPosition;
    this._camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    // this._controls?.position.set(0, 0.95, 4);
    // this._controls?.lookAt(0, 0.95, 0);

    const renderPass = new RenderPass(this._scene, this._camera);

    const dofEffect = new DepthOfFieldEffect(this._camera, {
      worldFocusDistance: footerOptions.dofEffect.focusDistance,
      worldFocusRange: 1.0,
      bokehScale: 3.0,
      resolutionScale: 1.0
    });

    // const vignetteEffect = new VignetteEffect({
    //   eskil: false,
    //   offset: 0.25,
    //   darkness: 0.75
    // });


    const outlineEffect = new OutlineEffect(this._scene, this._camera, {
      blendFunction: BlendFunction.SCREEN,
      multisampling: Math.min(4, this._render.capabilities.maxSamples),
      edgeStrength: 2.3,
      pulseSpeed: 0.0,
      visibleEdgeColor: 0x666666,
      hiddenEdgeColor: 0x000000,
      height: 720,
      // width: this.renderRect.width / 4,
      blur: true,
      xRay: true
    });

    //outlineEffect.selection.set([sphere01]);

    const effectPass = new EffectPass(this._camera, dofEffect, outlineEffect);

    this._composer?.addPass(renderPass);
    this._composer?.addPass(effectPass);
    // this._composer?.addPass(outputPass);

    // const raycaster = new THREE.Raycaster();
    // const interactPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1));

    this._requestCallback = () => {
      const elapse = this._clock.getElapsedTime();
      groundMaterial.uniforms.uTime.value = elapse;
      // skyMaterial.uniforms.uTime.value = elapse;
      // skyInnerMaterial.uniforms.uTime.value = elapse;
      // backgroundMaterial.uniforms.uTime.value = elapse;
      // sphere01.position.y += Math.sin(elapse) * 0.0005;
    }

    window.addEventListener("resize", () => {
      groundMaterial.uniforms.uPixelRatio.value = window.devicePixelRatio;
      // skyMaterial.uniforms.uPixelRatio.value = window.devicePixelRatio;
      // skyInnerMaterial.uniforms.uPixelRatio.value = window.devicePixelRatio;
      // backgroundMaterial.uniforms.uPixelRatio.value = window.devicePixelRatio;
    })
  }

  public snapshot() {
    if (this._composer) {
      this._composer.render(this._clock.getElapsedTime());
    } else {
      this._render.render(this._scene, this._camera);
    }
    const canvas = this._render.domElement;
    const imgData = canvas.toDataURL('image/png');

    // 将图像数据保存为文件
    const a = document.createElement('a');
    a.href = imgData;
    a.download = `screenshot-hero.png`;
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

