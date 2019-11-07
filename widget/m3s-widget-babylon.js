var m3sWidgetBabylon = m3sWidgetBabylon || (function () {
  let scene;
  let bar;

  const download = function () {
    if (typeof BABYLON.GLTF2Export === "undefined") {
      alert("Sorry, the download component can't be found.\nUnable to donwload!");
      return;
    }
    const modal = document.getElementById("myModal");

    let fileName = document.getElementById("m3s-wgl-filename").value;
    if (fileName === "")
      fileName = "widget";

    m3sCommon.closeModal();

    const options = {
      shouldExportNode: function (node) {
        return node !== bar;
      }
    };

    BABYLON.GLTF2Export.GLTFAsync(scene, fileName, options).then((gltf) => {
      gltf.downloadFiles();
    });
  };

  function run(mydir) {
    m3sCommon.insertHTML();
    const canvas = document.getElementById("m3s-wgl-renderCanvas");
    const engine = new BABYLON.Engine(canvas, true);
    const radius = [];
    const spin = [];
    const bars = [];
    const flip = [];
    const offset = [];
    let material;
    let light1;

    const createScene = function () {
      scene = new BABYLON.Scene(engine);
      scene.clearColor.a = 0;

      if (BABYLON.SceneLoader.IsPluginForExtensionAvailable(".glb")) {
        BABYLON.SceneLoader.ImportMesh("", "", mydir + "model/bend.glb", scene, function (newMeshes) {
          material = new BABYLON.StandardMaterial("material", scene);
          material.diffuseColor = new BABYLON.Color3(1, 0, 1);
          material.backFaceCulling = false;

          newMeshes[1].visibility = false;
          bar = newMeshes[1];
          bar.material = material;

          //bar2 = BABYLON.MeshBuilder.CreateBox("box", { height: 3.35, width: .5, depth: .5 }, scene);
          //bar2.parent = bar;
          //bar2.rotation.x = Math.PI / 2;

          setup();
        }, null, addBar);
      } else {
        addBar();
      }


      function addBar() {
        bar = BABYLON.MeshBuilder.CreateBox("box", { height: 3.35, width:.5, depth:.5 }, scene);
        bar.visibility = false;
        material = new BABYLON.StandardMaterial("material", scene);
        material.diffuseColor = new BABYLON.Color3(1, 0, 1);
        bar.material = material;

        setup();
      }

      const camera = new BABYLON.ArcRotateCamera('camera1', -Math.PI / 2, Math.PI / 2, 10, new BABYLON.Vector3(0, 0, 0), scene);
      camera.attachControl(canvas, false);

      light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-100, 0, -100), scene);
      light1.intensity = 1;

      function setup() {
        for (let i = 0; i < 15; i++) {
          const origin = new BABYLON.Mesh("origin", scene);

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
          bars.push(bar1);

          const flip1 = new BABYLON.Mesh("flip", scene);
          flip1.setParent(bar1);
          flip.push(flip1);

          origin.rotation.z = i * (2 * Math.PI) / 7;
          origin.rotation.z += Math.PI / 2;

          offset1.position.x = 2;

          radius1.position.x = 0;

          if (i > 7) {
            offset1.rotation.z = Math.PI;
            origin.position.z = -.5;
            spin1.rotation.z = - Math.PI / 2;
          }

          const box = bar.clone();
          box.setParent(flip1);
          bar1.rotate(BABYLON.Axis.Z, Math.PI / 8, BABYLON.Space.WORLD);
          bar1.rotate(BABYLON.Axis.Y, -Math.PI / 3, BABYLON.Space.WORLD);

          box.visibility = true;
          box.name = "bar";
          bars.push(box);
        }
      }
    };

    createScene();

    const hueSlider = document.getElementById("hue");
    hueSlider.oninput = function () {
      let rgb = m3sCommon.hslToRgb(Number(hueSlider.value), 0.5, 0.5);
      material.diffuseColor.r = rgb[0];
      material.diffuseColor.g = rgb[1];
      material.diffuseColor.b = rgb[2];
    };

    const brightnessSlider = document.getElementById("brightness");
    brightnessSlider.oninput = function () {
      light1.intensity = brightnessSlider.value;
    };


    const radiusSlider = document.getElementById("radius");
    const flipSlider = document.getElementById("flip");
    const spinSlider = document.getElementById("spin");
    const offsetSlider = document.getElementById("offset");

    offsetSlider.oninput = function () {
      const n = offset.length;
      for (let i = 0; i < n; i++) {
        offset[i].position.x = offsetSlider.value;
      }
    };

    radiusSlider.oninput = function () {
      const n = radius.length;
      for (let i = 0; i < n; i++) {
        radius[i].position.x = -radiusSlider.value;
      }
    };

    spinSlider.oninput = function () {
      let i = 0;
      for (; i < spin.length / 2; i++) {
        spin[i].rotation.z = spinSlider.value;
      }
      for (; i < spin.length; i++) {
        spin[i].rotation.z = .5 * spinSlider.value - Math.PI / 2;
      }
    };

    flipSlider.oninput = function () {
      for (let i = 0; i < flip.length; i++) {
        flip[i].rotation.y = Number(flipSlider.value);
      }
    };


    engine.runRenderLoop(function () {
      scene.render();
    });

    window.addEventListener("resize", function () {
      engine.resize();
    });
  }

  return { run, download };
})();