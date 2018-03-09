/**
 * Configs
 */
const config = require('../../config.js');

const store = require('data-store')('my-app');

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
                console.log("Error: " + error);
                res.send("Sorry, something went wrong.");
            }

            const startDate = moment(params['date-start']);
            const endDate = moment(params['date-end']);

            let daysCovered = endDate.diff(startDate, 'days');

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

            if (!daysCovered) {
                daysCovered = 1;
            }

            let calculatedCover = parseFloat(comprehensive_insurance_quote.suggested_premium / endDate.daysInMonth() * daysCovered).toFixed(2);

            if (isNaN(calculatedCover)) {
                calculatedCover = parseFloat(comprehensive_insurance_quote.suggested_premium / 30 ).toFixed(2);
            }

            store.set('quotePackageId', body[0].quote_package_id);

            let responseMessage = "Comprehensive insurance will cost you R" + calculatedCover + " to be covered for " + daysCovered + " days. Do you agree to this once off cover price?";
            return res.json({
                speech: responseMessage,
                displayText: responseMessage,
                source: 'get-insurance-quote'
            });
        });
    },

    create(params, res){

        const options = {
            method: 'POST',
            headers: {
                Authorization: AUTHORIZATION
            },
            uri: encodeURI(ROOT_API_ENDPOINT + '/policyholders'),
            body: {
                id : {
                    type : "id",
                    number : params.ID ?  params.ID : null,
                    country : "ZA",
                },
                first_name : params.firstname ? params.firstname : null,
                last_name : params.surname ? params.surname : null,
            },
            json: true
        };

        request(options, function(error, response, body) {

            if (error) {
                console.log('Error: ' + error);
                res.send("Sorry, something went wrong.");
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