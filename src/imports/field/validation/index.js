import {isString, isNumber} from 'lodash'
import moment from 'moment';

export const regex = regex=> value => {
    value = String(value).toLocaleLowerCase()
    if (!regex.test(value)) { return "Invalid Input"; }
}
export const email = _ => (value) => {
    // value = String(value).toLocaleLowerCase()
    var regExpression = /[a-z_.0-9]{3,}@[a-z]{4,}\.[a-z]{2,3}/;
    if (regex(regExpression)(value)) {
      return "Invalid email address";
    }
}

export const phone = _ => (value) => {
    var regExpression=/^[0-9]{10}$/;
    // var reg=/^[a-zA-Z0-9]{}$/;
    if(regex(regExpression)(value)){
        return "Invalid phone number";
    }
}
export const number = _ => (value) => {
    return isNumber(Number(value)) ?  undefined: "Invalid number"
}

export const string = _=>(value) => {
    var regExpression = /^[A-Za-z ,.]+$/;
    if(regex(regExpression)(value)){
        return "Invalid Text";
    }
    // console.log(isString(value))

    // return isString(value) ? undefined:"Invalid Text"
}
export const noSpecialChar = _=>(value) => {
    var regExpression = /^[a-zA-Z0-9]*$/;
    if(regex(regExpression)(value)){
        return "Invalid input";
    }
}
export const minLength= min => value=>{
    if(value.length<min)
    {return `Input cannot be less than ${min} character`;}
}
export const maxLength= max=>value=>{
    if(value.length>max)
    {return `Input cannot be more than ${max} character`;}
}
export const minNumber= min=>value=>((Number(value)>Number(min)) ? undefined:`Input should be greater than ${min}`)
export const maxNumber= max=>value=>((Number(value)<= Number(max)) ? undefined:`Input should be less or equal than ${max}`)

export const required=_=>(value)=>{
    // console.log(value, isEmpty(value)) 
    return (String(value)) ? undefined:"This Field is Required"
}
export const passwordStrength = _=>(value) => {
    var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
    var lowRegex = new RegExp("(?=.{6,}).*", "g");
    if(regex(lowRegex)(value))
    {
        return "enter more characters";
    }
    else if(!regex(mediumRegex)(value))
    {
        return "Medium";
    }
    else if(!regex(strongRegex)(value))
    {
        return "Strong Password";
    }
    else
    {
        return "Weak password";
    }
}

export const Date =_ => (value)=>{
    return moment(value).isValid() ? undefined:"Invalid Date"
}
export const before_today =_ => (value)=>{
    let today = moment()
     if(moment( value).isBefore(today,'day') )
     {
     return  "please choose incoming date"
     }
     return undefined

}
