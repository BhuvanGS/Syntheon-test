// Calculator Logic with Scientific Mode, History, Dark Mode & Persistence
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const historyList = document.getElementById('history-list');
const modeToggleBtn = document.querySelector('.mode-toggle');
const darkToggleBtn = document.querySelector('.dark-toggle');
const scientificContainer = document.querySelector('.scientific-buttons');

let expression = '';
let isScientific = false;
let isDark = false;
let history = [];

// ---------- Preference Persistence ----------
function loadPreferences() {
    const prefs = JSON.parse(localStorage.getItem('calcPrefs')) || {};
    isScientific = !!prefs.isScientific;
    isDark = !!prefs.isDark;
    history = prefs.history || [];
    if (isScientific) {
        scientificContainer.classList.remove('hidden');
        modeToggleBtn.textContent = 'Standard Mode';
    }
    if (isDark) {
        document.body.classList.add('dark');
    }
    updateHistoryUI();
}

function savePreferences() {
    const prefs = {
        isScientific,
        isDark,
        history
    };
    localStorage.setItem('calcPrefs', JSON.stringify(prefs));
}

// ---------- Display Handling ----------
function updateDisplay(value) {
    display.value = value;
}

function appendToExpression(char) {
    const operators = ['+', '-', '*', '/'];
    const lastChar = expression.slice(-1);
    // Prevent multiple consecutive operators (except for '-' which can denote negative)
    if (operators.includes(char) && operators.includes(lastChar) && !(char === '-' && lastChar !== '-')) {
        expression = expression.slice(0, -1) + char;
    } else {
        expression += char;
    }
    updateDisplay(expression);
}

function clearAll() {
    expression = '';
    updateDisplay('0');
}

// ---------- History ----------
function addToHistory(exp, result) {
    const entry = `${exp} = ${result}`;
    history.unshift(entry);
    if (history.length > 50) history.pop(); // keep list reasonable
    updateHistoryUI();
    savePreferences();
}

function updateHistoryUI() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.addEventListener('click', () => {
            // Restore expression part before '='
            const expr = item.split(' = ')[0];
            expression = expr;
            updateDisplay(expression);
        });
        historyList.appendChild(li);
    });
}

// ---------- Evaluation ----------
function evaluateExpression() {
    // Division‑by‑zero detection before eval
    const divZeroPattern = /\/\s*0(?!\d)/;
    if (divZeroPattern.test(expression)) {
        updateDisplay('Error: Division by zero');
        expression = '';
        return;
    }
    try {
        // Replace custom function names with Math equivalents
        let sanitized = expression
            .replace(/\bsin\(/g, 'Math.sin(')
            .replace(/\bcos\(/g, 'Math.cos(')
            .replace(/\btan\(/g, 'Math.tan(')
            .replace(/\blog\(/g, 'Math.log10(')
            .replace(/\bln\(/g, 'Math.log(')
            .replace(/\bsqrt\(/g, 'Math.sqrt(')
            .replace(/\+\+/g, '+')
            .replace(/\-\-/g, '+');
        const result = Function('"use strict";return (' + sanitized + ')')();
        updateDisplay(result);
        addToHistory(expression, result);
        expression = result.toString();
    } catch (e) {
        updateDisplay('Error');
        expression = '';
    }
}

// ---------- Mode & Theme Toggles ----------
function toggleScientificMode() {
    isScientific = !isScientific;
    if (isScientific) {
        scientificContainer.classList.remove('hidden');
        modeToggleBtn.textContent = 'Standard Mode';
    } else {
        scientificContainer.classList.add('hidden');
        modeToggleBtn.textContent = 'Scientific Mode';
    }
    savePreferences();
}

function toggleDarkMode() {
    isDark = !isDark;
    document.body.classList.toggle('dark', isDark);
    savePreferences();
}

// ---------- Input Handling ----------
function handleInput(key) {
    // Numeric & decimal
    if ((key >= '0' && key <= '9') || key === '.') {
        appendToExpression(key);
    }
    // Operators
    else if (['+', '-', '*', '/'].includes(key)) {
        appendToExpression(key);
    }
    // Scientific functions (mapped via data-key)
    else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(key)) {
        appendToExpression(key + '(');
    }
    // Evaluate
    else if (key === 'Enter') {
        evaluateExpression();
    }
    // Clear
    else if (key === 'Escape') {
        clearAll();
    }
    // Mode toggle (keyboard shortcut 'M')
    else if (key === 'ModeToggle' || key === 'm' || key === 'M') {
        toggleScientificMode();
    }
    // Dark toggle (keyboard shortcut 'D')
    else if (key === 'DarkToggle' || key === 'd' || key === 'D') {
        toggleDarkMode();
    }
}

// ---------- Event Listeners ----------
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        handleInput(key);
    });
});

// Keyboard handling
document.addEventListener('keydown', (e) => {
    const keyMap = {
        's': 'sin',
        'c': 'cos',
        't': 'tan',
        'l': 'log',
        'n': 'ln',
        'r': 'sqrt',
        'm': 'ModeToggle',
        'd': 'DarkToggle'
    };
    const allowed = ['0','1','2','3','4','5','6','7','8','9','.', '+', '-', '*', '/', 'Enter', 'Escape'];
    if (allowed.includes(e.key)) {
        e.preventDefault();
        handleInput(e.key);
    } else if (keyMap[e.key]) {
        e.preventDefault();
        handleInput(keyMap[e.key]);
    }
});

// Mode & Dark toggle button clicks
modeToggleBtn.addEventListener('click', toggleScientificMode);
darkToggleBtn.addEventListener('click', toggleDarkMode);

// Initialize
loadPreferences();
clearAll();
