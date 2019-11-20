var m3sWidgetController = m3sWidgetController || (function () {
  m3sCommon.insertHTML();

  const canvasThree = document.getElementById("m3s-wgl-canvas-three");
  const canvasBabylon = document.getElementById("m3s-wgl-canvas-babylon");
  const canvasPlaycanvas = document.getElementById("m3s-wgl-canvas-playcanvas");

  const run = function (mydir) {

    m3sWidgetBabylon.run(mydir);
    m3sWidgetThree.run(mydir);

    canvasThree.classList.add("hidden");
    //canvasBabylon.classList.add("hidden");
  };

  const download = function () {
    m3sWidgetThree.download();
    //m3sWidgetBabylon.download();
  };

  return { run, download };

})();