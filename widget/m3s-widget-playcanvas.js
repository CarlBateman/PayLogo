var m3sWidgetPlaycanvas = m3sWidgetPlaycanvas || (function () {
  let scene;
  let bar;

  const download = function () {
      alert("Sorry, PlayCanvas doesn't support download.\nUnable to download!");
  };

  function toDeg(radians) {
    return radians * 180 / Math.PI;
  }

  function run(mydir) {
    const canvas = document.getElementById("m3s-wgl-canvas-three");

    const radius = [];
    const spin = [];
    const bars = [];
    const flip = [];
    const offset = [];
    const origins = [];
    let material;
    let light;

    const createScene = function () {
      // create a PlayCanvas application
      var canvas = document.getElementById('m3s-wgl-canvas-playcanvas');
      var app = new pc.Application(canvas, {
        mouse: new pc.Mouse(canvas),
      });
      app.start();

      // fill the available space at full resolution
      app.setCanvasFillMode(pc.FILLMODE_NONE);
      app.setCanvasResolution(pc.RESOLUTION_AUTO);

      // ensure canvas is resized when window changes size
      window.addEventListener('resize', function () {
        app.resizeCanvas();
      });



      // create camera entity
      var camera = new pc.Entity('camera');
      camera.addComponent('camera', {
        clearColor: new pc.Color(0.1, 0.1, 0.1, 0.0)
      });

      app.assets.loadFromUrl('libs/mouse-input.js', 'script', function (err, asset) {
        camera.addComponent('script');
        camera.script.create('mouseInput');

        app.assets.loadFromUrl('libs/orbit-camera.js', 'script', function (err, asset) {
          camera.script.create('orbitCamera');
          camera.script.orbitCamera.frameOnStart = false;
          camera.setLocalPosition(0, 0, 10);
          app.root.addChild(camera);
        });
      });

      app.assets.loadFromUrl(mydir + 'model/bend.glb', 'binary', function (err, asset) {
        var glb = asset.resource;
        loadGlb(glb, app.graphicsDevice, function (err, res) {
          // Wrap the model as an asset and add to the asset registry
          var asset = new pc.Asset('gltf', 'model', {
            url: ''
          });
          asset.resource = res.model;
          asset.loaded = true;
          app.assets.add(asset);

          let rgb = m3sCommon.hslToRgb(0.5, 0.5, 0.5);
          // Add the loaded scene to the hierarchy
          let gltf = new pc.Entity('gltf');
          gltf.addComponent('model', {
            asset: asset
          });

          material = new pc.StandardMaterial();
          material.diffuse.set(rgb[0], rgb[1], rgb[2]);
          gltf.model.model.meshInstances[0].material = material;

          app.root.addChild(gltf);
          gltf.enabled = false;
          bar = gltf;

          setup();
        });
      });

      // create directional light entity
      light = new pc.Entity('light');
      light.addComponent('light');

      // add to hierarchy
      //app.root.addChild(cube);
      app.root.addChild(light);

      // set up initial positions and orientations
      camera.setPosition(0, 0, 3);
      light.setEulerAngles(45, 0, 0);

      // register a global update event
      //app.on('update', function (deltaTime) {
      //  cube.rotate(10 * deltaTime, 20 * deltaTime, 30 * deltaTime);
      //});

      function addBar() {
        let rgb = m3sCommon.hslToRgb(0.5, 0.5, 0.5);
        var material = new pc.StandardMaterial();
        material.diffuse.set(rgb[0], rgb[1], rgb[2]);
        material.update();

        // create box entity
        var bar = new pc.Entity('cube');
        bar.addComponent('model', {
          type: 'box'
        });
        bar.setLocalScale(0.5, 3.5, 0.5);
        //bar.enabled = false;
        bar.model.material = material;
        bar.model.material.update();

        app.root.addChild(bar);
        //setup();
      }

      function setup() {
        let numBars = 30;
        let step = 7;

        for (let i = 0; i < numBars; i++) {
          const origin = new pc.Entity();
          app.root.addChild(origin);
          origins.push(origin);

          const offset1 = new pc.Entity();
          origin.addChild(offset1);
          offset.push(offset1);

          const radius1 = new pc.Entity();
          offset1.addChild(radius1);
          radius.push(radius1);

          const spin1 = new pc.Entity();
          radius1.addChild(spin1);
          spin.push(spin1);

          const bar1 = new pc.Entity();
          spin1.addChild(bar1);

          const flip1 = new pc.Entity();
          bar1.addChild(flip1);
          flip.push(flip1);

          let r = Math.ceil(i / 2) * (360) / step;
          r += 90;
          origin.setLocalEulerAngles(0, 0, r);

          offset1.setLocalPosition(2, 0, 0);

          if (i % 2) {
            offset1.setLocalEulerAngles(0, 0, -180);
            origin.setPosition(0, 0, .5);
            spin1.setLocalEulerAngles(0, 0, -toDeg(Math.PI / 2));
          }

          const box = bar.clone();
          box.name = "box" + i;
          flip1.addChild(box);

          var q1 = new pc.Quat();
          var q2 = new pc.Quat();
          q1.setFromEulerAngles(0, 0, -180 / 8);
          q2.setFromEulerAngles(0, -2 * 180 / 3, 0);
          q2.mul(q1);
          bar1.setLocalRotation(q2);

          if (i < step * 2)
            box.enabled = true;

          bars.push(box);
        }

      }

      const numberSlider = document.getElementById("number");
      numberSlider.addEventListener("input", function () {
        let n = numberSlider.value * 2;
        let step = numberSlider.value;
        let i = 0;
        for (; i < origins.length; i++) {
          let r = Math.ceil(i / 2) * (360) / step;
          r += 45 / 2;
          origins[i].setLocalEulerAngles(0, 0, r);
        }

        for (i = 0; i < n; i++) {
          bars[i].enabled = true;
          origins[i].enabled = true;
          radius[i].enabled = true;
          spin[i].enabled = true;
          bars[i].enabled = true;
          flip[i].enabled = true;
          offset[i].enabled = true;
        }
        for (; i < bars.length; i++) {
          bars[i].enabled = false;
          origins[i].enabled = false;
          radius[i].enabled = false;
          spin[i].enabled = false;
          bars[i].enabled = false;
          flip[i].enabled = false;
          offset[i].enabled = false;
        }
      });



      const hueSlider = document.getElementById("hue");
      hueSlider.addEventListener("input", function () {
        let rgb = m3sCommon.hslToRgb(Number(hueSlider.value), 0.5, 0.5);
        material.diffuse.set(rgb[0], rgb[1], rgb[2]);
        material.update();
      });

      const brightnessSlider = document.getElementById("brightness");
      brightnessSlider.addEventListener("input", function () {
        light.light.intensity = brightnessSlider.value;
      });


      const radiusSlider = document.getElementById("radius");
      const flipSlider = document.getElementById("flip");
      const spinSlider = document.getElementById("spin");
      const offsetSlider = document.getElementById("offset");

      offsetSlider.addEventListener("input", function () {
        const n = radius.length;
        for (let i = 0; i < n; i++) {
          offset[i].setLocalPosition(offsetSlider.value, 0, 0);
        }
      });

      radiusSlider.addEventListener("input", function () {
        const n = radius.length;
        for (let i = 0; i < n; i++) {
          radius[i].setLocalPosition( -radiusSlider.value, 0, 0);
        }
      });

      spinSlider.addEventListener("input", function () {
        let r = toDeg(spinSlider.value);
        for (let i = 0; i < spin.length; i++) {
          if (i % 2)
            spin[i].setLocalEulerAngles(0, 0, .5 * r - 90);
          else
            spin[i].setLocalEulerAngles(0, 0, r);
        }
      });

      flipSlider.addEventListener("input", function () {
        let r = 180 * Number(flipSlider.value) / Math.PI;
        for (let i = 0; i < flip.length; i++) {
          flip[i].setLocalEulerAngles(0, r, 0);
        }
      });

    };

    createScene();

  }

  return { run, download };
})();