const insurance = require('../Services/Insurance.js');

const InsuranceQuote = {

    post(req, res) {

        const params = req.body;

        insurance.quote(
            params.hasSpouse,
            params.numberOfChildren,
            res
        );

    }

};

module.exports = InsuranceQuote;