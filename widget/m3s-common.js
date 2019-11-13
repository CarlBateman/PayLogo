var m3sCommon = m3sCommon || (function () {
  function hslToRgb(h, s, l) {
    var r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      var hue2rgb = function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    //return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    return [r, g, b];
  }

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
  }

  function insertHTML() {
    var section = document.createElement('div');
    section.setAttribute('id', "m3s-wgl-widget");
    section.innerHTML = `
        <div class="m3s-wgl-ui-panel">
          <div class="m3s-wgl-ui-header">
            <p id="company_name">Myriad 3D Studio</p>
            <p id="gizmo_name">WebGL Widget</p>
          </div>

          <div class="m3s-wgl-ui-mainbody">
            <div class="m3s-wgl-ui-cell"></div>
            <div class="m3s-wgl-ui-cell">
              <label class="m3s-wgl-ui-label" for="radius">Radius</label>
              <button class="m3s-wgl-ui-button" onclick="m3sCommon.setRandom(this)">Randomise</button>
              <input type="range" min="-2" max="4" step="0.01" value="0" class="m3s-slider" id="radius">
            </div>
            <div class="m3s-wgl-ui-cell">
              <label class="m3s-wgl-ui-label" for="flip">Flip</label>
              <button class="m3s-wgl-ui-button" onclick="m3sCommon.setRandom(this)">Randomise</button>
              <input type="range" min="-3.14159" max="3.14159" step="0.0349" class="m3s-slider" id="flip">
            </div>
            <div class="m3s-wgl-ui-cell">
              <label class="m3s-wgl-ui-label" for="spin">Spin</label>
              <button class="m3s-wgl-ui-button" onclick="m3sCommon.setRandom(this)">Randomise</button>
              <input type="range" min="-6.2832" max="6.2832" step="0.0349" value="0" class="m3s-slider" id="spin">
            </div>
            <div class="m3s-wgl-ui-cell">
              <label class="m3s-wgl-ui-label" for="offset">Offset</label>
              <button class="m3s-wgl-ui-button" onclick="m3sCommon.setRandom(this)">Randomise</button>
              <input type="range" min="-1" max="3" step="0.01" value="2" class="m3s-slider" id="offset">
            </div>
            <div class="m3s-wgl-ui-cell">
              <label class="m3s-wgl-ui-label" for="hue">Colour</label>
              <button class="m3s-wgl-ui-button" onclick="m3sCommon.setRandom(this)">Randomise</button>
              <input type="range" min="0" max="1" step="0.01" value=".5" class="m3s-slider-hue" id="hue">
            </div>
            <div class="m3s-wgl-ui-cell">
              <label class="m3s-wgl-ui-label" for="offset">Brightness</label>
              <button class="m3s-wgl-ui-button" onclick="m3sCommon.setRandom(this)">Randomise</button>
              <input type="range" min="0" max="4" step="0.01" value="1" class="m3s-slider" id="brightness">
            </div>
            <div class="m3s-wgl-ui-cell">
              <label class="m3s-wgl-ui-label" for="offset">Number</label>
              <button class="m3s-wgl-ui-button" onclick="m3sCommon.setRandom(this)">Randomise</button>
              <input type="range" min="2" max="15" step="1" value="7" class="m3s-slider" id="number">
            </div>
            <div class="m3s-wgl-ui-cell"></div>

          </div>

          <div class="m3s-wgl-ui-footer">
            <button class="" onclick="m3sCommon.showDownloadDialog()">Download</button>
          </div>
        </div>

        <div id="m3s-wgl-renderOutput">
          <canvas id="m3s-wgl-renderCanvas" touch-action="none"></canvas>
        </div>

  <!-- The Modal -->
  <div id="myModal" class="modal">

    <!-- Modal content -->
    <div class="modal-content">
      <div class="modal-header">
        <span class="close">&times;</span>
        <h2>Download Model</h2>
      </div>
      <div class="modal-body">
        <p>Note: The model will be downloaded as two files: <br />
        <span id="fixed">&emsp;widget.gltf
        <br />
        &emsp;widget.bin</span></p>
        <p>Type the name you'd like for your model below:
        <input type="text" name="fileName" maxlength="512" id="m3s-wgl-filename" placeholder="widget"/></p>
      </div>
      <div class="modal-footer">
        <button class="half-width" onclick="m3sWidgetBabylon.download()">Download</button>
        &emsp;
        <button class="half-width" onclick="m3sCommon.closeModal()">Cancel</button>
      </div>
    </div>
  </div>`;

    document.getElementById("LogoGenerator").appendChild(section);
  }

  return { hslToRgb, setRandom, closeModal, insertHTML, showDownloadDialog };
})();


//function Jim() {
//  let a = 1;
//  var b1 = 2;
//  const c = 3;
//  this.d = 4;

//  this.getA = function () {
//    return a;
//  };

//  this.addFunc = function (fnname, fn) {
//    console.log(a);
//    console.log(b1);
//    console.log(c);
//    console.log(this.d);
//    this[fnname] = fn;
//  };
//}

//jim = new Jim();

//jim.addFunc("fred", function () {
//  console.log(this.getA());
//  console.log(b1);
//  console.log(c);
//  console.log(this.d);
//});
//jim.fred();


//(function (namespace) {
//  namespace.fn = function () {
//    console.log(a);
//    console.log(b);
//    console.log(c);
//  };
//  namespace.fn();
//})(m3sCommon);



//(function (namespace) {
//  var prive = "other private";
//  namespace.newFunc = function () { return prive };
//})(m3sCommon);

//(function (namespace) {
//  namespace.privqe = "other private";
//})(m3sCommon);