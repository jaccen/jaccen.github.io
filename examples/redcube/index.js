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
var CAMERA = "";
var VARIANT = "";
var IBL = true;
var LIGHTS = false; // The default is to use IBL instead of lights
let guiCameras  = null;
let guiVariants = null;
let guiIbl      = null;
let guiLights   = null;

const name = localStorage.getItem('sample') || 'DamagedHelmet';
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let url = "../../" + modelInfo.category + "/" + modelInfo.path;
if(modelInfo.url) {
    url = modelInfo.url;
}

const renderer = new redcube.RedCube(
    url,
    canvas,
    [],
    //'../../textures/hdr/pisa.hdr'
    '../../textures/hdr/papermill.hdr'
);

renderer.init(() => {
    cameras = {};
    renderer.parse.cameras.forEach((it,i) => {
        cameras[it.name] = i;
    });
    variants = {};
    renderer.scene.variants.forEach((it,i) => {
        variants[it.name] = i;
    });
    guiCameras  = gui.add(window, 'CAMERA', cameras).name("Camera");
    guiVariants = gui.add(window, 'VARIANT', variants).name("Variant");
    guiIbl      = gui.add(window, 'IBL').name('IBL');
    guiLights   = gui.add(window, 'LIGHTS').name('Lights');

    guiCameras.onChange(function (value) {
        renderer.ioc._updateDep('camera', renderer.parse.cameras.find((it) => { 
            return Number(value) === cameras[it.name]; 
        }));
        renderer.renderer.needUpdateView = true;
        renderer.draw();
    });

    guiVariants.onChange(function (value) {
        renderer.setVariant(value);
    });

    guiIbl.onChange(function (value) {
        renderer.isIBL = value;
        renderer.draw();
    });

    guiLights.onChange(function (value) {
        renderer.isDefaultLight = value;
        renderer.draw();
    });

    renderer.isIBL = IBL;
    renderer.isDefaultLight = LIGHTS;
    renderer.draw();
});
