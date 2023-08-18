let hours = document.getElementById('hours');
let minutes = document.getElementById('minutes');
let seconds = document.getElementById('seconds');
let startButton = document.getElementById('start');
let pauseButton = document.getElementById('pause');
let resetButton = document.getElementById('reset');
let audio = new Audio('buzz.wav');

let totalSeconds = 0;
let intervalId;

startButton.addEventListener('click', () => {
  totalSeconds = hours.value * 3600 + minutes.value * 60 + seconds.value * 1;
  intervalId = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(intervalId);
          audio.loop = true;
    audio.play();
    setTimeout(function() {
      audio.pause();
      audio.currentTime = 0;
      audio.loop = false;
    }, 180000); // 3 minutes
    var result = confirm("Time's up! Click OK to stop the audio.");
    if (result == true) {
      audio.pause();
      audio.currentTime = 0;
      audio.loop = false;
    }
    }
    totalSeconds--;
    let remainingHours = Math.floor(totalSeconds / 3600);
    let remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    let remainingSeconds = totalSeconds % 60;
    hours.value = remainingHours < 10 ? '0' + remainingHours : remainingHours;
    minutes.value = remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes;
    seconds.value = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
  }, 1000);
});

pauseButton.addEventListener('click', () => {
  clearInterval(intervalId);
});

resetButton.addEventListener('click', () => {
  clearInterval(intervalId);
  hours.value = '';
  minutes.value = '';
  seconds.value = '';
});