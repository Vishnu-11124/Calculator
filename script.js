let display = document.getElementById('display');
let currentInput = '0';
let operator = null;
let previousInput = null;
let shouldResetDisplay = false;

// Initialize calculator
function init() {
    updateDisplay();
    addKeyboardSupport();
}

// Update display with current input
function updateDisplay() {
    display.textContent = currentInput;
}

// Add button press animation
function animateButton(button) {
    button.classList.add('pressed');
    setTimeout(() => {
        button.classList.remove('pressed');
    }, 200);
}

// Clear display and reset calculator
function clearDisplay() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    shouldResetDisplay = false;
    display.classList.remove('error');
    updateDisplay();
}

// Delete last character
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Append number or operator to display
function appendToDisplay(value) {
    // Handle operators
    if (['+', '-', '*', '/', '%'].includes(value)) {
        handleOperator(value);
        return;
    }
    
    // Handle decimal point
    if (value === '.') {
        if (currentInput.includes('.')) {
            return; // Don't allow multiple decimal points
        }
        if (shouldResetDisplay) {
            currentInput = '0.';
            shouldResetDisplay = false;
        } else {
            currentInput += '.';
        }
        updateDisplay();
        return;
    }
    
    // Handle numbers
    if (shouldResetDisplay) {
        currentInput = value;
        shouldResetDisplay = false;
    } else {
        if (currentInput === '0') {
            currentInput = value;
        } else {
            currentInput += value;
        }
    }
    
    // Limit display length to prevent overflow
    if (currentInput.length > 12) {
        return;
    }
    
    updateDisplay();
}

// Handle operator input
function handleOperator(op) {
    if (operator && !shouldResetDisplay) {
        calculate();
    }
    
    operator = op;
    previousInput = currentInput;
    shouldResetDisplay = true;
}

// Perform calculation
function calculate() {
    if (operator && previousInput !== null) {
        try {
            let result;
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            
            // Handle division/modulo by zero
            if ((operator === '/' || operator === '%') && current === 0) {
                showError('Cannot divide by zero');
                return;
            }
            
            // Perform calculation based on operator
            switch (operator) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    result = prev / current;
                    break;
                case '%':
                    result = prev % current;
                    break;
                default:
                    return;
            }
            
            // Handle result formatting
            if (isNaN(result) || !isFinite(result)) {
                showError('Invalid calculation');
                return;
            }
            
            // Format result to prevent floating point errors
            result = formatResult(result);
            
            currentInput = result.toString();
            operator = null;
            previousInput = null;
            shouldResetDisplay = true;
            
            // Add success animation
            document.querySelector('.calculator').classList.add('success');
            setTimeout(() => {
                document.querySelector('.calculator').classList.remove('success');
            }, 600);
            
            updateDisplay();
            
        } catch (error) {
            showError('Calculation error');
        }
    }
}

// Format result to handle floating point precision
function formatResult(num) {
    // Round to 10 decimal places to handle floating point precision issues
    const rounded = Math.round(num * 10000000000) / 10000000000;
    
    // If it's a whole number, return as integer
    if (rounded % 1 === 0) {
        return Math.round(rounded);
    }
    
    // Otherwise return the rounded number
    return rounded;
}

// Show error message
function showError(message) {
    currentInput = message;
    display.classList.add('error');
    updateDisplay();
    
    // Reset after 2 seconds
    setTimeout(() => {
        clearDisplay();
    }, 2000);
}

// Add keyboard support
function addKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
        e.preventDefault();
        
        // Numbers
        if (e.key >= '0' && e.key <= '9') {
            appendToDisplay(e.key);
            animateButton(document.querySelector(`[onclick="appendToDisplay('${e.key}')"]`));
        }
        
        // Decimal point
        if (e.key === '.') {
            appendToDisplay('.');
            animateButton(document.querySelector(`[onclick="appendToDisplay('.')"]`));
        }
        
        // Operators
        if (e.key === '+') {
            appendToDisplay('+');
            animateButton(document.querySelector(`[onclick="appendToDisplay('+')"]`));
        }
        if (e.key === '-') {
            appendToDisplay('-');
            animateButton(document.querySelector(`[onclick="appendToDisplay('-')"]`));
        }
        if (e.key === '*') {
            appendToDisplay('*');
            animateButton(document.querySelector(`[onclick="appendToDisplay('*')"]`));
        }
        if (e.key === '/') {
            appendToDisplay('/');
            animateButton(document.querySelector(`[onclick="appendToDisplay('/')"]`));
        }
        if (e.key === '%') {
            appendToDisplay('%');
            animateButton(document.querySelector(`[onclick="appendToDisplay('%')"]`));
        }
        
        // Enter or equals
        if (e.key === 'Enter' || e.key === '=') {
            calculate();
            animateButton(document.querySelector('[onclick="calculate()"]'));
        }
        
        // Escape or clear
        if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
            clearDisplay();
            animateButton(document.querySelector('[onclick="clearDisplay()"]'));
        }
        
        // Backspace
        if (e.key === 'Backspace') {
            deleteLast();
            animateButton(document.querySelector('[onclick="deleteLast()"]'));
        }
    });
}

// Add click animations to all buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            animateButton(button);
        });
    });
    
    init();
});

// Handle window resize for responsive design
window.addEventListener('resize', () => {
    // Recalculate display size if needed
    const display = document.getElementById('display');
    const displayText = display.textContent;
    
    // If text is too long, try to fit it
    if (displayText.length > 10) {
        display.style.fontSize = '2rem';
    } else {
        display.style.fontSize = '';
    }
});
