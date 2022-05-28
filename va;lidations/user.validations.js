const Validator = require('validator');
const isEmpty = require('./isEmpty');
const { emailIsValid, } = require('./isEmail');
module.exports.validateRegisterInput = (data) => {
    let errors = {};
  
    data.f_name = !isEmpty(data.f_name) && data.f_name !== undefined ? data.f_name : '';
    data.l_name = !isEmpty(data.l_name) && data.l_name !== undefined ? data.l_name : '';
    data.email = !isEmpty(data.email) && data.email !== undefined ? data.email : '';
    data.phone_number = !isEmpty(data.phone_number) && data.phone_number !== undefined ? data.phone_number : '';
    data.password = !isEmpty(data.password) && data.password !== undefined ? data.password : '';

    if (!Validator.isLength(data.f_name, { min: 2, max: 30 })) {
        errors.f_name = 'First name must be between 2 to 30 chars';
    }
    if (Validator.isEmpty(data.l_name)) {
        errors.l_name = 'surname field is required';
    }
    if (Validator.isEmpty(data.phone_number)) {
        errors.phone_number = 'phone number  field is required';
    }

    if (!Validator.isLength(data.password, { min: 8, })) {
        errors.password = 'Password must be at least 8 characters';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }

    if (!Validator.isLength(data.phone_number, { min: 10, max: 14 })) {
        errors.phone_number = 'phone Number  must have at least  10 characters ';
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports.validateLoginInput = (data) => {
    let errors = {};

    data.phone_number = !isEmpty(data.phone_number) && data.phone_number !== undefined ? data.phone_number : '';
    data.password = !isEmpty(data.password) && data.password !== undefined ? data.password : '';
  
    if (Validator.isEmpty(data.phone_number)) {
        errors.phone_number = 'phone number  field is required';
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

