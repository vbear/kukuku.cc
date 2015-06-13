var assert = require("assert");

describe('CacheServices', function () {

    //describe('install(options)', function () {
    //    it('成功链接到Redis服务器', function (done) {
    //        sails.services.cache.install()
    //            .then(function () {
    //                assert(sails.services.cache.connection && sails.services.cache.connection.connected);
    //                done();
    //            });
    //    });
    //});

    describe('set(key, value, option)', function () {
        it('创建一个普通的字符串缓存', function (done) {
            sails.services.cache.set('test:simple:string', 'foo-bar', 60)
                .then(done)
                .catch(done);
        });

        it('创建一个JSON/Object的缓存', function (done) {
            sails.services.cache.set('test:simple:json', {foo: 'bar'}, 60)
                .then(done)
                .catch(done);
        });

        it('创建一个带有版本号的缓存', function (done) {
            sails.services.cache.set('test:simple:with:version:page', 'foo-bar-version', 60)
                .then(done)
                .catch(done);
        });

    });

    describe('get(key)', function () {
        it('获取普通的字符串缓存', function (done) {
            sails.services.cache.get('test:simple:string')
                .then(function (value) {
                    assert.equal(value, 'foo-bar');
                    done();
                })
                .catch(done);
        });

        it('获取JSON/Object字符串缓存', function (done) {
            sails.services.cache.get('test:simple:json')
                .then(function (value) {
                    assert.deepEqual(value, {foo: 'bar'});
                    done();
                })
                .catch(done);
        });

        it('获取一个带有版本号的缓存', function (done) {
            sails.services.cache.get('test:simple:with:version:page')
                .then(function (value) {
                    assert.equal(value, 'foo-bar-version');
                    done();
                })
                .catch(done);
        });

    });

    describe('flush(key)', function () {
        it('清除单个缓存', function (done) {
            sails.services.cache.flush('test:simple:string')
                .then(function () {
                    sails.services.cache.get('test:simple:string')
                        .then(function (value) {
                            assert.equal(value, null);
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });

        it('批量清除缓存', function (done) {
            sails.services.cache.flush('test:*')
                .then(function () {
                    sails.services.cache.get('test:simple:json')
                        .then(function (value) {
                            assert.equal(value, null);
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });

    });

});

