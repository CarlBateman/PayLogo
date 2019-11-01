function setRandom(el) {
  let sib = el.parentNode.firstChild;

  while (sib) { 
    if (sib.nodeName === "INPUT") {
      let min = Number(sib.min);
      if (isNaN(min)) return;
      let max = Number(sib.max);
      if (isNaN(max)) return;
      let value = Math.random() * (max - min) + min;
      sib.value = value;
      sib.dispatchEvent(new Event('input'));
      //sib.oninput();
      return;
    }
    sib = sib.nextSibling;
  }
}

function closeModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}

function showDownloadDialog() {
  var modal = document.getElementById("myModal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    closeModal();
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target === modal) {
      closeModal();
    }
  };
};

let download;

window.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById("m3s-wgl-renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);
  var radius = [];
  var spin = [];
  var bar;

  var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor.a = 0;

    BABYLON.SceneLoader.ImportMesh("", "", "bend.glb", scene, function (newMeshes) {
      newMeshes[1].visibility = false;
      bar = newMeshes[1];
      setup();

      let options = {
        shouldExportNode: function (node) {
          return node !== bar;
        }
      };

      download = function () {
        var modal = document.getElementById("myModal");

        let fileName = document.getElementById("m3s-wgl-filename").value;
        if (fileName === "")
          fileName = "widget";

        closeModal();

        BABYLON.GLTF2Export.GLTFAsync(scene, fileName, options).then((gltf) => {
          gltf.downloadFiles();
        });
      };
    });

    var camera = new BABYLON.ArcRotateCamera('camera1', -Math.PI / 2, Math.PI / 2, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, false);

    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-100, 0, -100), scene);
    light1.intensity = 0.25;
    //var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, 0), scene);
    //light2.intensity = 0.25;


 
    //for (var i = 0; i < 7; i++) {
    //  let offset = new BABYLON.Mesh("boid", scene);
    //  offset.rotation.y = i * (2 * Math.PI) / 7;
    //  offset.rotation.y += (2 * Math.PI) / 4;

    //  let pivot = new BABYLON.Mesh("boid", scene);
    //  pivot.parent = offset;
    //  pivot.position.z = 3;
    //  pivot.rotation.z = 6 * Math.PI / 7;

    //  var box = BABYLON.MeshBuilder.CreateBox("box", { width: 5 }, scene);
    //  box.parent = pivot;
    //  boxes.push(box);
    //  pivots.push(box);
    //}

    //for (var i = 0; i < 7; i++) {
    //  let offset = new BABYLON.Mesh("boid", scene);
    //  offset.position.y =-2;
    //  offset.rotation.y = i * (2 * Math.PI) / 7;
    //  offset.rotation.y += (2 * Math.PI) / 4;

    //  let pivot = new BABYLON.Mesh("boid", scene);
    //  pivot.parent = offset;
    //  pivot.position.z = 3;
    //  pivot.rotation.z = 6 * Math.PI / 7;

    //  var box = BABYLON.MeshBuilder.CreateBox("box", { width: 5 }, scene);
    //  box.parent = pivot;
    //  box.rotation.y = Math.PI / 4;
    //  boxes.push(box);
    //  pivots.push(box);
    //}

    //origin.position.y = .1;
    function setup() {
      for (var i = 0; i < 15; i++) {
        let origin = new BABYLON.Mesh("origin", scene);// BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1.5 }, scene);// new 

        let offset = new BABYLON.Mesh("offset", scene);// BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1.5 }, scene);
        offset.parent = origin;
        //offset.material = new BABYLON.StandardMaterial("myMaterial", scene);
        //offset.material.diffuseColor = new BABYLON.Color3(1, 0, 0);

        let radius1 = new BABYLON.Mesh("radius", scene);//BABYLON.MeshBuilder.CreateSphere("radius", { diameter: 1.5 }, scene);//
        radius1.setParent(offset);
        radius.push(radius1);
        //radius1.material = new BABYLON.StandardMaterial("myMaterial", scene);
        //radius1.material.diffuseColor = new BABYLON.Color3(0, 1, 0);

        let spin1 = new BABYLON.Mesh("spin", scene);// BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1.5 }, scene);//
        spin1.setParent(radius1);
        spin.push(spin1);
        //spin1.material = new BABYLON.StandardMaterial("myMaterial", scene);
        //spin1.material.diffuseColor = new BABYLON.Color3(0, 0, 1);


        origin.rotation.z = i * (2 * Math.PI) / 7;
        origin.rotation.z += (2 * Math.PI) / 4;

        offset.position.x = 2;

        radius1.position.x = 0;
        //spin1.position.x = 3.5;
        if (i > 7)
          offset.rotation.z = Math.PI;

        //var box = BABYLON.MeshBuilder.CreateBox("box", { width: 5 }, scene);
        var box = bar.clone();
        box.setParent(spin1);
        //box.rotation.y = -Math.PI / 8;
        //box.rotation.z = 1 / 10;//Math.PI / 3;
        box.rotate(BABYLON.Axis.Z, Math.PI / 8, BABYLON.Space.WORLD);
        box.rotate(BABYLON.Axis.Y, -Math.PI / 3, BABYLON.Space.WORLD);

        box.visibility = true;
        box.name = "bar";


      }

    }
    return scene;
  };

  var scene = createScene();

  var radiusSlider = document.getElementById("radius");
  var flipSlider = document.getElementById("flip");
  var spinSlider = document.getElementById("spin");

  radiusSlider.oninput = function () {
    var n = spin.length;
    for (var i = 0; i < n; i++) {
      radius[i].position.x = -radiusSlider.value;
    }
  };

  spinSlider.oninput = function () {
    var i = 0;
    for (; i < radius.length / 2; i++) {
      spin[i].rotation.z = spinSlider.value;
    }
    for (; i < radius.length; i++) {
      spin[i].rotation.z = .5*spinSlider.value - Math.PI /2;
    }
  };

  flipSlider.oninput = function () {
    for (var i = 0; i < radius.length; i++) {
      //pivots[i].rotation.z = flipSlider.value;
    }
  };




  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener("resize", function () {
    engine.resize();
  });
});