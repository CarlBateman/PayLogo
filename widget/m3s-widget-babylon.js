var m3sWidgetBabylon = m3sWidgetBabylon || (function () {
  let scene;
  let bar;

  const download = function () {
    if (typeof BABYLON.GLTF2Export === "undefined") {
      alert("Sorry, the download component can't be found.\nUnable to download!");
      return;
    }
    const modal = document.getElementById("myModal");

    let fileName = document.getElementById("m3s-wgl-filename").value;
    if (fileName === "")
      fileName = "widget";

    m3sCommon.closeModal();

    const options = {
      shouldExportNode: function (node) {
        return node.visibility;
      }
    };

    BABYLON.GLTF2Export.GLBAsync(scene, fileName, options).then((gltf) => {
      gltf.downloadFiles();
    });
  };

  function run(mydir) {
    const canvas = document.getElementById("m3s-wgl-canvas-babylon");

    const radius = [];
    const spin = [];
    const bars = [];
    const flip = [];
    const offset = [];
    const origins = [];
    let material;
    let light;

    const engine = new BABYLON.Engine(canvas, true);

    const createScene = function () {
      scene = new BABYLON.Scene(engine);
      scene.clearColor.a = 0;
      scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

      const camera = new BABYLON.ArcRotateCamera('camera1', -Math.PI / 2, Math.PI / 2, 10, new BABYLON.Vector3(0, 0, 0), scene);
      camera.attachControl(canvas, false);
      camera.wheelDeltaPercentage = 0.01;

      light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-100, 0, -100), scene);
      light.intensity = 1;

      if (BABYLON.SceneLoader.IsPluginForExtensionAvailable(".glb")) {
        BABYLON.SceneLoader.ImportMesh("", "", mydir + "model/bend.glb", scene, function (newMeshes) {
          material = new BABYLON.StandardMaterial("material", scene);
          let rgb = m3sCommon.hslToRgb(0.5, 0.5, 0.5);

          material.diffuseColor = new BABYLON.Color3(rgb[0], rgb[1], rgb[2]);
          material.backFaceCulling = false;

          newMeshes[1].visibility = false;
          bar = newMeshes[1];
          bar.material = material;

          setup();
        }, null, addBar);
      } else {
        addBar();
      }

      function addBar() {
        bar = BABYLON.MeshBuilder.CreateBox("box", { height: 3.35, width:.5, depth:.5 }, scene);
        bar.visibility = false;
        material = new BABYLON.StandardMaterial("material", scene);
        let rgb = m3sCommon.hslToRgb(0.5, 0.5, 0.5);

        material.diffuseColor = new BABYLON.Color3(rgb[0], rgb[1], rgb[2]);
        bar.material = material;

        setup();
      }

      function setup() {
        let numBars = 30;
        let step = 7;

        for (let i = 0; i < numBars; i++) {
          const origin = new BABYLON.Mesh("origin", scene);
          origins.push(origin);

          const offset1 = new BABYLON.Mesh("offset", scene);
          offset1.parent = origin;
          offset.push(offset1);

          const radius1 = new BABYLON.Mesh("radius", scene);
          radius1.setParent(offset1);
          radius.push(radius1);

          const spin1 = new BABYLON.Mesh("spin", scene);
          spin1.setParent(radius1);
          spin.push(spin1);

          const bar1 = new BABYLON.Mesh("bar", scene);
          bar1.setParent(spin1);

          const flip1 = new BABYLON.Mesh("flip", scene);
          flip1.setParent(bar1);
          flip.push(flip1);

          origin.rotation.z = Math.ceil(i/2) * (2 *Math.PI) / step;
          origin.rotation.z += Math.PI / 2;

          offset1.position.x = 2;

          if (i % 2) {
            offset1.rotation.z = Math.PI;
            origin.position.z = -.5;
            spin1.rotation.z = -Math.PI / 2;
          }

          const box = bar.clone();
          box.name = "box" + i;
          box.setParent(flip1);
          bar1.rotate(BABYLON.Axis.Z, Math.PI / 8, BABYLON.Space.WORLD);
          bar1.rotate(BABYLON.Axis.Y, -Math.PI / 3, BABYLON.Space.WORLD);

          if (i < step*2)
            box.visibility = true;

          bars.push(box);
        }
      }
    };

    createScene();

    const numberSlider = document.getElementById("number");
    numberSlider.addEventListener("input", function () {
      let n = numberSlider.value * 2;
      let step = numberSlider.value;
      let i = 0;
      for (; i < origins.length; i++) {
        origins[i].rotation.z = Math.ceil(i / 2) * (2 * Math.PI) / step;
        origins[i].rotation.z += Math.PI / 2;
      }

      for (i = 0; i < n; i++) {
        bars[i].visibility = true;
        origins[i].visibility = true;
        radius[i].visibility = true;
        spin[i].visibility = true;
        bars[i].visibility = true;
        flip[i].visibility = true;
        offset[i].visibility = true;
      }
      for (; i < bars.length; i++) {
        bars[i].visibility = false;
        origins[i].visibility = false;
        radius[i].visibility = false;
        spin[i].visibility = false;
        bars[i].visibility = false;
        flip[i].visibility = false;
        offset[i].visibility = false;
      }
    });

    const hueSlider = document.getElementById("hue");
    hueSlider.addEventListener("input", function () {
      let rgb = m3sCommon.hslToRgb(Number(hueSlider.value), 0.5, 0.5);
      material.diffuseColor.r = rgb[0];
      material.diffuseColor.g = rgb[1];
      material.diffuseColor.b = rgb[2];
    });

    const brightnessSlider = document.getElementById("brightness");
    brightnessSlider.addEventListener("input", function () {
      light.intensity = brightnessSlider.value;
    });


    const radiusSlider = document.getElementById("radius");
    const flipSlider = document.getElementById("flip");
    const spinSlider = document.getElementById("spin");
    const offsetSlider = document.getElementById("offset");

    offsetSlider.addEventListener("input", function () {
      const n = offset.length;
      for (let i = 0; i < n; i++) {
        offset[i].position.x = offsetSlider.value;
      }
    });

    radiusSlider.addEventListener("input", function () {
      const n = radius.length;
      for (let i = 0; i < n; i++) {
        radius[i].position.x = -radiusSlider.value;
      }
    });

    spinSlider.addEventListener("input", function () {
      let i = 0; // here here here
      for (; i < spin.length; i++) {
        if (i % 2)
          spin[i].rotation.z = .5 * spinSlider.value - Math.PI / 2;
        else
          spin[i].rotation.z = spinSlider.value;
      }
    });

    flipSlider.addEventListener("input", function () {
      for (let i = 0; i < flip.length; i++) {
        flip[i].rotation.y = Number(flipSlider.value);
      }
    });


    engine.runRenderLoop(function () {
      scene.render();
    });

    window.addEventListener("resize", function () {
      engine.resize();
    });
  }

  return { run, download };
})();