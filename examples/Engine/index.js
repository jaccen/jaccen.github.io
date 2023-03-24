let modelInfo = ModelIndex.getCurrentModel();
if (!modelInfo) {
    modelInfo = TutorialModelIndex.getCurrentModel();
}
if (!modelInfo) {
    modelInfo = TutorialPbrModelIndex.getCurrentModel();
}
if (!modelInfo) {
    modelInfo = TutorialFurtherPbrModelIndex.getCurrentModel();
}
if (!modelInfo) {
    modelInfo = TutorialFeatureTestModelIndex.getCurrentModel();
}
if (!modelInfo) {
    modelInfo = TutorialExtensionTestModelIndex.getCurrentModel();
}
if (!modelInfo) {
    modelInfo = TutorialWipExtensionTestModelIndex.getCurrentModel();
}
if (!modelInfo) {
    document.getElementById('container').innerHTML = 'Please specify a model to load';
    throw new Error('Model not specified or not found in list.');
}

// GUI
let gui = new dat.GUI();
const DEFAULT_STRING = "[default]";
var ROTATE = false;
var CAMERA = DEFAULT_STRING;
var SKYBOX = true;
var LIGHTS = false;
var IBL = true;
var aperture = 16.0;
var shutterSpeed = 125.0;
var ISO = 100.0;
var VARIANT = DEFAULT_STRING;
let guiRotate = gui.add(window, 'ROTATE').name('Rotate');
let guiSkybox = gui.add(window, 'SKYBOX').name('Skybox');
let guiLights = gui.add(window, 'LIGHTS').name('Lights');
let guiIBL    = gui.add(window, 'IBL').name('IBL');
let guiCameraFolder = gui.addFolder('Camera');
let guiAperture     = guiCameraFolder.add(window, 'aperture',     1,   32, 0.1).name('Aperture');
let guiShutterSpeed = guiCameraFolder.add(window, 'shutterSpeed', 1, 1000, 0.1).name('Speed (1/s)');
let guiISO          = guiCameraFolder.add(window, 'ISO',         24, 6400, 0.1).name('ISO');
let guiCameras = null;
guiCameraFolder.open();
let guiVariants = null;

const env = 'papermill';
const ibl_url = `../../textures/ktx/${env}/${env}_ibl.ktx`;
const sky_url = `../../textures/ktx/${env}/${env}_skybox.ktx`;
let mesh_url = "../../" + modelInfo.category + "/" + modelInfo.path;
if(modelInfo.url) {
    mesh_url = modelInfo.url;
}
let basePath = convertRelativeToAbsUrl(getPathNameFromUrl(mesh_url)) + "/";
let scale = modelInfo.scale;

function getPathNameFromUrl(path) {
    let result = path.replace(/\\/g, '/').replace(/\/[^/]*$/, '');
    if (result.match(/^[^/]*\.[^/\.]*$/)) {
        result = '';
    }
    return result;
}

function convertRelativeToAbsUrl(relativePath) {
    let anchor = document.createElement("a");
    anchor.href = relativePath;
    return anchor.href;
}

