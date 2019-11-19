var m3sWidgetThree = m3sWidgetThree || (function () {
  let scene;
  let bar;

  const download = function () { };

  function run(mydir) {
    m3sCommon.insertHTML();
    const canvas = document.getElementById("m3s-wgl-renderCanvas");

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

      const light = new THREE.HemisphereLight(0xffffbb, 0x888888, 1);
      light.position.x = 100;
      light.position.y = 0;
      light.position.z = 100;
      light.intensity = 1;
      scene.add(light);

      if (typeof THREE.GLTFLoader === "undefined") {
        addBar();
      } else {
        const gltfLoader = new THREE.GLTFLoader();
        gltfLoader.load(mydir + "model/bend.glb", (gltf) => {
          material = new THREE.MeshStandardMaterial({ color: 'hsl(180,50%,50%)' });
          bar = gltf.scene.children[0];
          bar.visible = false;
          bar.material = material;
          scene.add(bar);

          setup();

        });

      }

      let numBars = 30;
      let step = 7;
      function setup() {
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

      function addBar() {
        var geometry = new THREE.BoxGeometry(3.35, .5, .5);
        material = new THREE.MeshStandardMaterial({ color: 'hsl(180,50%,50%)' });
        bar = new THREE.Mesh(geometry, material);
        scene.add(bar);
        setup();

      }

      var animate = function () {
        requestAnimationFrame(animate);

        //bar.rotation.x += 0.01;
        //bar.rotation.y += 0.01;

        //if (typeof THREE.OrbitControls !== undefined) {
        //  console.log("kgjkgkj");
        //}

        renderer.render(scene, camera);
      };

      animate();
    };

    createScene();

  }

  return { run, download };
})();