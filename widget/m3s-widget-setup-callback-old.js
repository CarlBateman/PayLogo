window.addEventListener('DOMContentLoaded', function () {
  let script = document.getElementById('m3s-wgl-widget');
  var path = script.src.split('?')[0];      // remove any ?query
  var mydir = path.split('/').slice(0, -1).join('/') + '/';

  insertStyle(mydir + "css/wgl-widget.css");
  insertStyle(mydir + "css/modal.css");

  insertScript(mydir + "m3s-widget-babylon.js");

  loadCommon();

  function waitFor(condition, callback) {
    setTimeout(function () {
      if (condition())
        callback();
      else
        waitFor(condition, callback);
    }, 10);
  }

  function insertScript(script) {
    var s = document.createElement('script');
    s.setAttribute('src', script);
    document.head.appendChild(s);
  }

  function loadCommon() {
    function isCommonLoaded() { return typeof setRandom !== "undefined"; }

    insertScript(mydir + "m3s-common.js");

    waitFor(isCommonLoaded, () => { insertHTML(); loadBabylon(); });
  }

  function loadBabylon() {
    function isBabylonLoaded() { return typeof BABYLON !== "undefined"; }

    insertScript('https://cdn.babylonjs.com/babylon.max.js');

    waitFor(isBabylonLoaded, loadExtensions);
  }

  function loadExtensions() {
    function isLoaderAvailable() { return BABYLON.SceneLoader.IsPluginForExtensionAvailable(".glb"); }

    insertScript('https://preview.babylonjs.com/serializers/babylonjs.serializers.min.js');

    insertScript('https://cdn.babylonjs.com/loaders/babylon.glTF2FileLoader.min.js');

    waitFor(isLoaderAvailable, () => { m3sWidgetBabylon.run(mydir);});
  }

  function insertStyle(style) {
    var s = document.createElement('link');
    s.setAttribute('href', style);
    s.setAttribute('rel', "stylesheet");
    document.head.appendChild(s);
  }

});