Filament.init([mesh_url, ibl_url, sky_url], () => {
    window.gltfio = Filament.gltfio;
    window.Fov = Filament.Camera$Fov;
    window.LightType = Filament.LightManager$Type;
    window.ToneMapping = Filament.ColorGrading$ToneMapping;
    window.app = new App(document.getElementsByTagName('canvas')[0]);

    app.camera.setExposure(aperture, 1/shutterSpeed, ISO);
    guiAperture.onChange(function (value) {
        aperture = value;
        updateExposure();
    });
    guiShutterSpeed.onChange(function (value) {
        shutterSpeed = value;
        updateExposure();
    });
    guiISO.onChange(function (value) {
        ISO = value;
        updateExposure();
    });

    function updateExposure() {
        app.camera.setExposure(aperture, 1/shutterSpeed, ISO);
    }

    guiLights.onChange(function (value) {
        if ( value ) {
            const sunlight = Filament.EntityManager.get().create();
            Filament.LightManager.Builder(LightType.SUN)
                .color([0.98, 0.92, 0.89])
                .intensity(50000.0)
                .direction([0.6, -1.0, -0.8])
                .sunAngularRadius(1.9)
                .sunHaloSize(10.0)
                .sunHaloFalloff(80.0)
                .build(app.engine, sunlight);
            app.sunlight = sunlight;
            app.scene.addEntity(sunlight);
        } else {
            app.scene.remove(app.sunlight);
        }
    });

    guiIBL.onChange(function (value) {
        if ( value ) {
            const indirectLight = app.ibl = app.engine.createIblFromKtx1(ibl_url);
            app.scene.setIndirectLight(indirectLight);
            indirectLight.setIntensity(50000);
        } else {
            const indirectLight = app.ibl = app.engine.createIblFromKtx1(ibl_url);
            app.scene.setIndirectLight(null);
        }
    });

    guiSkybox.onChange(function (value) {
        if ( value ) {
            const skybox = app.engine.createSkyFromKtx1(sky_url);
            app.scene.setSkybox(skybox);
        } else {
            app.scene.setSkybox(null);
        }
    });

});

