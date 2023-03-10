const credentials = {
    // apiKey: '84fac51ff8e918a3120fc417469c7cfb86dfb5bd1b6bb71abde77fb7c111c73a',         // use your sandbox app API key for development in the test environment
    // username: 'PikUpMtaani',  
    apiKey: '84fac51ff8e918a3120fc417469c7cfb86dfb5bd1b6bb71abde77fb7c111c73a',         // use your sandbox app API key for development in the test environment
    username: 'pmtaani',
    // use 'sandbox' for development in the test environment
};
const africastalking = require('africastalking')(credentials);

// Initialize a service e.g. SMS
const sms = africastalking.SMS
module.exports.SendMessage = async (data) => {

    try {
        const options = {
            to: [`${data.address}`],
            message: `${data.Body}`,
            from: "PikUpMtaani",
        }
        let r = await sms.send(options)
        console.log(r)
    } catch (error) {
        console.log(error)

    }
}

// module.exports = sendMessage