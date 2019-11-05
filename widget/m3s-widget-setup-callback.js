window.addEventListener('DOMContentLoaded', function () {
  let script = document.getElementById('m3s-wgl-widget');
  var path = script.src.split('?')[0];      // remove any ?query
  var mydir = path.split('/').slice(0, -1).join('/') + '/';

  insertStyle(mydir + "css/wgl-widget.css");
  insertStyle(mydir + "css/modal.css");

  function isCommonLoaded() { return typeof m3sCommon !== "undefined"; }
  function isBabylonLoaded() { return typeof BABYLON !== "undefined"; }
  function isLoaderAvailable() { return BABYLON.SceneLoader.IsPluginForExtensionAvailable(".glb"); }

  // blocking
  // continue and fix later

  let dependencies = {
    scripts: [
      { script: mydir + "m3s-widget-babylon.js", critical: true },
      { script: mydir + "m3s-common.js", condition: isCommonLoaded, critical: true },
      { script: 'https://cdn.babylonjs.com/babylon.max.js', condition: isBabylonLoaded, critical: true },
      { script: 'https://cdn.babylonjs.com/serializers/babylonjs.serializers.min.js', critical: false },
      { script: 'https://cdn.babylonjs.com/loaders/babylon.glTF2FileLoader.min.js', condition: isLoaderAvailable, critical: false }
    ],
    callback: () => { m3sWidgetBabylon.run(mydir); }
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
          let msg = "%cNon-critical %ctime out on " + dependency.script + " continuing.";
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