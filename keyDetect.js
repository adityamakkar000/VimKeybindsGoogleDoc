var iframe = document.querySelector(".docs-texteventtarget-iframe");
var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

iframeDoc.addEventListener('keydown', function (e) {
  console.log(e.key, " ", e.keyCode);
});
