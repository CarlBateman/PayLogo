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