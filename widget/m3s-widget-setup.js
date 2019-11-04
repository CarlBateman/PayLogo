window.addEventListener('DOMContentLoaded', function () {
  let script = document.getElementById('m3s-wgl-widget');
  var path = script.src.split('?')[0];      // remove any ?query
  var mydir = path.split('/').slice(0, -1).join('/') + '/';

  insertStyle(mydir + "css/wgl-widget.css");
  insertStyle(mydir + "css/modal.css");

  function isCommonLoaded() { return typeof setRandom !== "undefined"; }
  function isBabylonLoaded() { return typeof BABYLON !== "undefined"; }
  function isLoaderAvailable() { return BABYLON.SceneLoader.IsPluginForExtensionAvailable(".glb"); }

  let dependencies = {
    scripts: [
      { script: mydir + "m3s-widget-babylon.js" },
      { script: mydir + "common.js", condition: isCommonLoaded },
      { script: 'https://cdn.babylonjs.com/babylon.max.js', condition: isBabylonLoaded },
      { script: 'https://preview.babylonjs.com/serializers/babylonjs.serializers.min.js' },
      { script: 'https://cdn.babylonjs.com/loaders/babylon.glTF2FileLoader.min.js', condition: isLoaderAvailable }
    ],
    callback: () => { insertHTML(); doWidgetBabylon(mydir); }
  };

  loadDependencies(dependencies);

  function loadDependencies(script) {
    if (dependencies.scripts.length > 0) {
      let dep = dependencies.scripts.shift();

      var s = document.createElement('script');
      s.onload = () => { loadDependencies(dependencies); };
      //s.onerror = () => { console.log("Unable to load: ", s.src); };
      s.setAttribute('src', dep.script);
      document.head.appendChild(s);
    } else {
      dependencies.callback();
    }
  }


  function loadDependenciesXHR(dependencies) {
    if (dependencies.scripts.length > 0) {
      let dep = dependencies.scripts.shift();

      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.open("GET", dep.script,);
      xhr.onreadystatechange = function () {
        //if ((xhr.status === 404)) {
        //  console.log("404", xhr.responseText);
        //};
        if ((xhr.status === 200) && (xhr.readyState === 4)) {
          //insertScriptFromXHR(xhr.response);

          if (typeof dep.condition === "undefined")
            insertScriptFromXHR(xhr.response);
          else
            insertScriptFromXHR(xhr.response);

          //insertScriptFromXHR(xhr.response);

          //if (typeof dep.condition === "undefined")
          //  loadDependencies(dependencies);
          //else
          //  waitFor(dep.condition, () => { loadDependencies(dependencies); });
        }
      };
      xhr.onerror = function () { // only triggers if the request couldn't be made at all
        console.log(`Network Error`);
      };
      xhr.send();
    } else {
      dependencies.callback();
    }
  }

  function insertScriptFromXHR(response) {
    var ss = URL.createObjectURL(response);
    var s = document.createElement('script');
    s.onload = () => { loadDependencies(dependencies); };
    s.setAttribute('src', ss);
    document.head.appendChild(s);
  }

  function insertScript(script) {
    var s = document.createElement('script');
    s.setAttribute('src', script);
    document.head.appendChild(s);
  }




  function loadDependenciesCallback(dependencies) {
    if (dependencies.scripts.length > 0) {
      let dep = dependencies.scripts.shift();
      insertScript(dep.script);
      if (typeof dep.condition === "undefined") 
        loadDependenciesCallback(dependencies);
      else
        waitFor(dep.condition, () => { loadDependenciesCallback(dependencies); });
    } else {
      dependencies.callback();
    }
  }

  function waitFor(condition, callback) {
    let guard = Date.now() + 10000;

    function wait() {
      if (Date.now() > guard) {
        console.log("time out");
        return;
      }
      setTimeout(function () {
        if (condition())
          callback();
        else
          wait(condition, callback);
      }, 10);
    }

    wait();
  }

  function insertStyle(style) {
    var s = document.createElement('link');
    s.setAttribute('href', style);
    s.setAttribute('rel', "stylesheet");
    document.head.appendChild(s);
  }
});