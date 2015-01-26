var assert = require("assert");

describe('ClusterServices', function () {

    //describe('install(options)', function () {
    //    it('成功链接到rabbitMQ服务器', function (done) {
    //        sails.services.cache.install()
    //            .then(function () {
    //                done();
    //            });
    //    });
    //});

    describe('publish(message)', function () {
        it('发布一条信息到MQ', function (done) {
            sails.services.cluster.publish({foo:'bar'})
                .then(function () {
                    done();
                });
        });
    });
});