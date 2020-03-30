export const regex = (regex, value) => {
    value = String(value).toLocaleLowerCase()
    if (!regex.test(value)) { return "Invalid Input"; }
}
export const email = (_, value) => {
    value = String(value).toLocaleLowerCase()
    var regExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regex(regExpression, value)) {
        return "Invalid email address";
    }
}

export const phone = (_, value) => {
    var regExpression = /^[0-9]{10}$/;
    // var reg=/^[a-zA-Z0-9]{}$/;
    if (regex(regExpression, value)) {
        return "Invalid phone number";
    }
}
export const number = (_, value) => {
    if (isNaN(value)) { return "invalid number"; }
}

export const string = (_, value) => {
    var firstChar = value.charAt(0);
    var regExpression = /^[a-zA-Z]$/;
    if (regex(regExpression, firstChar)) { return "invalid string"; }
}

export const noSpecialChar = (_, value) => {
    var regExpression = /^[a-zA-Z0-9]*$/;
    if (regex(regExpression, value)) {
        return "Invalid input";
    }
}

export const min = (_, min, value) => {
    if (value.length < min) { return "enter more characters"; }
}

export const max = (_, max, value) => {
    if (value.length > max) { return "you entered a lot of characters"; }
}

export const required = (_, value) => {
    if (value == "" || (value | '').length == 0) { return "this field is required"; }
}
export const passwordStrength = (_, value) => {
    var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
    var lowRegex = new RegExp("(?=.{6,}).*", "g");
    if (regex(lowRegex, value)) {
        return "enter more characters";
    }
    else if (!regex(mediumRegex, value)) {
        return "Medium";
    }
    else if (!regex(strongRegex, value)) {
        return "Strong Password";
    }
    else {
        return "Weak password";
    }
}
// export const validate = (lstOfTypes, value) => {
//     var isValid = true;
//     (lstOfTypes||[]).forEach(element => {
//         if (element == 'mail' && !validMail(value)) {
//             isValid = false;
//         }
//         else if (element == 'phone' && !validPhone(value)) {
//             isValid = false;

//         }
//         else if (element == 'number' && !isNum(value)) {
//             isValid = false;
//         }
//         else if (element == 'string' && !validString(value)) {
//             isValid = false
//         }
//         else if (element == 'no special char' && !noSpecialChar(value)) {
//             isValid = false
//         }
//         else if (element == 'passowrd' && !passwordStrength(value)) {
//             isValid = false
//         }
//     });
//     return isValid;
// }
