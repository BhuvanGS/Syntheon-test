// Calculator state
let display = document.getElementById('display');
let prevDisplay = document.getElementById('prev');
let currentDisplay = document.getElementById('current');
let currentInput = '';
let previousValue = null;
let operator = null;
let history = [];

// Preference keys
const THEME_KEY = 'calcTheme';
const SCI_MODE_KEY = 'calcScientificMode';

function updateDisplay() {
    currentDisplay.textContent = currentInput || '0';
    prevDisplay.textContent = operator && previousValue !== null ? `${previousValue} ${operator}` : '';
}

function clearAll() {
    currentInput = '';
    previousValue = null;
    operator = null;
    updateDisplay();
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

function appendNumber(num) {
    // Prevent multiple leading zeros
    if (num === '0' && currentInput === '0') return;
    // Prevent multiple decimals
    if (num === '.' && currentInput.includes('.')) return;
    currentInput += num;
    updateDisplay();
}

function chooseOperator(op) {
    if (currentInput === '' && previousValue === null) return;
    if (previousValue === null) {
        previousValue = parseFloat(currentInput);
    } else if (currentInput !== '') {
        compute();
    }
    operator = op;
    currentInput = '';
    updateDisplay();
}

function compute() {
    if (operator === null || currentInput === '' || previousValue === null) return;
    const current = parseFloat(currentInput);
    let result;
    switch (operator) {
        case '+':
            result = previousValue + current;
            break;
        case '-':
            result = previousValue - current;
            break;
        case '*':
            result = previousValue * current;
            break;
        case '/':
            if (current === 0) {
                display.textContent = 'Error';
                setTimeout(clearAll, 1500);
                return;
            }
            result = previousValue / current;
            break;
        case '^':
            result = Math.pow(previousValue, current);
            break;
        default:
            return;
    }
    const expression = `${previousValue} ${operator} ${current} = ${result}`;
    addToHistory(expression);
    currentInput = result.toString();
    previousValue = null;
    operator = null;
    updateDisplay();
}

function applyPercentage() {
    if (currentInput === '') return;
    const value = parseFloat(currentInput) / 100;
    currentInput = value.toString();
    updateDisplay();
}

function applyScientific(action) {
    if (currentInput === '') return;
    const val = parseFloat(currentInput);
    let result;
    switch (action) {
        case 'sin':
            result = Math.sin(toRadians(val));
            break;
        case 'cos':
            result = Math.cos(toRadians(val));
            break;
        case 'tan':
            result = Math.tan(toRadians(val));
            break;
        case 'log':
            result = Math.log10(val);
            break;
        case 'sqrt':
            result = Math.sqrt(val);
            break;
        default:
            return;
    }
    const expression = `${action}(${val}) = ${result}`;
    addToHistory(expression);
    currentInput = result.toString();
    updateDisplay();
}

function toRadians(deg) {
    return deg * (Math.PI / 180);
}

// History handling
function addToHistory(entry) {
    history.unshift(entry);
    if (history.length > 20) history.pop();
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    history.forEach((item, idx) => {
        const li = document.createElement('li');
        li.textContent = item;
        li.dataset.idx = idx;
        li.addEventListener('click', () => restoreFromHistory(item));
        list.appendChild(li);
    });
}

function restoreFromHistory(entry) {
    // Expected format: "a op b = result" or "func(a) = result"
    const expr = entry.split('=')[0].trim();
    // Simple restore: place the left side into currentInput for editing
    currentInput = expr;
    previousValue = null;
    operator = null;
    updateDisplay();
}

// Theme handling
function loadTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    if (saved === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('dark');
        themeToggle.textContent = '🌙';
    }
}

function toggleTheme() {
    if (document.body.classList.contains('dark')) {
        document.body.classList.remove('dark');
        localStorage.setItem(THEME_KEY, 'light');
        themeToggle.textContent = '🌙';
    } else {
        document.body.classList.add('dark');
        localStorage.setItem(THEME_KEY, 'dark');
        themeToggle.textContent = '☀️';
    }
}

// Scientific mode handling
function loadScientificMode() {
    const saved = localStorage.getItem(SCI_MODE_KEY) === 'true';
    const sciContainer = document.querySelector('.scientific-buttons');
    if (saved) {
        sciContainer.classList.remove('hidden');
        sciToggle.textContent = '🔬✖';
    } else {
        sciContainer.classList.add('hidden');
        sciToggle.textContent = '🔬';
    }
}

function toggleScientificMode() {
    const sciContainer = document.querySelector('.scientific-buttons');
    const isHidden = sciContainer.classList.contains('hidden');
    if (isHidden) {
        sciContainer.classList.remove('hidden');
        localStorage.setItem(SCI_MODE_KEY, 'true');
        sciToggle.textContent = '🔬✖';
    } else {
        sciContainer.classList.add('hidden');
        localStorage.setItem(SCI_MODE_KEY, 'false');
        sciToggle.textContent = '🔬';
    }
}

// Button event listeners
const themeToggle = document.getElementById('theme-toggle');
const sciToggle = document.getElementById('scientific-toggle');

themeToggle.addEventListener('click', toggleTheme);
sciToggle.addEventListener('click', toggleScientificMode);

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const number = btn.dataset.number;
        const action = btn.dataset.action;
        if (number !== undefined) {
            appendNumber(number);
        } else if (action) {
            switch (action) {
                case 'clear':
                    clearAll();
                    break;
                case 'delete':
                    deleteLast();
                    break;
                case 'add':
                    chooseOperator('+');
                    break;
                case 'subtract':
                    chooseOperator('-');
                    break;
                case 'multiply':
                    chooseOperator('*');
                    break;
                case 'divide':
                    chooseOperator('/');
                    break;
                case 'equals':
                    compute();
                    break;
                case 'percentage':
                    applyPercentage();
                    break;
                case 'sin':
                case 'cos':
                case 'tan':
                case 'log':
                case 'sqrt':
                    applyScientific(action);
                    break;
                case 'power':
                    chooseOperator('^');
                    break;
            }
        }
    });
});

// Keyboard support
document.addEventListener('keydown', e => {
    if (e.repeat) return;
    const key = e.key;
    if (/[0-9]/.test(key)) {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber('.');
    } else if (key === '+' || key === '-') {
        chooseOperator(key);
    } else if (key === '*') {
        chooseOperator('*');
    } else if (key === '/' || key === '÷') {
        chooseOperator('/');
    } else if (key === '^') {
        chooseOperator('^');
    } else if (key === 'Enter' || key === '=') {
        compute();
    } else if (key === '%') {
        applyPercentage();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape') {
        clearAll();
    }
});

// Initialize
loadTheme();
loadScientificMode();
updateDisplay();
