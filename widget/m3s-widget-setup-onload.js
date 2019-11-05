window.addEventListener('DOMContentLoaded', function () {
  let script = document.getElementById('m3s-wgl-widget');
  var path = script.src.split('?')[0];      // remove any ?query
  var mydir = path.split('/').slice(0, -1).join('/') + '/';

  insertStyle(mydir + "css/wgl-widget.css");
  insertStyle(mydir + "css/modal.css");

  let dependencies = {
    scripts: [
      mydir + "m3s-widget-babylon.js",
      mydir + "m3s-common.js",
      'https://cdn.babylonjs.com/babylon.max.js',
      'https://cdn.babylonjs.com/serializers/babylonjs.serializers.min.js',
      'https://cdn.babylonjs.com/loaders/babylon.glTF2FileLoader.min.js'
    ],
    callback: () => { m3sWidgetBabylon.run(mydir); }
  };

  (function loadDependencies(dependencies) {
    if (dependencies.scripts.length > 0) {
      let script = dependencies.scripts.shift();

      var s = document.createElement('script');
      s.onload = () => { loadDependencies(dependencies); };
      s.onerror = () => { console.log("Unable to load: ", s.src); };
      s.src = script;
      document.head.appendChild(s);
    } else {
      dependencies.callback();
    }
  })(dependencies);

  function insertStyle(style) {
    var s = document.createElement('link');
    s.setAttribute('href', style);
    s.setAttribute('rel', "stylesheet");
    document.head.appendChild(s);
  }
});