const Validator = require('validator');
const isEmpty = require('./isEmpty');
module.exports.validateBusinesInput = (data) => {
    let errors = {};
  
    data.name = !isEmpty(data.name) && data.name !== undefined ? data.name : '';
    data.what_u_sale = !isEmpty(data.what_u_sale) && data.what_u_sale !== undefined ? data.what_u_sale : '';
    data.category = !isEmpty(data.category) && data.category !== undefined ? data.category : '';
    
    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name is required ';
    }
    if (Validator.isEmpty(data.what_u_sale)) {
        errors.what_u_sale = 'Kindly specify your product ';
    }
    if (Validator.isEmpty(data.category)) { 
        errors.category = 'Select a category to continue';
    }
   

   

    return {
        errors,
        isValid: isEmpty(errors)
    }
}