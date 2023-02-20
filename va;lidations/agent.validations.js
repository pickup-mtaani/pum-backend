const Validator = require('validator');
const isEmpty = require('./isEmpty');
const { emailIsValid, } = require('./isEmail');
const { UpperCase, NumericalExists, isUpper, isSpecial } = require('./passwordValidator');
module.exports.validateRegisterInput = (data) => {
    let errors = {};

    data.business_name = !isEmpty(data.business_name) && data.business_name !== undefined ? data.business_name : '';
    // data.l_business_name = !isEmpty(data.l_business_name) && data.l_business_name !== undefined ? data.l_business_name : '';
    data.email = !isEmpty(data.email) && data.email !== undefined ? data.email : '';
    data.phone_number = !isEmpty(data.phone_number) && data.phone_number !== undefined ? data.phone_number : '';
    data.password = !isEmpty(data.password) && data.password !== undefined ? data.password : '';

    // if (!Validator.isLength(data.business_name, { min: 2, max: 30 })) {
    //     errors.business_name = 'business_name must be between 2 to 30 chars';
    // }

    // if (Validator.isEmpty(data.phone_number)) {
    //     errors.phone_number = 'phone number  field is required';
    // }

    // if (!Validator.isLength(data.password, { min: 6, })) {
    //     errors.password = 'Password must be at least 6 characters';
    // }

    if (Validator.isEmpty(data.business_name)) {
        errors.business_name = 'Bussiness Name is required';
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



