// Calculator Logic
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let expression = '';

function updateDisplay(value) {
    display.value = value;
}

function appendToExpression(char) {
    // Prevent multiple consecutive operators
    const operators = ['+', '-', '*', '/'];
    const lastChar = expression.slice(-1);
    if (operators.includes(char) && operators.includes(lastChar)) {
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

function evaluateExpression() {
    // Simple division‑by‑zero detection before eval
    const divZeroPattern = /\/\s*0(?!\d)/;
    if (divZeroPattern.test(expression)) {
        updateDisplay('Error');
        expression = '';
        return;
    }
    try {
        // Use Function constructor for safe evaluation of arithmetic only
        // Replace any accidental multiple operators (e.g., '--') with a single '-'
        const sanitized = expression.replace(/\+\+/g, '+').replace(/\-\-/g, '+');
        const result = Function('"use strict";return (' + sanitized + ')')();
        updateDisplay(result);
        expression = result.toString();
    } catch (e) {
        updateDisplay('Error');
        expression = '';
    }
}

// Button click handling
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        handleInput(key);
    });
});

// Keyboard handling
document.addEventListener('keydown', (e) => {
    const allowedKeys = ['0','1','2','3','4','5','6','7','8','9','.', '+', '-', '*', '/', 'Enter', 'Escape'];
    if (allowedKeys.includes(e.key)) {
        e.preventDefault();
        handleInput(e.key);
    }
});

function handleInput(key) {
    if (key >= '0' && key <= '9' || key === '.') {
        appendToExpression(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendToExpression(key);
    } else if (key === 'Enter') {
        evaluateExpression();
    } else if (key === 'Escape') {
        clearAll();
    }
}

// Initialize display
clearAll();