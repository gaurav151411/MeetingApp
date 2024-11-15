import {
  ArMarkerControls,
  ArSmoothedControls,
  ArToolkitContext,
} from "@ar-js-org/ar.js/three.js/build/ar-threex.js";
import { fetchModelNames } from "src/utils/three";
import {
  AxesHelper,
  Group,
  Mesh,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createAr } from "./components/ar";
import { createCamera } from "./components/camera";
import { createControls } from "./components/controls";
import { createCube } from "./components/cube";
import { createLights } from "./components/lights";
import loadModel from "./components/models/model";
import { createOrbitControls } from "./components/orbitControls";
import { createShadowCatcher } from "./components/shadowCatcher";
import Loop from "./system/Loop";
import { createRenderer } from "./system/renderer";

export class World {
  orbitControls?: OrbitControls;
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  loop: Loop;
  webcamElement?: HTMLVideoElement;
  arToolkitContext: typeof ArToolkitContext;
  arMarkerControls: typeof ArMarkerControls;
  smoothedControls: typeof ArSmoothedControls;
  markerGroup?: Group;
  modelGroup: Group;
  createControls: (object: Object3D) => void;
  glbModelNames: string[] = [];

  constructor(
    canvasRef: HTMLCanvasElement,
    arMode: boolean = true,
    controls?: (object: Object3D) => void
  ) {
    this.renderer = createRenderer(canvasRef);
    this.camera = createCamera();
    this.scene = new Scene();
    this.loop = new Loop(this.camera, this.scene, this.renderer);

    const {
      ambientLight,
      directionalLightHelper,
      directionalLight,
      rectLight,
    } = createLights();

    this.modelGroup = new Group();
    const floorMesh = createShadowCatcher();
    this.createControls = controls ? controls : createControls;

    this.loadCube();

    if (arMode) {
      const { markerGroup, arToolkitContext, smoothedControls } = createAr(
        this.camera
      );
      this.arToolkitContext = arToolkitContext;
      this.markerGroup = markerGroup;
      this.scene.add(markerGroup);
      this.markerGroup.add(
        floorMesh,
        ambientLight,
        rectLight,
        directionalLight,
        directionalLight.target,
        this.modelGroup
      );
      this.smoothedControls = smoothedControls;
    } else {
      const axesHelper = new AxesHelper();
      this.scene.add(
        floorMesh,
        ambientLight,
        axesHelper,
        this.modelGroup,
        rectLight,
        directionalLight,
        directionalLight.target,
        directionalLightHelper
      );
      const controls = createOrbitControls(this.camera, canvasRef);
      controls.target.copy(this.modelGroup.position);
      controls.enableDamping = true;
      this.loop.renderFunctions.push(() => controls.update());
    }
  }

  setWebcamStream = (webcamStream: MediaStream) => {
    console.log("Webcam set");
    this.webcamElement = document.createElement("video");
    this.webcamElement.autoplay = true;
    this.webcamElement.playsInline = true;
    this.webcamElement.muted = true;
    this.webcamElement.srcObject = webcamStream;
    this.webcamElement.oncanplaythrough = () => {
      this.webcamElement?.play().catch((e) => {
        console.log(e);
      });
    };

    this.loop.renderFunctions.push(() => {
      try {
        this.arToolkitContext.update(this.webcamElement!);
        this.smoothedControls.update(this.markerGroup);
      } catch (error) {
        console.log(error);
      }
    });
  };

  init = async () => {
    this.glbModelNames = (await fetchModelNames()) as string[];
  };

  // Load a default Cube
  loadCube = () => {
    const { cubeMesh, cubeRenderFxn } = createCube();
    this.createControls(cubeMesh);
    this.modelGroup.remove(this.modelGroup.children[0]);
    this.modelGroup.add(cubeMesh);
    this.loop.renderFunctions.push(cubeRenderFxn);
  };

  // Load model by specifying URI and name
  loadModel = async (uri: string, modelName: string) => {
    const { model, modelRenderFxn } = await loadModel(uri);
    if (!model) {
      throw Error("Failed to Load Model!");
    }
    model.name = modelName; // Set the model's name for easier removal
    this.createControls(model);
    this.modelGroup.remove(this.modelGroup.children[0]);
    this.modelGroup.add(model);
    this.loop.renderFunctions.push(modelRenderFxn);
  };

  // Remove a model by its name
  removeModel = (modelName: string) => {
    const model = this.modelGroup.getObjectByName(modelName);
    if (model && model instanceof Mesh) {
      this.modelGroup.remove(model); // Remove model from the group
      model.geometry.dispose(); // Clean up geometry to free memory
      if (Array.isArray(model.material)) {
        model.material.forEach((material) => material.dispose()); // Dispose multiple materials
      } else {
        model.material.dispose(); // Dispose single material
      }
      console.log(`Model ${modelName} removed`);
    } else {
      console.warn(`Model ${modelName} not found in the scene or is not a Mesh`);
    }
  };

  loadGithubGLBModels = async (name: string) => {
    console.log(name);
    const uri = `https://cors-anywhere.herokuapp.com/https://github.com/mrdoob/three.js/raw/dev/examples/models/gltf/${name}.glb`;
    await this.loadModel(uri, name);
  };

  render = () => {
    this.renderer.render(this.scene, this.camera);
  };

  start = () => {
    this.loop.start();
  };

  stop = () => {
    this.loop.stop();
  };
}
