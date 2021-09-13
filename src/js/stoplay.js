let videoElement = null;
var fileName = null;
let action = null;


const loadSounds = function(action){
    fileName = null;
    var context = new AudioContext() || new webkitAudioContext(),
        request = new XMLHttpRequest();

    if (action == 'forward') {
      fileName = 'src/sounds/fast_forward.mp3';
    }
    else if (action == 'rewind') {
      fileName = 'src/sounds/rewind_back.mp3';
    }
    else if (action == 'pause') {
      fileName = 'src/sounds/pause.wav';
    }

    if (fileName) {
      request.open("GET", browser.runtime.getURL(fileName), true);
      request.responseType = "arraybuffer";
      request.onload = function(){
          context.decodeAudioData(request.response, onDecoded);
      }
    }

    function onDecoded(buffer){
        var bufferSource = context.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.connect(context.destination);
        bufferSource.start();
    }

    request.send();
};



function observeVideoElement() {
  if (videoElement !== null) return;
  if (document.querySelector('video') !== null) {
    videoElement = document.querySelector('video');
    videoElement.onpause = () => {
      if (videoElement.ended) return;
      action = 'pause';
      loadSounds(action);
    };
    videoElement.onplay = () => {
    };
  }
}

function observeElements() {
  documentObserver = new MutationObserver((mutations, observer) => {
    observeVideoElement();
    if (videoElement !== null) {
      documentObserver.disconnect();
    }
  });

  documentObserver.observe(document, {
    childList: true,
    subtree: true,
  });
}

  document.addEventListener('keydown',  event => {
  if (event.keyCode == '37' && document.URL.includes('watch')) {
    action = 'rewind';
  }
  else if (event.keyCode == '39' && document.URL.includes('watch')) {
    action = 'forward';
  }
  else {
    action = null;
  }
  loadSounds(action);
});

observeElements();
