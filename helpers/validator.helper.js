const validatePhone = (phone) => {
    let raw_phone_number = phone?.trim();
    let valid_phone_number = "";
    if (phone.startsWith("+254")) {
      valid_phone_number = raw_phone_number.replace("+254", "254");
    } else if (phone.startsWith("0")) {
      valid_phone_number = raw_phone_number.replace("0", "254");
    } else {
      valid_phone_number = raw_phone_number;
    }
  
    return valid_phone_number.replace(" ", "");
};
  
const validators = {
    validatePhone
}

module.exports = validators