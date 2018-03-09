/**
 * Configs
 */
const config = require('../../config.js');

const ROOT_API_ENDPOINT = config.ROOT_API_ENDPOINT;
const AUTHORIZATION = config.AUTHORIZATION;

const request = require('request-promise');

const CreatePolicyHolder = {

    post(req, res) {

        const params = req.body;

        const options = {
            method: 'POST',
            headers: {
                Authorization: AUTHORIZATION,
            },
            uri: encodeURI(ROOT_API_ENDPOINT + '/policyholders'),
            form: {
                id : {
                    type : "id",
                    number : params.idNumber ?  params.idNumber : null,
                    country : "ZA",
                },
                first_name : params.firstName ? params.firstName : null,
                last_name : params.lastName ? params.lastName : null,
            },
            json: true
        };

        request(options, function(error, response, body) {

            if (error) {
                res.send(error);
            }

            res.send(response);

        });
    }

};

module.exports = CreatePolicyHolder;