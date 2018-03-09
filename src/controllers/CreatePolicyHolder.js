/**
 * Configs
 */
const config = require('../../config.js');

const ROOT_API_ENDPOINT = config.ROOT_API_ENDPOINT;
const AUTHORIZATION = config.AUTHORIZATION;

const request = require('request-promise');

const CreatePolicyHolder = {

    post(req, res) {
        //Extract the device name from the request object
        let device = req.body.result && req.body.result.parameters && req.body.result.parameters.device ? req.body.result.parameters.device : null;

        if (device !== null) {
            let reqUrl = encodeURI(ROOT_API_ENDPOINT + '/policyholders');

            const options = {
                method: 'POST',
                headers: {
                    Authorization: AUTHORIZATION,
                },
                uri: reqUrl,
                form: {
                    type: 'root_gadgets',
                    model_name: device
                },
                json: true
            };

            request(options, function(error, response, body) {
                res.send(response);
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

module.exports = CreatePolicyHolder;