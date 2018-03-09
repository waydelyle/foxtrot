/**
 * Configs
 */
const config = require('../../config.js');

const ROOT_API_ENDPOINT = config.ROOT_API_ENDPOINT;
const AUTHORIZATION = config.AUTHORIZATION;

const request = require('request-promise');

const CreatePolicyHolder = {

    post(req, res) {

        let data = {};

        console.log(req.body);

        if (req.body) {

            const params = req.body;

            /*
             * DOC
             *
             * idNumber : required
             * firstName : required
             * lastName : required
             */
            data = {
                "id" : {
                    "type" : "id",
                    "number" : params.idNumber ? "" + params.idNumber : null,
                    // "number" : "9107075067086",
                    "country" : "ZA",
                },
                // "first_name" : params.firstName ? params.firstName : null,
                "first_name" : "Wayde",
                // "last_name" : params.lastName ? params.lastName : null,
                "last_name" : "Lyle",
            };

        }

        const reqUrl = encodeURI(ROOT_API_ENDPOINT + '/policyholders');

        res.send(data);

        const options = {
            method: 'POST',
            headers: {
                Authorization: AUTHORIZATION,
            },
            uri: reqUrl,
            form: data,
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