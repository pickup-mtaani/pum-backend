
const Format_phone_number = (phone_number) => {
    console.log(phone_number)
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
const Inv_Format_phone_number = (phone_number) => {
    let Refined
    phone_number.substring(0, 3) === "254"
    let newPhone = phone_number.slice(0, 4);
    Refined = "0".concat(newPhone)
    return Refined


}
module.exports = Format_phone_number