
const InsuranceQuote = require('./InsuranceQuote');
const CreatePolicyHolder = require('./CreatePolicyHolder');
const Agreed = require('./Agreed');

const Route = {

    route: function (request, response) {
        switch (request.body.result.metadata.intentName) {
            case "get_case":
                InsuranceQuote.post(request, response);
                break;
            case "agree":
                Agreed.post(request, response);
                break;
            case "get_personal":
                CreatePolicyHolder.post(request, response);
                break;
            default:
                break;
        }
    }

};

module.exports = Route;