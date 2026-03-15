// Calculator state
let expression = '';
const display = document.getElementById('display');

// Helper to update the display
function updateDisplay(value) {
    display.textContent = value;
}

// Clear all
function clearAll() {
    expression = '';
    updateDisplay('0');
}

// Delete last character
function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay(expression || '0');
}

// Evaluate the expression safely
function evaluateExpression() {
    if (!expression) return;
    try {
        // Replace unicode division/multiplication symbols with JS operators
        const sanitized = expression.replace(/÷/g, '/').replace(/×/g, '*');
        // Simple check for division by zero
        if (/\/0(?!\.)/.test(sanitized)) {
            throw new Error('Division by zero');
        }
        // Use Function constructor for safe evaluation (no eval)
        const result = Function(`'use strict'; return (${sanitized})`)();
        updateDisplay(result);
        expression = result.toString();
    } catch (e) {
        updateDisplay('Error: Division by zero');
        expression = '';
    }
}

// Append a character (number/operator) to the expression
function appendToExpression(char) {
    // Prevent multiple operators in a row
    const operators = '+-*/';
    const lastChar = expression.slice(-1);
    if (operators.includes(char) && operators.includes(lastChar)) {
        // Replace the last operator with the new one
        expression = expression.slice(0, -1) + char;
    } else {
        expression += char;
    }
    updateDisplay(expression);
}

// Button click handling
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-value');
        const action = btn.getAttribute('data-action');
        if (action === 'clear') {
            clearAll();
        } else if (action === 'delete') {
            deleteLast();
        } else if (action === 'equals') {
            evaluateExpression();
        } else if (value) {
            // Map display symbols to actual operators
            const map = { '÷': '/', '×': '*', '−': '-', '+': '+' };
            const char = map[value] || value;
            appendToExpression(char);
        }
    });
});

// Keyboard support
document.addEventListener('keydown', e => {
    const key = e.key;
    if (/[0-9]/.test(key)) {
        appendToExpression(key);
    } else if (['+', '-', '*', '/', '.'].includes(key)) {
        appendToExpression(key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        evaluateExpression();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape') {
        clearAll();
    }
});

// Initialize display
clearAll();