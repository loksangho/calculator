function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(op, a, b) {
    switch (op) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        default:
            return 0;
    }
}

function getNumDigitLength(num) {
    let num_length = 0;
    if (Math.trunc(num) == 0) {
        num_length = 1;
    }
    num_length = Math.log(Math.trunc(num)) * Math.LOG10E + 1 | 0;
    return num_length;
}

function truncateNumber(num, length) {
    let num_length = getNumDigitLength(num);
    let dec_length = length - num_length;
    let res_num = (Math.floor(num * Math.pow(10, dec_length)) / Math.pow(10, dec_length)).toFixed(dec_length);
    return parseFloat(res_num);
}

let display_value = 0;

let first_num = null;
let current_op = '';
let current_add_op;
let restart_num_entry = true;
let first_multiplier = null;
const LENGTH_OF_DISPLAY = 10;
let floatBool = false;
let add_op_show_current_sum = true;
let equal_button_pressed = false;

function handleButtonPressed(button_pressed) {
    switch (button_pressed) {
        case '+':
        case '-':
            if (first_num == null) {
                first_num = 0;
            }
            if (add_op_show_current_sum) {
                first_num = first_num + display_value;
            }
            if (first_multiplier != null) {
                first_num = operate(current_op, first_num, first_multiplier);
            }
            document.getElementsByClassName("display_box")[0].textContent = truncateNumber(first_num, LENGTH_OF_DISPLAY);
            first_multiplier = null;
            current_op = button_pressed;
            current_add_op = current_op;
            restart_num_entry = true;
            equal_button_pressed = false;
            break;
        case '*':
        case '/':
            current_op = button_pressed;
            if (first_multiplier == null) {
                first_multiplier = display_value;
            } else {
                first_multiplier = operate(current_op, first_multiplier, display_value);
            }
            equal_button_pressed = false;
            restart_num_entry = true;
            break;
        case '=':
            let res = 0;
            if (display_value == 0 && current_op == '/') {
                document.getElementsByClassName("display_box")[0].textContent = "ERROR";
                restart_num_entry = true;
                break;
            }
            if (first_num == null || (first_num != null && first_multiplier == null)) {
                if (first_multiplier != null) {

                    res = operate(current_op, first_multiplier, display_value);
                    document.getElementsByClassName("display_box")[0].textContent = truncateNumber(res, LENGTH_OF_DISPLAY);
                } else {
                    res = operate(current_op, first_num, display_value)
                    document.getElementsByClassName("display_box")[0].textContent = truncateNumber(res, LENGTH_OF_DISPLAY);

                }
            } else if (first_num != null && first_multiplier != null) {
                res = operate(current_add_op, first_num, operate(current_op, first_multiplier, display_value));
                document.getElementsByClassName("display_box")[0].textContent = truncateNumber(res, LENGTH_OF_DISPLAY);
            }
            first_num = null;
            add_op_show_current_sum = false;
            restart_num_entry = true;
            equal_button_pressed = true;
            first_multiplier = null;
            display_value = truncateNumber(parseFloat(res), LENGTH_OF_DISPLAY);
            break;
        case 'BKSP':
            if (!restart_num_entry) {
                let new_value;
                if (getNumDigitLength(display_value) == 1) {
                    new_value = 0;
                } else {
                    new_value = Math.trunc(display_value / 10);
                }
                display_value = new_value;

            } else {
                display_value = 0;
            }
            document.getElementsByClassName("display_box")[0].textContent = display_value;

            break;
        case 'CE':
            first_num = null;
            current_op = '';
            current_add_op = '';
            first_multiplier = null;
            add_op_show_current_sum = true;
            document.getElementsByClassName("display_box")[0].textContent = '0';
            restart_num_entry = true;
            break;
        case '.':
            if (restart_num_entry == false && Math.trunc(display_value) == display_value) {
                let textContent = document.getElementsByClassName("display_box")[0].textContent;
                textContent += button_pressed;
                display_value = parseFloat(textContent);
                document.getElementsByClassName("display_box")[0].textContent = textContent;
                floatBool = true;
            }
            restart_num_entry = false;
            break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            let textContent = document.getElementsByClassName("display_box")[0].textContent;
            if (equal_button_pressed) {
                first_num = null;
                first_multiplier = null;
                equal_button_pressed = false;
            }
            if (restart_num_entry) {
                display_value = 0;
                floatBool = false;
                textContent = '';
            }
            if (getNumDigitLength(display_value) > LENGTH_OF_DISPLAY - 5) {
                document.getElementsByClassName("display_box")[0].textContent = display_value;
                restart_num_entry = false;
                break;
            }
            textContent += button_pressed;
            display_value = truncateNumber(parseFloat(textContent), LENGTH_OF_DISPLAY);
            document.getElementsByClassName("display_box")[0].textContent = display_value;
            add_op_show_current_sum = true;
            restart_num_entry = false;
            break;
        default:
            break;

    }
}


window.addEventListener("click", function (e) {

    let button_pressed = e.target.innerText;

    handleButtonPressed(button_pressed);

})

window.addEventListener("keydown", function(e) {
    let button_pressed;
    switch(e.key) {
        case "Backspace":
            button_pressed = "BKSP";
            break;
        case "Enter":
            button_pressed = "=";
            break;
        case "Delete":
            button_pressed = "CE";
            break;
        default:
            button_pressed = e.key;   
            break;
    }
    
    handleButtonPressed(button_pressed);
})
