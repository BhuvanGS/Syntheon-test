# Meet – bac-rter-gbu Calculator

A lightweight, web‑based calculator that implements the specifications agreed in the project meeting.

## Features
- Basic arithmetic: addition, subtraction, multiplication, division.
- Clean, minimal UI with a light theme.
- Large, easy‑to‑click buttons suitable for mouse, touch, and keyboard.
- Division‑by‑zero protection – displays `Error`.
- Full keyboard support (digits, operators, **Enter** for equals, **Esc** for clear, **Backspace** for delete).

## Project Structure
```
├── index.html   # HTML markup and button layout
├── style.css    # Light theme styling and responsive grid
├── script.js    # Calculator logic, error handling, keyboard integration
└── README.md    # Project documentation
```

## Running the Application
1. Clone the repository.
2. Open `index.html` in any modern browser.
3. Use the mouse or keyboard to perform calculations.

## Development Notes
- All code is vanilla JavaScript; no external dependencies.
- The calculator is responsive and works on mobile devices.
- Division by zero is caught in `script.js` and results in an `Error` message without crashing the app.
