const config = require('../../config.js');

const ROOT_API_ENDPOINT = config.ROOT_API_ENDPOINT;
const AUTHORIZATION = config.AUTHORIZATION;

const request = require('request-promise');

const InsuranceQuote = {

    post(req, res) {

        const params = req.body;

        const options = {
            method: 'POST',
            headers: {
                Authorization: AUTHORIZATION,
            },
            uri: encodeURI(ROOT_API_ENDPOINT + '/quotes'),
            form: {
                type: 'root_funeral',
                cover_amount: 5000000,
                has_spouse:  params.hasSpouse ? params.hasSpouse : false,
                number_of_children:  params.numberOfChildren ? params.numberOfChildren : 0,
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

};

module.exports = InsuranceQuote;