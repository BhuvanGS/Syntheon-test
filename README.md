# Meet – qmg-bzid-vxm Calculator

A lightweight, responsive web calculator that supports:

- Basic arithmetic (addition, subtraction, multiplication, division)
- Clean, accessible button layout
- Real‑time display of the current expression/result
- Graceful handling of division by zero (shows **Error**)
- Full keyboard input support (numbers, operators, Enter, Backspace, Escape)

## How to Run
1. Clone the repository.
2. Open `index.html` in any modern browser.
3. Use the mouse or your keyboard to perform calculations.

## Keyboard Shortcuts
| Key | Action |
|-----|--------|
| 0‑9 | Enter digit |
| `+` `-` `*` `/` | Operators |
| `Enter` or `=` | Evaluate |
| `Backspace` / `Delete` | Delete last character |
| `Escape` or `C` | Clear all |
| `.` or `,` | Decimal point |

## Design Decisions
- **No build tools** – pure HTML/CSS/JS for maximum portability.
- **Division‑by‑zero detection** is performed before evaluation to avoid `Infinity` results.
- **Function constructor** is used instead of `eval` to keep the evaluation sandboxed while still supporting the full expression syntax.
- **Responsive layout** works on mobile and desktop.

## License
MIT © 2026