const Home = {

    get: function (request, response) {
        response.send('Welcome home.');
    }

};

module.exports = Home;