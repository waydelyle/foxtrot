/**
 * Configs
 */
const config = require('../../config.js');

const ROOT_API_ENDPOINT = config.ROOT_API_ENDPOINT;
const AUTHORIZATION = config.AUTHORIZATION;

const request = require('request-promise');

const moment = require('moment');

const Insurance = {

    quote(params, res){
        const options = {
            method: 'POST',
            headers: {
                Authorization: AUTHORIZATION,
            },
            uri: encodeURI(ROOT_API_ENDPOINT + '/quotes'),
            body: {
                type: 'root_funeral',
                cover_amount: 5000000,
                has_spouse: false,
                number_of_children: 0,
            },
            json: true
        };

        request(options, function(error, response, body) {
            if (error) {
                res.send(error);
            }

            const startDate = moment(params['date-period-start']);
            const endDate = moment(params['date-period-end']);

            const daysCovered = endDate.diff(startDate, 'days');

            // console.log(moment(params).daysInMonth());
            console.log(daysCovered);

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

            const calculatedCover = parseFloat(comprehensive_insurance_quote.suggested_premium / endDate.daysInMonth() * daysCovered).toFixed(2);

            let responseMessage = "Comprehensive insurance will cost you R" + calculatedCover + " to be covered for " + daysCovered + " days. Do you agree to this once off cover price?";
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
    },

    agreed(params, res) {
        res.send({
            followupEvent : {
                // name : (params.agree === "yes") ? "agree_yes" : "agree_no",
                name : "agree_yes",
                data : {
                    test : "test"
                },
            },
        });
    }

};

module.exports = Insurance;