class App {
    constructor(canvas) {
        this.canvas = canvas;
        const engine = this.engine = Filament.Engine.create(this.canvas);
        const scene = this.scene = engine.createScene();
        //this.trackball = new Trackball(canvas, {startSpin: 0.006});
        this.trackball = new Trackball(canvas, {startSpin: 0.000});

        if ( LIGHTS ) {
            const sunlight = this.sunlight = Filament.EntityManager.get().create();
            Filament.LightManager.Builder(LightType.SUN)
                .color([0.98, 0.92, 0.89])
                .intensity(50000.0)
                .direction([0.6, -1.0, -0.8])
                .sunAngularRadius(1.9)
                .sunHaloSize(10.0)
                .sunHaloFalloff(80.0)
                .build(engine, sunlight);
            this.scene.addEntity(sunlight);
        }

        // Added tone mapping support
        // See: https://github.com/google/filament/issues/3337#issuecomment-744058326
        const colorGrading = Filament.ColorGrading.Builder()
            .toneMapping(ToneMapping.LINEAR)
            .build(engine);
 
        const indirectLight = this.ibl = engine.createIblFromKtx1(ibl_url);
        this.scene.setIndirectLight(indirectLight);
        indirectLight.setIntensity(50000);

        const skybox = engine.createSkyFromKtx1(sky_url);
        this.scene.setSkybox(skybox);

        const loader = engine.createAssetLoader();
        this.asset= loader.createAsset(mesh_url);
        const asset = this.asset;
        this.instance = this.asset.getInstance();
        const instance = this.instance;
        const messages = document.getElementById('messages');

        // Crudely indicate progress by printing the URI of each resource as it is loaded.
        const onFetched = (uri) => messages.innerText += `Downloaded ${uri}\n`;
        const onDone = () => {
            // Destroy the asset loader.
            loader.delete();
            
            // Enable shadows on every renderable.
            const entities = asset.getEntities();
            const rm = engine.getRenderableManager();
            for (const entity of entities) {
                const instance = rm.getInstance(entity);
                rm.setCastShadows(instance, true);
                instance.delete();
            }

            const cameras = asset.getCameraEntities();
            if (cameras.length > 0) {
                let cameraNames = [];
                for (let i = 0; i < cameras.length; i++) {
                    cameraNames.push("camera" + i);
                }
                cameraNames.push(DEFAULT_STRING);
                let index = 0;
                guiCameras = guiCameraFolder.add(window, 'CAMERA', cameraNames).name('Cameras');
                guiCameras.onChange(function(value) {
                    index = cameraNames.indexOf(value);
                    if (index < cameras.length) {
                        const c = engine.getCameraComponent(cameras[index]);
                        const aspect = window.innerWidth / window.innerHeight;
                        c.setScaling([1 / aspect, 1]); // Please refer to filament#3615 for API specification changes.
                        app.view.setCamera(c);
                    } else {
                        app.camera = engine.createCamera(Filament.EntityManager.get().create());
                        app.view.setCamera(app.camera);
                        app.resize();
                    }
                });
            }

            const variantNames = instance.getMaterialVariantNames();
            if (variantNames.length > 0) {
                variantNames.push(DEFAULT_STRING);
                guiVariants = gui.add(window, 'VARIANT', variantNames).name("Variants");
                guiVariants.onChange(function(value) {
                    const selectedIndex = value == DEFAULT_STRING ? 0 : variantNames.indexOf(value);
                    instance.applyMaterialVariant(selectedIndex);
                });
            }

            const lights = asset.getLightEntities();
            for (let i = 0; i < lights.length; i++) {
                this.scene.addEntity(lights[i]);
            }

            messages.remove();
            this.animator = instance.getAnimator();
            this.animationStartTime = Date.now();
        };
        asset.loadResources(onDone, onFetched, basePath);

        this.swapChain = engine.createSwapChain();
        this.renderer = engine.createRenderer();
        this.camera = engine.createCamera(Filament.EntityManager.get().create());
        this.view = engine.createView();
        this.view.setCamera(this.camera);
        this.view.setScene(this.scene);
        this.view.setColorGrading(colorGrading);
        this.renderer.setClearOptions({clearColor: [0.6, 0.6, 0.6, 1.0], clear: true});
        this.resize();
        this.render = this.render.bind(this);
        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);
        window.requestAnimationFrame(this.render);
    }

    render() {
        const tcm = this.engine.getTransformManager();
        const inst = tcm.getInstance(this.asset.getRoot());
        let m = mat4.create();
        let s = vec3.create();
        let t = vec3.create();
        vec3.set(s, scale, scale, scale);
        mat4.scale(m, m, s);
        tcm.setTransform(inst, m);
        inst.delete();

        // Add renderable entities to the scene as they become ready.
        let entity;
        const popRenderable = () => {
            entity = this.asset.popRenderable();
            return entity.getId() != 0;
        }
        while (popRenderable()) {
            this.scene.addEntity(entity);
        }

        if (this.animator) {
            const ms = Date.now() - this.animationStartTime;
            for (let i = 0; i < this.instance.getAnimator().getAnimationCount(); i++ ) {
                this.animator.applyAnimation(i, ms / 1000);
                this.animator.updateBoneMatrices();
            }
        }
        
        // TODO: Camera and auto-rotation control needs improvement
        if ( ROTATE ) {
            const eye = [0, 0, 3];
            const center = [0, 0, 0];
            const up = [0, 1, 0];
            const radians = Date.now() / 10000;
            vec3.rotateY(eye, eye, center, radians);
            vec3.transformMat4(eye, eye, this.trackball.getMatrix());
            this.camera.lookAt(eye, center, up);
        } else {
            const eye = [0, 0, 3];
            const center = [0, 0, 0];
            const up = [0, 1, 0];
            vec3.transformMat4(eye, eye, this.trackball.getMatrix());
            this.camera.lookAt(eye, center, up);
        }
        this.renderer.render(this.swapChain, this.view);
        window.requestAnimationFrame(this.render);
    }

    resize() {
        const dpr = window.devicePixelRatio;
        const width = this.canvas.width = window.innerWidth * dpr;
        const height = this.canvas.height = window.innerHeight * dpr;
        this.view.setViewport([0, 0, width, height]);
        const eye = [0, 2, 3];
        const center = [0, 0, 0];
        const up = [0, 1, 0];
        this.camera.lookAt(eye, center, up);
        const aspect = width / height;
        const fov = aspect < 1 ? Fov.HORIZONTAL : Fov.VERTICAL;
        this.camera.setProjectionFov(75, aspect, 0.01, 10000.0, fov);
    }
}
