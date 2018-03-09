const insurance = require('../Services/Insurance.js');

const CreatePolicyHolder = {

    post(req, res) {

        const params = req.body.result.contexts[0].parameters;

        insurance.create(
            params,
            res
        );

    }

};

module.exports = CreatePolicyHolder;