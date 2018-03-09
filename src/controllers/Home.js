const Home = {

    get: function (request, response) {
        response.send('About this wiki');
    }

};

module.exports = Home;