window.addEventListener('DOMContentLoaded', function () {
  let script = document.getElementById('m3s-wgl-widget');
  var path = script.src.split('?')[0];      // remove any ?query
  var mydir = path.split('/').slice(0, -1).join('/') + '/';

  insertStyle(mydir + "css/wgl-widget.css");
  insertStyle(mydir + "css/modal.css");

  function isCommonLoaded() { return typeof m3sCommon !== "undefined"; }

  function isPlayCanvasLoaded() { return typeof pc !== "undefined"; }
  function isPlayCanvasLoaderAvailable() { return typeof loadGlb !== "undefined"; }

  function isBabylonLoaded() { return typeof BABYLON !== "undefined"; }
  function isLoaderAvailable() { return BABYLON.SceneLoader.IsPluginForExtensionAvailable(".glb"); }

  function isThreeLoaded() { return typeof THREE !== "undefined"; }
  function isGLTFLoaderAvailable() { return typeof THREE.GLTFLoader !== "undefined"; }
  function isOrbitControlAvailable() { return typeof THREE.OrbitControls !== "undefined"; }

  let dependencies = {
    scripts: [
      { script: mydir + "m3s-widget-playcanvas.js", critical: true },
      { script: mydir + "m3s-widget-babylon.js", critical: true },
      { script: mydir + "m3s-widget-three.js", critical: true },
      { script: mydir + "m3s-common.js", condition: isCommonLoaded, critical: true },
      { script: mydir + "m3s-widget-controller.js", critical: true },

      { script: 'https://code.playcanvas.com/playcanvas-stable.js', condition: isPlayCanvasLoaded, critical: true },
      { script: mydir + 'libs/playcanvas-gltf.js', condition: isPlayCanvasLoaderAvailable, critical: true },

      { script: 'https://cdn.babylonjs.com/babylon.max.js', condition: isBabylonLoaded, critical: true },
      { script: 'https://cdn.babylonjs.com/serializers/babylonjs.serializers.min.js', critical: false },
      { script: 'https://cdn.babylonjs.com/loaders/babylon.glTF2FileLoader.min.js', condition: isLoaderAvailable, critical: false },

      { script: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r110/build/three.js', condition: isThreeLoaded, critical: true },
      { script: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r110/examples/js/loaders/GLTFLoader.js', condition: isGLTFLoaderAvailable, critical: false },
      { script: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r110/examples/js/exporters/GLTFExporter.js', critical: false },
      { script: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r110/examples/js/controls/OrbitControls.js', condition: isOrbitControlAvailable },
    ],
    callback: () => { m3sWidgetController.run(mydir); }
  };

  (function loadDependencies(dependencies) {
    if (dependencies.scripts.length > 0) {
      let dependency = dependencies.scripts.shift();

      insertScript(dependency.script);

      if (typeof dependency.condition === "undefined") 
        loadDependencies(dependencies);
      else
        waitFor(dependency, () => { loadDependencies(dependencies); });
    } else {
      dependencies.callback();
    }
  })(dependencies);

  function waitFor(dependency, callback) {
    let guard = Date.now() + 5000;

    function wait() {
      if (Date.now() > guard) {
        if (dependency.critical) {
          let msg = "Critical time out on " + dependency.script + " unable to proceed.";
          console.error(msg);
        } else {
          let msg = "%cWARNING! %cNon-critical time out on " + dependency.script + " continuing.";
          console.log(msg, "color: red; font-weight: bold;", "color: darkblue;" );
          callback();
        }
        return;
      }
      setTimeout(function () {
        if (dependency.condition())
          callback();
        else
          wait(dependency.condition, callback);
      }, 10);
    }

    wait();
  }

  function insertScript(script) {
    var s = document.createElement('script');
    //console.log("Loading: ", script);
    //s.onload = () => { console.log("Loaded: ", s.src); };
    s.crossOrigin = "anonymous";
    //debugger;
    s.onerror = () => { console.error("Unable to load: ", s.src); };
    s.src = script;
    document.head.appendChild(s);
  }

  function insertStyle(style) {
    var s = document.createElement('link');
    s.setAttribute('href', style);
    s.setAttribute('rel', "stylesheet");
    document.head.appendChild(s);
  }
});