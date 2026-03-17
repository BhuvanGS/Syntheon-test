// Calculator state
let display = document.getElementById('display');
let currentInput = '';
let previousValue = null;
let operator = null;

function updateDisplay() {
    display.textContent = currentInput || '0';
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
                // Reset after short delay
                setTimeout(clearAll, 1500);
                return;
            }
            result = previousValue / current;
            break;
        default:
            return;
    }
    currentInput = result.toString();
    previousValue = null;
    operator = null;
    updateDisplay();
}

// Button event listeners
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
    } else if (key === 'Enter' || key === '=') {
        compute();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape') {
        clearAll();
    }
});

// Initialize display
updateDisplay();