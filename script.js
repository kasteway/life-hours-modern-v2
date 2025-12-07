// Default values for each category
const defaults = {
  sleep: 8,
  work: 8,
  commute: 1,
  meals: 1.5,
  freetime: 3,
  other: 2.5
};

// Get all slider elements
const sliders = {
  sleep: document.getElementById('sleep-hours'),
  work: document.getElementById('work-hours'),
  commute: document.getElementById('commute-hours'),
  meals: document.getElementById('meals-hours'),
  freetime: document.getElementById('freetime-hours'),
  other: document.getElementById('other-hours')
};

// Get all value display elements
const valueDisplays = {
  sleep: document.getElementById('sleep-value'),
  work: document.getElementById('work-value'),
  commute: document.getElementById('commute-value'),
  meals: document.getElementById('meals-value'),
  freetime: document.getElementById('freetime-value'),
  other: document.getElementById('other-value')
};

// Initialize sliders with event listeners
Object.keys(sliders).forEach(key => {
  const slider = sliders[key];
  const display = valueDisplays[key];
  
  // Update display when slider changes
  slider.addEventListener('input', () => {
    const value = parseFloat(slider.value);
    display.textContent = value.toFixed(2);
    updateTotals();
  });
});

// Update total and remaining hours
function updateTotals() {
  let total = 0;
  
  Object.keys(sliders).forEach(key => {
    total += parseFloat(sliders[key].value);
  });
  
  const totalElement = document.getElementById('total-hours');
  const remainingElement = document.getElementById('remaining-hours');
  const warningElement = document.getElementById('warning-message');
  
  totalElement.textContent = total.toFixed(2);
  remainingElement.textContent = (24 - total).toFixed(2);
  
  // Show warning if total exceeds 24 hours
  if (total > 24) {
    warningElement.classList.remove('hidden');
    totalElement.style.color = '#c33';
    remainingElement.style.color = '#c33';
  } else {
    warningElement.classList.add('hidden');
    totalElement.style.color = '#667eea';
    remainingElement.style.color = '#667eea';
  }
}

// Reset to defaults function
function resetToDefaults() {
  Object.keys(defaults).forEach(key => {
    sliders[key].value = defaults[key];
    valueDisplays[key].textContent = defaults[key].toFixed(2);
  });
  updateTotals();
}

// Reset button event listener
document.getElementById('reset-button').addEventListener('click', resetToDefaults);

// Initialize on page load
updateTotals();
