// Calculator state variables
const display = document.getElementById('display');
let currentInput = '';
let previousInput = '';
let operator = null;

function updateDisplay() {
  display.value = currentInput || '0';
}

function clearAll() {
  currentInput = '';
  previousInput = '';
  operator = null;
  updateDisplay();
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function appendNumber(num) {
  if (num === '.' && currentInput.includes('.')) return;
  currentInput += num;
  updateDisplay();
}

function chooseOperator(op) {
  if (currentInput === '' && previousInput === '') return;
  if (previousInput && currentInput) {
    compute();
  }
  operator = op;
  previousInput = currentInput;
  currentInput = '';
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
        // Division by zero handling
        display.value = 'Error';
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
  operator = null;
  previousInput = '';
  updateDisplay();
}

// Button click handling
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.number !== undefined) {
      appendNumber(btn.dataset.number);
    } else if (btn.dataset.action) {
      const action = btn.dataset.action;
      switch (action) {
        case 'clear':
          clearAll();
          break;
        case 'backspace':
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
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
    appendNumber(e.key);
  } else if (e.key === '+' ) {
    chooseOperator('+');
  } else if (e.key === '-' ) {
    chooseOperator('-');
  } else if (e.key === '*' ) {
    chooseOperator('*');
  } else if (e.key === '/' ) {
    chooseOperator('/');
  } else if (e.key === 'Enter' || e.key === '=') {
    compute();
  } else if (e.key === 'Backspace') {
    deleteLast();
  } else if (e.key === 'Escape') {
    clearAll();
  }
});

// Initialize display
updateDisplay();