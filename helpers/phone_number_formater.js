
const Format_phone_number = (phone_number) => {
    let Refined
    if (phone_number.charAt(0) === "0") {
        let newPhone = phone_number.slice(1);
        Refined = "+254".concat(newPhone)
        return Refined
    }
    else if (phone_number.substring(0, 4) === "+254") {
        return phone_number
    }

}
module.exports = Format_phone_number