/**
 * Configs
 * @type {string}
 */
const ROOT_API_ENDPOINT = 'https://sandbox.root.co.za/v1/insurance';
const CLIENT_ID = '42b7212c-1e38-11e8-a633-5b3f08f8ae37';
const CLIENT_SECRET = 'sandbox_ZDU0NzNiODctNzFmNC00NTk4LTgxZjktMGZhNmU1OTQ2MjQ1LndFQjFGRGd5cUNYdjhfTU8wdUplNE1ZNmRLY0VOSG50';
const AUTH_TOKEN = "Basic " + new Buffer(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64");

const request = require('request-promise');

const InsuranceQuote = {

    post: function (req, res) {

        //Extract the device name from the request object
        let device = req.body.result && req.body.result.parameters && req.body.result.parameters.device ? req.body.result.parameters.device : null;
        console.log(device);

        if (device !== null) {
            let reqUrl = encodeURI(ROOT_API_ENDPOINT + '/quotes');

            const options = {
                method: 'POST',
                headers: {
                    username: CLIENT_ID,
                    password: CLIENT_SECRET,
                    authorization: AUTH_TOKEN
                },
                uri: reqUrl,
                form: {
                    type: 'root_gadgets',
                    model_name: device
                },
                json: true
            };

            request(options, function(error, response, body) {
                if (error) {
                    res.send(error);
                }

                //Extract quotes from response
                let comprehensive_insurance_quote = body[0];
                let theft_insurance_quote = body[1];

                if (comprehensive_insurance_quote === undefined) {
                    //Send error result back to DialogFlow if device not found
                    let errorMessage = "I cannot seem to find any information on file for your device. I will give you a call shortly to resolve this";
                    return res.json({
                        speech: errorMessage,
                        displayText: errorMessage,
                        source: 'get-insurance-quote'
                    });
                }

                //Send comprehenisive insurance amount back to DialogFlow (Using suggested_premium value)
                let responseMessage = "Comprehensive insurance of your device will cost R" + comprehensive_insurance_quote.suggested_premium / 100.0 + " per month";
                return res.json({
                    speech: responseMessage,
                    displayText: responseMessage,
                    source: 'get-insurance-quote'
                });
            });
        }
    }

};

module.exports = InsuranceQuote;