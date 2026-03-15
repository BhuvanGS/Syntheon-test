// script.js – Calculator core logic with keyboard support

(() => {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.btn');
  let expression = '';
  let lastResult = null;

  const updateDisplay = (value) => {
    display.value = value;
  };

  const clearAll = () => {
    expression = '';
    lastResult = null;
    updateDisplay('');
  };

  const backspace = () => {
    if (expression.length > 0) {
      expression = expression.slice(0, -1);
      updateDisplay(expression);
    }
  };

  const append = (char) => {
    // Prevent multiple operators in a row
    const operators = ['+', '-', '*', '/'];
    const lastChar = expression.slice(-1);
    if (operators.includes(char) && operators.includes(lastChar)) {
      // Replace the last operator with the new one
      expression = expression.slice(0, -1) + char;
    } else {
      expression += char;
    }
    updateDisplay(expression);
  };

  const evaluate = () => {
    if (!expression) return;
    try {
      // Replace division symbol if user typed '÷'
      const sanitized = expression.replace(/÷/g, '/');
      // Detect division by zero before eval
      if (/\/0(?!\d)/.test(sanitized)) {
        throw new Error('Division by zero');
      }
      // Use Function constructor instead of eval for a tiny sandbox
      // eslint-disable-next-line no-new-func
      const result = Function(`'use strict'; return (${sanitized})`)();
      if (!isFinite(result)) {
        throw new Error('Math error');
      }
      updateDisplay(result);
      expression = String(result);
      lastResult = result;
    } catch (e) {
      updateDisplay('Error');
      expression = '';
      lastResult = null;
    }
  };

  // Click handling
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      handleInput(key);
    });
  });

  // Keyboard handling
  const keyMap = {
    'Enter': 'Enter',
    '=': 'Enter',
    'Escape': 'Escape',
    'c': 'Escape',
    'C': 'Escape',
    'Backspace': 'Backspace',
    'Delete': 'Backspace',
    '+': '+',
    '-': '-',
    '*': '*',
    'x': '*',
    'X': '*',
    '/': '/',
    '÷': '/',
    '.': '.',
    ',': '.',
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9'
  };

  const handleInput = (key) => {
    switch (key) {
      case 'Escape':
        clearAll();
        break;
      case 'Backspace':
        backspace();
        break;
      case 'Enter':
        evaluate();
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        append(key);
        break;
      case '.':
        // Prevent multiple decimals in the current number segment
        const parts = expression.split(/[+\-*/]/);
        if (!parts[parts.length - 1].includes('.')) {
          append('.');
        }
        break;
      default:
        // Digits
        if (/^[0-9]$/.test(key)) {
          append(key);
        }
        break;
    }
  };

  document.addEventListener('keydown', (e) => {
    const mapped = keyMap[e.key];
    if (mapped) {
      e.preventDefault();
      handleInput(mapped);
    }
  });

  // Initialize display
  clearAll();
})();