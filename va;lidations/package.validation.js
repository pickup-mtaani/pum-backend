const Validator = require('validator');
const isEmpty = require('./isEmpty');
module.exports.validatePackageInput = (data) => {
    let errors = {};
  
    data.recipient_name = !isEmpty(data.recipient_name) && data.recipient_name !== undefined ? data.recipient_name : '';
    data.recipient_phone = !isEmpty(data.recipient_phone) && data.recipient_phone !== undefined ? data.recipient_phone : '';
    data.thrifter_id = !isEmpty(data.thrifter_id) && data.thrifter_id !== undefined ? data.thrifter_id : '';
    data.package_value = !isEmpty(data.package_value) && data.package_value !== undefined ? data.package_value : '';
    data.pack_color = !isEmpty(data.pack_color) && data.pack_color !== undefined ? data.pack_color : '';

    if (Validator.isEmpty(data.recipient_name)) {
        errors.recipient_name = 'Recipient  name is required ';
    }
    if (Validator.isEmpty(data.recipient_phone)) {
        errors.recipient_phone = 'Reciepients Phone Number  is required';
    }
    if (Validator.isEmpty(data.thrifter_id)) { 
        errors.thrifter_id = 'Select a Thrifter to continue';
    }
    if (Validator.isEmpty(data.package_value)) {
        errors.package_value = 'Specify the value of the package';
    }

    if (Validator.isEmpty(data.pack_color)) {
        errors.pack_color = 'Kindly select the color of the pack';
    }

   

    return {
        errors,
        isValid: isEmpty(errors)
    }
}