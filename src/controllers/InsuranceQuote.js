const insurance = require('../Services/Insurance.js');

const InsuranceQuote = {

    post(req, res) {

        const params = req.body.result.contexts[0].parameters;

        insurance.quote(
            params,
            res
        );

    }

};

module.exports = InsuranceQuote;