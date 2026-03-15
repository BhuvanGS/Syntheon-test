// Calculator state
let currentInput = '';
let previousInput = '';
let operator = null;
const display = document.getElementById('display');

function updateDisplay() {
    display.textContent = currentInput || previousInput || '0';
}

function clearAll() {
    currentInput = '';
    previousInput = '';
    operator = null;
    updateDisplay();
}

function appendNumber(num) {
    // Prevent multiple leading zeros
    if (currentInput === '0' && num === '0') return;
    // Prevent multiple decimals
    if (num === '.' && currentInput.includes('.')) return;
    currentInput += num;
    updateDisplay();
}

function chooseOperator(op) {
    if (currentInput === '' && previousInput === '') return;
    if (operator && currentInput) {
        compute();
    }
    operator = op;
    if (currentInput) {
        previousInput = currentInput;
        currentInput = '';
    }
    updateDisplay();
}

function compute() {
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(curr)) return;
    let result;
    switch (operator) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '*':
            result = prev * curr;
            break;
        case '/':
            if (curr === 0) {
                display.textContent = 'Error';
                currentInput = '';
                previousInput = '';
                operator = null;
                return;
            }
            result = prev / curr;
            break;
        default:
            return;
    }
    currentInput = result.toString();
    previousInput = '';
    operator = null;
    updateDisplay();
}

function handleButtonClick(e) {
    const key = e.target.getAttribute('data-key');
    if (!key) return;
    processInput(key);
}

function handleKeyDown(e) {
    const allowedKeys = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','Enter','Backspace','Escape'];
    if (!allowedKeys.includes(e.key)) return;
    e.preventDefault();
    processInput(e.key);
}

function processInput(key) {
    if (key >= '0' && key <= '9' || key === '.') {
        appendNumber(key);
    } else if (['+','-','*','/'].includes(key)) {
        chooseOperator(key);
    } else if (key === 'Enter') {
        if (operator && currentInput) compute();
    } else if (key === 'Backspace' || key === 'Escape') {
        clearAll();
    }
}

// Event listeners
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', handleButtonClick);
});

document.addEventListener('keydown', handleKeyDown);

// Initialize display
updateDisplay();