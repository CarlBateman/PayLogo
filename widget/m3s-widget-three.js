var m3sWidgetThree = m3sWidgetThree || (function () {
  let scene;
  let bar;

  const download = function () {
    if (typeof THREE.GLTFExporter === "undefined") {
      alert("Sorry, the download component can't be found.\nUnable to donwload!");
      return;
    }
    const modal = document.getElementById("myModal");

    let fileName = document.getElementById("m3s-wgl-filename").value;
    if (fileName === "")
      fileName = "widget";

    m3sCommon.closeModal();

    const options = {
      onlyVisible: true,
      binary: true,
    };

    var link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link); // Firefox workaround, see #6594

    function save(blob, filename) {
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    }

    function saveString(text, filename) {
      save(new Blob([text], { type: 'text/plain' }), filename);
    }

    function saveArrayBuffer(buffer, filename) {
      save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
    }

    const gltfExporter = new THREE.GLTFExporter();
    gltfExporter.parse(scene, function (result) {
      if (result instanceof ArrayBuffer) {
        saveArrayBuffer(result, fileName + '.glb');
      } else {
        var output = JSON.stringify(result, null, 2);
        console.log(output);
        saveString(output, fileName + '.gltf');
      }
    }, options);
  };

  function run(mydir) {
    const canvas = document.getElementById("m3s-wgl-canvas-three");

    const radius = [];
    const spin = [];
    const bars = [];
    const flip = [];
    const offset = [];
    const origins = [];
    let controls;
    let material;
    let light;

    const createScene = function () {
      scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      camera.position.z = 7.35;

      const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);

      const light1 = new THREE.AmbientLight(0xffffff);
      scene.add(light1);

      light = new THREE.DirectionalLight(0xffffff, 0.5);
      light.position.x = -100;
      light.position.y = 0;
      light.position.z = 100;
      scene.add(light);

      if (typeof THREE.GLTFLoader === "undefined") {
        addBar();
      } else {
        const gltfLoader = new THREE.GLTFLoader();
        gltfLoader.load(mydir + "model/bend.glb", (gltf) => {
          material = new THREE.MeshStandardMaterial({ color: 'hsl(180,50%,50%)' });
          material.roughness = 0.5;
          material.metalness = 0.5;
          bar = gltf.scene.children[0];
          bar.visible = false;
          bar.material = material;
          scene.add(bar);

          setup();
        });
      }

      function addBar() {
        var geometry = new THREE.BoxGeometry(3.35, .5, .5);
        material = new THREE.MeshStandardMaterial({ color: 'hsl(180,50%,50%)' });
        bar = new THREE.Mesh(geometry, material);
          bar.visible = false;
        scene.add(bar);
        setup();

      }

      function setup() {
        let numBars = 30;
        let step = 7;

        for (let i = 0; i < numBars; i++) {
          const origin = new THREE.Object3D();
          scene.add(origin);
          origins.push(origin);

          const offset1 = new THREE.Object3D();
          origin.add(offset1);
          offset.push(offset1);

          const radius1 = new THREE.Object3D();
          offset1.add(radius1);
          radius.push(radius1);

          const spin1 = new THREE.Object3D();
          radius1.add(spin1);
          spin.push(spin1);

          const bar1 = new THREE.Object3D();
          spin1.add(bar1);

          const flip1 = new THREE.Object3D();
          bar1.add(flip1);
          flip.push(flip1);

          origin.rotation.z = Math.ceil(i / 2) * (2 * Math.PI) / step;
          origin.rotation.z += Math.PI / 2;

          offset1.position.x = 2;

          radius1.position.x = 0;

          if (i % 2) {
            offset1.rotation.z = -Math.PI;
            origin.position.z = .5;
            spin1.rotation.z = -Math.PI / 2;
          }

          const box = bar.clone();
          box.name = "box" + i;
          flip1.add(box);
          bar1.rotation.z = -Math.PI / 8;
          bar1.rotation.y = -2*Math.PI / 3;

          if (i < step * 2)
            box.visible = true;

          bars.push(box);
        }

        controls = new THREE.OrbitControls(camera, canvas);
        controls.update();
      }

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
          bars[i].visible = true;
          origins[i].visible = true;
          radius[i].visible = true;
          spin[i].visible = true;
          bars[i].visible = true;
          flip[i].visible = true;
          offset[i].visible = true;
        }
        for (; i < bars.length; i++) {
          bars[i].visible = false;
          origins[i].visible = false;
          radius[i].visible = false;
          spin[i].visible = false;
          bars[i].visible = false;
          flip[i].visible = false;
          offset[i].visible = false;
        }
      });



      const hueSlider = document.getElementById("hue");
      hueSlider.addEventListener("input", function () {
        let rgb = m3sCommon.hslToRgb(Number(hueSlider.value), 0.5, 0.5);
        material.color.r = rgb[0];
        material.color.g = rgb[1];
        material.color.b = rgb[2];
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
        let i = 0;
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

      var animate = function () {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
      };

      animate();
    };

    createScene();

  }

  return { run, download };
})();