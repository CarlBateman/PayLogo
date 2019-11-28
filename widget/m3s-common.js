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
  <!-- The Spiel -->
<div class="m3s-spiel">
<br /><p class="m3s-spiel-h2">A demo WebGL Widget from <strong>Myriad 3D Studio</strong></p>
<p><strong>By Carl Bateman</strong> (<a href="http://carlbateman.com">CarlBateman.com</a>). Have fun!</p>
<p>This is a simple WebGL Widget based on some freelance work that failed to materialise, so here it is as a portfolio piece.<br />
It should be easy to add to any page, just include <br />
<code>&emsp;&emsp;&lt;script id="m3s-wgl-widget" src="m3s-widget-setup.js"&gt;&lt;/script&gt;</code><br />
and<br />
<code>&emsp;&emsp;&lt;div id="LogoGenerator"&gt; &lt;/div&gt;</code><br />
where you want the widget to appear.</p>

<p>I've implemented the widget in Three.js, Babylon.js and PlayCanvas engine. The widget defaults to Three.js but a different engine can be selected by clicking the icon in the top left.</p>
<p>I've tried to get the same look across engines, but not too hard as each works slightly differently and I wanted to have some indication of the differences in the final render.</p>

<br /><p class="m3s-spiel-h2">Some technical stuff</p>
<p>Code is pulled in by creating a script and setting its <code>src</code> property. I experimented with XHR and promises; XHR hides the source file names, promises felt a bit clunky,</p>
<p><code>setTimeout</code> is used to check whether the code has loaded. I tried using <code>onload</code>, but felt the delay before an error occurred was a too long.</p>
<p>Different web pages can be selected to get an idea of how the widget might look in different settings. I originally did this for debugging purposes.</p><br />
</div>

  <div class="m3s-wgl-widget-container">

    <!--div class="m3s-wgl-widget-panel"-->

      <div class="m3s-wgl-widget-header">
        <p id="company_name">Myriad 3D Studio</p>
        <p id="gizmo_name">WebGL Widget</p>
      </div>

      <div class="m3s-wgl-widget-menu">
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
      </div>

      <div class="m3s-wgl-widget-footer">
        <span class="hidden" id="playcanvas-info"> Note: At the time of development PlayCanvas doesn't support download.</span>
        <button class="" id="download-btn" onclick="m3sCommon.showDownloadDialog()">Download</button>
      </div>
    <!--/div-->

    <div class="m3s-wgl-widget-content">

      <canvas class="m3s-wgl-canvas" id="m3s-wgl-canvas-three" touch-action="none"></canvas>
      <canvas class="m3s-wgl-canvas" id="m3s-wgl-canvas-babylon" touch-action="none"></canvas>
      <canvas class="m3s-wgl-canvas" id="m3s-wgl-canvas-playcanvas" touch-action="none"></canvas>

      <div class="m3s-wgl-logo">
        <img id="engine-gif" class="m3s-wgl-logo-img" src="../widget/logos/threejs.gif" />
        <div id="m3s-wgl-logo-panel" class="m3s-wgl-logo-content">
          <div id="babylonjs-gif" class="m3s-wgl-logo-content-item">
            <img class="m3s-wgl-logo-img" src="../widget/logos/babylonjs.gif"><br/>
          </div>
          <div id="playcanvas-gif" class="m3s-wgl-logo-content-item">
            <img class="m3s-wgl-logo-img" src="../widget/logos/playcanvas.gif"><br/>
          </div>
          <div id="threejs-gif" class="m3s-wgl-logo-content-item">
            <img class="m3s-wgl-logo-img" src="../widget/logos/threejs.gif">
          </div>
 
        </div>
      </div>

    </div>
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
        <p>Type the name you'd like for your model below:
        <input type="text" name="fileName" maxlength="512" id="m3s-wgl-filename" placeholder="widget"/></p>
      </div>
      <div class="modal-footer">
        <button class="half-width" onclick="m3sWidgetController.download()">Download</button>
        &emsp;
        <button class="half-width" onclick="m3sCommon.closeModal()">Cancel</button>
      </div>
    </div>
  </div>`;

    document.getElementById("LogoGenerator").appendChild(section);
  }

  return { hslToRgb, setRandom, closeModal, insertHTML, showDownloadDialog };
})();