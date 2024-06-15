const calculator = {
    display: '0',
    firstOp: null,
    wait: false, //indicate if waiting for the second operand
    operator: null,
};

//handle num input
function inputDigit(num) {
    const { display, wait } = calculator;

    if (wait) {
        calculator.display = num;
    } else {
        if (display === '0') {
            calculator.display = num;
        } else {
            calculator.display += num;
        }
    }
    calculator.wait = false; // reset wait
    update();
}

//handle decimal point input
function inputDecimal(dot) {
    if (calculator.wait) {
        calculator.display = '0.';
        calculator.wait = false;    //reset wait
    } else if (!calculator.display.includes(dot)) {
        calculator.display += dot; //append decimsl point
    }
    update();
}

//mapping operators 
const Calculate = {
    '/': (firstOp, secondOp) => firstOp / secondOp,
    '*': (firstOp, secondOp) => firstOp * secondOp,
    '+': (firstOp, secondOp) => firstOp + secondOp,
    '-': (firstOp, secondOp) => firstOp - secondOp,
    '%': (firstOp, secondOp) => firstOp % secondOp,
    '=': (firstOp, secondOp) => secondOp,
    '√': (operand) => Math.sqrt(operand),
};

//handle operator input
function Operators(nextOperator) {
    let { firstOp, display, operator } = calculator;
    const inputValue = parseFloat(display);

    if (operator && calculator.wait) {
        calculator.operator = nextOperator; // update if wait for secondOp
        return;
    }

//handling squareroot values
    if (nextOperator === '√') {
        const result = Math.sqrt(parseFloat(display));
        calculator.display = parseFloat(result.toFixed(7));
        calculator.firstOp = null;   //clear the first operand after square root
    } else {
        //handle operator inputs
        if (firstOp === null && !isNaN(inputValue)) { //setting first operand
            calculator.firstOp = inputValue;

        } else if (operator) {
            const result = Calculate[operator](firstOp, inputValue);
            calculator.display = parseFloat(result.toFixed(7));
            calculator.firstOp = result;
        }
    }
    calculator.wait = true;
    calculator.operator = nextOperator;
    update();
}

// reset the calc
function reset() {
    Object.assign(calculator, {
        display: '0',
        firstOp: null,
        wait: false,
        operator: null,
    });
    update();
}

//update the calc display
function update() {
    const displayy = document.querySelector('.calc-screen');
    displayy.value = calculator.display;
}

//handle button clicks
const keys = document.querySelector('.calc-keys');
keys.addEventListener('click', (event) => {
    const target = event.target
    if (!target.matches('button')) {
        return;
    }
    const value = target.value;
    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
        case '=':
        case '√':
            Operators(value);  //handle operator button click
            break;
        case '.':
            inputDecimal(value);    //handle decimal point button click
            break;
        case 'all-clear':
            reset();  //handle all-clear button click
            break;
        default:
            if (Number.isInteger(parseFloat(value))) {
                inputDigit(value);  //handle digit button click
            }
    }
});
update();  //update the display 

