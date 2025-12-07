// Initialize animations and icons
AOS.init();
feather.replace();

// Vanta.js background
VANTA.WAVES({
    el: "#vanta-bg",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0x3b3b6e,
    shininess: 35.00,
    waveHeight: 15.00,
    waveSpeed: 0.85,
    zoom: 0.8
});

// Connect range inputs to their display values
// AGE/LIFESPAN SLIDERS - Event listeners for age and lifespan sliders
document.querySelectorAll('input[type="range"]').forEach(input => {
    const valueSpan = document.getElementById(`${input.id}-value`);
    input.addEventListener('input', () => {
        valueSpan.textContent = input.value;
        calculateLifetime();
    });
});

// Connect daily routine inputs
// DAILY ROUTINE INPUTS - Event listeners for daily activity hour inputs
document.querySelectorAll('#daily-routine input[type="number"]').forEach(input => {
    input.addEventListener('change', () => {
        updateTotalHours();
        calculateLifetime();
    });
});

// Scenario buttons
document.getElementById('reduce-work').addEventListener('click', () => {
    const workInput = document.getElementById('work-hours-daily');
    if (parseFloat(workInput.value) > 0) {
        workInput.value = (parseFloat(workInput.value) - 1).toFixed(1);
        updateTotalHours();
        calculateLifetime();
    }
});

document.getElementById('increase-sleep').addEventListener('click', () => {
    const sleepInput = document.getElementById('sleep-hours');
    sleepInput.value = (parseFloat(sleepInput.value) + 1).toFixed(1);
    updateTotalHours();
    calculateLifetime();
});

document.getElementById('optimize-commute').addEventListener('click', () => {
    const commuteInput = document.getElementById('commute-hours');
    commuteInput.value = (parseFloat(commuteInput.value) / 2).toFixed(1);
    updateTotalHours();
    calculateLifetime();
});

// Update total hours and validate
function updateTotalHours() {
    const sleep = parseFloat(document.getElementById('sleep-hours').value) || 0;
    const work = parseFloat(document.getElementById('work-hours-daily').value) || 0;
    const meals = parseFloat(document.getElementById('meals-hours').value) || 0;
    const commute = parseFloat(document.getElementById('commute-hours').value) || 0;
    const leisure = parseFloat(document.getElementById('leisure-hours').value) || 0;
    const other = parseFloat(document.getElementById('other-hours').value) || 0;
    
    const total = sleep + work + meals + commute + leisure + other;
    document.getElementById('total-hours').textContent = total.toFixed(1);
    
    const errorElement = document.getElementById('hours-error');
    if (Math.abs(total - 24) > 0.1) {
        errorElement.classList.remove('hidden');
        document.getElementById('total-hours').classList.add('text-red-400');
        document.getElementById('total-hours').classList.remove('text-indigo-300');
    } else {
        errorElement.classList.add('hidden');
        document.getElementById('total-hours').classList.remove('text-red-400');
        document.getElementById('total-hours').classList.add('text-indigo-300');
    }
}

// Charts
let lifeChart, timeChart;

