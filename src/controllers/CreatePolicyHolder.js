const insurance = require('../Services/Insurance.js');

const CreatePolicyHolder = {

    post(req, res) {

        const params = req.body;

        insurance.create(
            params.idNumber,
            params.firstName,
            params.lastName,
            res
        );

    }

};

module.exports = CreatePolicyHolder;