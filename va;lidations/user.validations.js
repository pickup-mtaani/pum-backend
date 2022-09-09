const Validator = require('validator');
const isEmpty = require('./isEmpty');
const { emailIsValid, } = require('./isEmail');
const { UpperCase, NumericalExists, isUpper, isSpecial } = require('./passwordValidator');
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
    // if (!isUpper(data.password)) {
    //     errors.password = 'Password Must contain Both Upper and Lower case Characters  ';
    // }
    // if (!isSpecial(data.password)) {
    //     errors.password = 'Password Must contain at least one special characters  ';
    // }

    // if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
    //     errors.password = 'Password must be more than 8 characters long';
    // }
    // if (!NumericalExists(data.password)) {
    //     errors.password = 'Password Must have at least one Numerical value';
    // }

    if (!Validator.isLength(data.phone_number, { min: 10, max: 14 })) {
        errors.phone_number = 'phone Number  must have at least  10 characters ';
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports.validateRiderRegisterInput = (data) => {
    let errors = {};

    data.rider_name = !isEmpty(data.rider_name) && data.rider_name !== undefined ? data.rider_name : '';
    data.email = !isEmpty(data.email) && data.email !== undefined ? data.email : '';
    data.phone_number = !isEmpty(data.phone_number) && data.phone_number !== undefined ? data.phone_number : '';
    data.password = !isEmpty(data.password) && data.password !== undefined ? data.password : '';

    if (!Validator.isLength(data.rider_name, { min: 2, max: 30 })) {
        errors.rider_name = 'Riders name must be between 2 to 30 chars';
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
module.exports.validateAdminRegisterInput = (data) => {
    let errors = {};

    data.name = !isEmpty(data.name) && data.name !== undefined ? data.name : '';
    data.email = !isEmpty(data.email) && data.email !== undefined ? data.email : '';
    data.phone_number = !isEmpty(data.phone_number) && data.phone_number !== undefined ? data.phone_number : '';
    data.password = !isEmpty(data.password) && data.password !== undefined ? data.password : '';

    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = 'Name must be between 2 to 30 chars';
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
    // if (!isUpper(data.password)) {
    //     errors.password = 'Password Must contain Both Upper and Lower case Characters  ';
    // }

    // if (!isSpecial(data.password)) {
    //     errors.password = 'Password Must contain at least one special characters  ';
    // }

    // if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
    //     errors.password = 'Password must be more than 8 characters long';
    // }
    // if (!NumericalExists(data.password)) {
    //     errors.password = 'Password Must have at least one Numerical value';
    // }

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
module.exports.validatePasswordInput = (data) => {
    let errors = {};
    data.new_password = !isEmpty(data.new_password) && data.new_password !== undefined ? data.new_password : '';
    data.confirm_password = !isEmpty(data.confirm_password) && data.confirm_password !== undefined ? data.confirm_password : '';

    if (Validator.isEmpty(data.new_password)) {
        errors.new_password = 'Password  field is required';
    }
    if (Validator.isEmpty(data.confirm_password)) {
        errors.password = 'password confirmation  field is required';
    }
    // if (!isUpper(data.new_password)) {
    //     errors.new_password = 'Password Must contain Both Upper and Lower case Characters  ';
    // }
    if (data.new_password !== data.confirm_password) {
        errors.new_password = 'Password Mismatch the confirm password  ';
    }
    // if (!isSpecial(data.new_password)) {
    //     errors.new_password = 'Password Must contain at least one special characters  ';
    // }

    // if (!Validator.isLength(data.new_password, { min: 8, max: 30 })) {
    //     errors.new_password = 'Password must be more than 8 characters long';
    // }
    // if (!NumericalExists(data.new_password)) {
    //     errors.new_password = 'Password Must have at least one Numerical value';
    // }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

