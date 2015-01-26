var assert = require("assert");

describe('ForumModel', function () {

    describe('findForumById(id)', function () {
        it('通过ID获取一个版块信息', function (done) {
            sails.models.forum.findForumById(4)
                .then(function (forum) {
                    assert.equal(forum.name, '综合版1');
                    done();
                })
                .catch(done);
        });

        it('通过ID获取一个版块信息(通过缓存)', function (done) {
            sails.models.forum.findForumById(4)
                .then(function (forum) {
                    assert.equal(forum.name, '综合版1');
                    done();
                })
                .catch(done);
        });
    });

    describe('findForumByName(name)', function () {
        it('通过Name获取一个版块信息', function (done) {
            sails.models.forum.findForumByName('东方Project')
                .then(function (forum) {
                    assert.equal(forum.id, 5);
                    done();
                })
                .catch(done);
        });

        it('通过Name获取一个版块信息(通过缓存)', function (done) {
            sails.models.forum.findForumByName('东方Project')
                .then(function (forum) {
                    assert.equal(forum.id, 5);
                    done();
                })
                .catch(done);
        });
    });

    describe('getTopicCount(id)', function () {
        it('通过ID获取一个版块主串数目', function (done) {
            sails.models.forum.getTopicCount(4)
                .then(function (topicCount) {
                    console.log(topicCount);
                    done();
                })
                .catch(done);
        });
    });

});