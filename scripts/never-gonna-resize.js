/**
 * NeverGonnaResize.js - v0.0.1
 *
 * Emanuel Kluge - 2014-02-04
 *
 * https://github.com/herschel666/NeverGonnaResize.js
 *
 * License: WTFPL
 */
(function (win, AudioCtx, undefined) {

  var MAX_WIDTH = win.screen.availWidth;
  var MIN_WIDTH = 320;

  var timeoutId;

  var audioCtx,
      source,
      filter,
      gainNode;

  function onResponse(evnt) {
    audioCtx.decodeAudioData(evnt.target.response, function decode(buffer) {

      source = audioCtx.createBufferSource();
      filter = audioCtx.createBiquadFilter();
      gainNode = audioCtx.createGain();

      source.buffer = buffer;
      source.loop = true;
      gainNode.gain.value = 0;
      filter.gain.value = 15;
      filter.Q.value = 10;

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      source.start();

      win.addEventListener('resize', onResize);

    });
  }

  function onResize() {

    filter.frequency.value = Math.floor(getFrequency(win.innerWidth));
    gainNode.gain.value = .4;

    if ( timeoutId ) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(afterResize, 1000);

  }

  function afterResize() {
    gainNode.gain.value = 0;
  }

  function getFrequency(winWidth) {

    var factor = (winWidth - MIN_WIDTH) / (MAX_WIDTH - MIN_WIDTH),
        range = 5000 - filter.frequency.minValue,
        result;

    if ( factor < 0 ) {
      factor = 0;
    }

    if ( factor > 1 ) {
      factor = 1;
    }

    result = range - factor * range;

    return result < filter.frequency.minValue
      ? filter.frequency.minValue
      : result > 5000
      ? 5000
      : result;

  }

  win.neverGonnaResize = function neverGonnyResize(pathToHodor) {

    var request;

    if ( !AudioCtx ) {
      return;
    }

    audioCtx = new AudioCtx();

    request = new XMLHttpRequest();
    request.open('GET', pathToHodor, true);
    request.responseType = 'arraybuffer';
    request.addEventListener('load', onResponse, false);
    request.send();

  };

})(window, (window.AudioContext || window.webkitAudioContext || window.oAudioContext || window.mozAudioContext || window.msAudioContext));