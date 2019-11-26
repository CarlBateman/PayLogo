var m3sWidgetController = m3sWidgetController || (function () {
  m3sCommon.insertHTML();

  const canvasThree = document.getElementById("m3s-wgl-canvas-three");
  const canvasBabylon = document.getElementById("m3s-wgl-canvas-babylon");
  const canvasPlaycanvas = document.getElementById("m3s-wgl-canvas-playcanvas");

  const btnThree = document.getElementById("threejs-gif");
  const btnBabylon = document.getElementById("babylonjs-gif");
  const btnPlaycanvas = document.getElementById("playcanvas-gif");

  const enginegif = document.getElementById("engine-gif");
  const logoContent = document.getElementById("m3s-wgl-logo-panel");

  let widget = m3sWidgetBabylon;

  btnThree.addEventListener("click", function () {
    widget = canvasThree;

    canvasThree.classList.remove("hidden");
    canvasBabylon.classList.add("hidden");
    canvasPlaycanvas.classList.add("hidden");

    enginegif.src = "../widget/logos/threejs.gif";
    //logoContent.style.display = "none";
    canvasThree.focus();
  });

  btnBabylon.addEventListener("click", function () {
    widget = m3sWidgetBabylon;

    canvasThree.classList.add("hidden");
    canvasBabylon.classList.remove("hidden");
    canvasPlaycanvas.classList.add("hidden");

    enginegif.src = "../widget/logos/babylonjs.gif";
    //logoContent.style.display = "none";
    canvasBabylon.focus();
  });

  btnPlaycanvas.addEventListener("click", function () {
    widget = canvasPlaycanvas;

    canvasThree.classList.add("hidden");
    canvasBabylon.classList.add("hidden");
    canvasPlaycanvas.classList.remove("hidden");

    enginegif.src = "../widget/logos/playcanvas.gif";
    //logoContent.style.display = "none";
    canvasPlaycanvas.focus();
  });



  const run = function (mydir) {
    m3sWidgetBabylon.run(mydir);
    m3sWidgetThree.run(mydir);
    m3sWidgetPlaycanvas.run(mydir);

    //canvasThree.classList.add("hidden");
    canvasBabylon.classList.add("hidden");
    canvasPlaycanvas.classList.add("hidden");
  };

  const download = function () {
    widget.download();
    //m3sWidgetPlaycanvas.download();
    //m3sWidgetThree.download();
    //m3sWidgetBabylon.download();
  };

  return { run, download };

})();