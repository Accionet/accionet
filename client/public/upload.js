/* eslint-disable */
(function() {
  document.getElementById("file-input").onchange = function() {
    var files = document.getElementById('file-input').files;
    var file = files[0];
    if (file == null) {
      return alert('No file selected.');
    }
    getSignedRequest(file);
  };
})();


function getSignedRequest(file) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        uploadFile(file, response.signedRequest, response.url);
      } else {
        alert('Could not get signed URL.');
      }
    }
  };
  xhr.send();
}

function uploadFile(file, signedRequest, url) {
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        document.getElementById('preview').src = url;
        document.getElementById('avatar-url').value = url;
      } else {
        alert('Could not upload file.');
      }
    }
  };
  xhr.send(file);
}
