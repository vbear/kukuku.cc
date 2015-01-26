var assert = require("assert");
var request = require('supertest');

describe('HomepageController', function () {

    describe('index(req, res)', function () {
        it('访问首页', function (done) {
            request(sails.hooks.http.app)
                .get('/')
                .expect(200,done);
        });
    });



});