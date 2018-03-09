/**
 * Configs
 */
const config = require('../../config.js');

const ROOT_API_ENDPOINT = config.ROOT_API_ENDPOINT;
const AUTHORIZATION = config.AUTHORIZATION;

const request = require('request-promise');

const Insurance = {

    quote(hasSpouse, numberOfChildren){
        const options = {
            method: 'POST',
            headers: {
                Authorization: AUTHORIZATION,
            },
            uri: encodeURI(ROOT_API_ENDPOINT + '/quotes'),
            body: {
                type: 'root_funeral',
                cover_amount: 5000000,
                has_spouse:  hasSpouse ? hasSpouse : false,
                number_of_children:  numberOfChildren ? numberOfChildren : 0,
            },
            json: true
        };

        request(options, function(error, response, body) {
            if (error) {
                res.send(error);
            }

            res.send(response.body)

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
    },

    create(idNumber, firstName, lastName, res){
        const options = {
            method: 'POST',
            headers: {
                Authorization: AUTHORIZATION
            },
            uri: encodeURI(ROOT_API_ENDPOINT + '/policyholders'),
            body: {
                id : {
                    type : "id",
                    number : idNumber ?  idNumber : null,
                    country : "ZA",
                },
                first_name : firstName ? firstName : null,
                last_name : lastName ? lastName : null,
            },
            json: true
        };

        request(options, function(error, response, body) {

            if (error) {
                console.log('Error: ' + error);
            }

            res.send(response.body);

        });
    }

};

module.exports = Insurance;