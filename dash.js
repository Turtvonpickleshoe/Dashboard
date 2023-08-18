const todoInput = document.getElementById('todo-input');
const list = document.querySelector('.list');
const addButton = document.getElementById('addButton');

// Define the function to get the current state of the list
function getListState() {
  const listItems = document.querySelectorAll('.list-item');
  const listState = Array.from(listItems).map(item => ({ task: item.textContent.trim() }));
  return listState;
}


function saveNewItem(task) {
  fetch('/add-item', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({task: task})
  })
    .then(response => response.text())
    .then(text => console.log(text))
    .catch(err => console.error(err));
}

function removeFromDatabase(task) {
  fetch('/remove-item', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ task: task }),
  })
    .then(response => response.text())
    .then(text => console.log(text))
    .catch(err => console.error(err));
}

// Define the function to create a new list item
function createListItem(task) {
  const newListItem = document.createElement('div');
  newListItem.classList.add('list-item', 'slide');
  newListItem.textContent = task;
  saveNewItem(task);

  const newCircle = document.createElement('div');
  newCircle.classList.add('circle');
  newListItem.appendChild(newCircle);

  newCircle.addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent event from bubbling up to parent

    newListItem.classList.add('list-item-removed');
    newListItem.addEventListener('animationend', function () {
      newListItem.remove();
      removeFromDatabase(task); // Remove the list item from the database
    });

    setTimeout(function () {
      newListItem.classList.remove('slide');
    }, 1000);
  });

  return newListItem;
}

// Set up the event listener for the 'keydown' event on the 'todo-input' element
todoInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && todoInput.value.trim() !== '') {
      const task = todoInput.value;
      const newListItem = createListItem(task);
      list.appendChild(newListItem);
      todoInput.value = '';
      setTimeout(function () {
      newListItem.classList.remove('slide');
      }, 1000);
      // saveNewItem(task); // Save the item after adding an item
  }
});

// Set up the event listener for the 'DOMContentLoaded' event on the window object
window.addEventListener('DOMContentLoaded', (event) => {
  const list = document.querySelector('.list');
  list.innerHTML = '<h1 class="task">Task List</h1>'; // Clear existing list items

  fetch('/get-list')
    .then(response => response.json())
    .then(data => {
      data.forEach(item => {
        const newListItem = createListItem(item.task);
        list.appendChild(newListItem);
      });
    })
    .catch(err => console.error('Failed to get list from server', err));

  // Add event listener to the parent element for delegation
  list.addEventListener('click', function(event) {
    const circle = event.target.closest('.circle');        
    if (circle) {
      const listItem = circle.parentElement;      
      listItem.classList.add('list-item-removed'); // Add the class to apply the CSS animation

      // Wait for the animation to finish before removing the item
      listItem.addEventListener('animationend', function() {
        listItem.remove();
        removeFromDatabase(listItem.textContent); // Remove the list item from the database
      });
    }
  });
});




function showTime() {
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var meridiem = "AM";
  
  // Convert from 24-hour to 12-hour time
  if (hours > 12) {
    hours -= 12;
    meridiem = "PM";
  }
  
  // Add leading zeros to minutes and seconds
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  
  // Display the time in the clock element
  var clock = document.getElementById("clock");
  clock.innerText = hours + ":" + minutes + ":" + seconds + " " + meridiem;
}

// Update the clock every second
setInterval(showTime, 1000);

let hrs = document.getElementById('hours');
let mins = document.getElementById('minutes');
let secs = document.getElementById('seconds');
let startButton = document.getElementById('start');
let pauseButton = document.getElementById('pause');
let resetButton = document.getElementById('reset');
let audio = new Audio('buzz.wav');

let totalSeconds = 0;
let intervalId;

startButton.addEventListener('click', () => {
  totalSeconds = hrs.value * 3600 + mins.value * 60 + secs.value * 1;
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
    hrs.value = remainingHours < 10 ? '0' + remainingHours : remainingHours;
    mins.value = remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes;
    secs.value = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
  }, 1000);
});

pauseButton.addEventListener('click', () => {
  clearInterval(intervalId);
});

resetButton.addEventListener('click', () => {
  clearInterval(intervalId);
  hrs.value = '';
  mins.value = '';
  secs.value = '';
}); 

  /*/ Get the input fields and buttons.
  let hoursInput = document.getElementById('hours');
  let minutesInput = document.getElementById('minutes');
  let secondsInput = document.getElementById('seconds');
  let startButton = document.getElementById('start');
  let pauseButton = document.getElementById('pause');
  let resetButton = document.getElementById('reset');

  // Initialize an interval ID.
  let intervalID = null;

  // Define the countdown function.
  function countdown() {
    // Get the stored end time.
    let endTime = localStorage.getItem('countdownEndTime');

    // Calculate the remaining time.
    let remainingTime = endTime - new Date().getTime();

    // If the countdown ended, clear the interval and erase the stored end time.
    if (remainingTime <= 0) {
      clearInterval(intervalID);
      localStorage.removeItem('countdownEndTime');
      hoursInput.value = minutesInput.value = secondsInput.value = 0;
      // Enable the input fields.
      hoursInput.disabled = minutesInput.disabled = secondsInput.disabled = false;
    } else {
      // Otherwise, update your countdown display here.
      let hours = Math.floor(remainingTime / (1000 * 60 * 60));
      let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      hoursInput.value = hours;
      minutesInput.value = minutes;
      secondsInput.value = seconds;
    }
  }

  // Attach event listeners to the buttons.
  startButton.addEventListener('click', function() {
    // Calculate the end time based on the input values.
    let duration = (hoursInput.value * 60 * 60 + minutesInput.value * 60 + secondsInput.value * 1) * 1000;
    let endTime = new Date().getTime() + duration;

    // Store it in LocalStorage.
    localStorage.setItem('countdownEndTime', endTime);

    // Disable the input fields.
    hoursInput.disabled = minutesInput.disabled = secondsInput.disabled = true;

    // Start the countdown.
    intervalID = setInterval(countdown, 1000);
  });

  pauseButton.addEventListener('click', function() {
    // Pause the countdown.
    clearInterval(intervalID);
    // Enable the input fields.
    hoursInput.disabled = minutesInput.disabled = secondsInput.disabled = false;
  });

  resetButton.addEventListener('click', function() {
    // Reset the countdown.
    clearInterval(intervalID);
    localStorage.removeItem('countdownEndTime');
    hoursInput.value = minutesInput.value = secondsInput.value = 0;
    // Enable the input fields.
    hoursInput.disabled = minutesInput.disabled = secondsInput.disabled = false;
  });

  // Start the countdown if there's a stored end time.
  if (localStorage.getItem('countdownEndTime')) {
    // Disable the input fields.
    hoursInput.disabled = minutesInput.disabled = secondsInput.disabled = true;
    intervalID = setInterval(countdown, 1000);
  }*/
