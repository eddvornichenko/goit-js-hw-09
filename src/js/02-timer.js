import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      alert("Пожалуйста, выберите дату в будущем");
      document.querySelector("[data-start]").disabled = true;
    } else {
      document.querySelector("[data-start]").disabled = false;
    }
  },
};

const dateTimePicker = flatpickr("#datetime-picker", options);

let countdownInterval;
let timerRunning = false;

function startTimer() {
  const selectedDate = dateTimePicker.selectedDates[0];
  const currentDate = new Date();
  if (selectedDate > currentDate) {
    if (timerRunning) return;
    timerRunning = true;
    countdownInterval = setInterval(() => {
      const updatedCurrentDate = new Date();
      updateTimer(selectedDate, updatedCurrentDate);
    }, 1000);
    updateTimer(selectedDate, currentDate);
    document.querySelector("[data-start]").disabled = true;
    document.querySelector("#datetime-picker").disabled = true;
  } else {
    alert("Пожалуйста, выберите дату в будущем");
  }
}

function resetTimer() {
  clearInterval(countdownInterval);
  document.querySelector("[data-start]").disabled = false;
  document.querySelector("#datetime-picker").disabled = false;
  timerRunning = false;
  renderTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
}

function updateTimer(selectedDate, currentDate) {
  const remainingTime = selectedDate - currentDate;
  if (remainingTime > 0) {
    const { days, hours, minutes, seconds } = convertMs(remainingTime);
    renderTimer({ days, hours, minutes, seconds });
  } else {
    resetTimer();
  }
}

function addLeadingZero(value) {
  return value.toString().padStart(2, "0");
}

function renderTimer({ days, hours, minutes, seconds }) {
  document.querySelector("[data-days]").textContent = addLeadingZero(days);
  document.querySelector("[data-hours]").textContent = addLeadingZero(hours);
  document.querySelector("[data-minutes]").textContent = addLeadingZero(minutes);
  document.querySelector("[data-seconds]").textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

document.querySelector("[data-start]").addEventListener("click", startTimer);
document.querySelector("[data-reset]").addEventListener("click", resetTimer);