// MAIN CALCULATION FUNCTION - Calculates lifetime statistics and updates visualizations
function calculateLifetime() {
    const age = parseInt(document.getElementById('age').value);
    const lifespan = parseInt(document.getElementById('lifespan').value);
    const education = parseInt(document.getElementById('education').value);
    const retirement = parseInt(document.getElementById('retirement').value);
    const workHours = parseInt(document.getElementById('work-hours').value);
    const workDays = parseInt(document.getElementById('work-days').value);
    
    const sleepHours = parseFloat(document.getElementById('sleep-hours').value) || 0;
    const workDailyHours = parseFloat(document.getElementById('work-hours-daily').value) || 0;
    const mealsHours = parseFloat(document.getElementById('meals-hours').value) || 0;
    const commuteHours = parseFloat(document.getElementById('commute-hours').value) || 0;
    const leisureHours = parseFloat(document.getElementById('leisure-hours').value) || 0;
    const otherHours = parseFloat(document.getElementById('other-hours').value) || 0;
    
    // Calculate remaining years
    const remainingYears = lifespan - age;
    
    // Calculate time spent in various activities (in years)
    const sleepYears = (sleepHours / 24 * 365 * remainingYears) / 365;
    const workYears = (workDailyHours / 24 * 365 * (retirement - Math.max(age, education))) / 365;
    const mealsYears = (mealsHours / 24 * 365 * remainingYears) / 365;
    const commuteYears = (commuteHours / 24 * 365 * (retirement - Math.max(age, education))) / 365;
    const leisureYears = (leisureHours / 24 * 365 * remainingYears) / 365;
    const otherYears = (otherHours / 24 * 365 * remainingYears) / 365;
    
    // Update insights
    document.getElementById('sleep-insight').textContent = `You will spend approximately ${sleepYears.toFixed(1)} years of your life sleeping.`;
    document.getElementById('work-insight').textContent = `You will spend approximately ${workYears.toFixed(1)} years of your life working.`;
    document.getElementById('leisure-insight').textContent = `You will have approximately ${leisureYears.toFixed(1)} years of leisure time.`;
    document.getElementById('time-left-insight').textContent = `Based on your inputs, you have approximately ${remainingYears} years left.`;
    
    // Update current age label
    document.getElementById('current-age-label').textContent = `Age ${age}`;
    
    // LIFE TIMELINE PERCENTAGE - Calculate and display percentage of life lived
    const lifePercentage = (age / lifespan * 100).toFixed(1);
    document.getElementById('life-percentage').textContent = `${lifePercentage}%`;
    
    // Update timeline visualization
    const timeline = document.getElementById('life-timeline');
    timeline.innerHTML = `
        <div class="absolute left-0 h-full bg-indigo-500" style="width: ${lifePercentage}%"></div>
        <div class="absolute h-full bg-indigo-300 opacity-50" style="left: ${lifePercentage}%; width: ${100 - lifePercentage}%"></div>
    `;
    
    // Update charts
    updateCharts(age, lifespan, remainingYears, sleepYears, workYears, mealsYears, commuteYears, leisureYears, otherYears);
}

// CHART UPDATE FUNCTION - Updates both pie chart and donut chart
function updateCharts(age, lifespan, remainingYears, sleepYears, workYears, mealsYears, commuteYears, leisureYears, otherYears) {
    // Life Chart (Pie)
    const lifeCtx = document.getElementById('life-chart').getContext('2d');
    
    if (lifeChart) {
        lifeChart.destroy();
    }
    
    lifeChart = new Chart(lifeCtx, {
        type: 'pie',
        data: {
            labels: ['Years Lived', 'Years Remaining'],
            datasets: [{
                data: [age, remainingYears],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(79, 70, 229, 0.5)'
                ],
                borderColor: [
                    'rgba(99, 102, 241, 1)',
                    'rgba(79, 70, 229, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#E5E7EB'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} years`;
                        }
                    }
                }
            }
        }
    });
    
    // TIME ALLOCATION DONUT CHART - Add percentage labels to segments here later
    const timeCtx = document.getElementById('time-chart').getContext('2d');
    
    if (timeChart) {
        timeChart.destroy();
    }
    
    timeChart = new Chart(timeCtx, {
        type: 'doughnut',
        data: {
            labels: ['Sleep', 'Work', 'Meals', 'Commute', 'Leisure', 'Other'],
            datasets: [{
                data: [sleepYears, workYears, mealsYears, commuteYears, leisureYears, otherYears],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(234, 179, 8, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(236, 72, 153, 0.8)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(234, 179, 8, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(236, 72, 153, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#E5E7EB'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw.toFixed(1)} years`;
                        }
                    }
                }
            }
        }
    });
}

// Initial calculation
updateTotalHours();
calculateLifetime();

