/**
 * Threads.js
 *
 * @description :: 贴子
 */
var fs = require('fs'),
    path = require('path'),
    gm = require('gm').subClass({imageMagick: true});

module.exports = {

    autoUpdatedAt: false,

    attributes: {
        uuid: {
            type: 'string',
            size: 64,
            required: true
        },
        uid: {
            type: 'string',
            size: 16,
            required: true
        },
        name: {
            type: 'string',
            defaultsTo: ''
        },
        email: {
            type: 'email'
        },
        title: {
            type: 'string',
            defaultsTo: ''
        },
        content: {
            type: 'string'
        },
        image: {
            model: 'attachment'
        },
        thumb: {
            model: 'attachment'
        },
        lock: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        sage: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        deleted: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        ip: {
            type: 'ip',
            required: true
        },
        forum: {
            model: 'forum'
        },
        parent: {
            type: 'integer',
            defaultsTo: 0
        },
        replyCount: {
            type: 'integer',
            defaultsTo: 0
        },
        recentReply: {
            type: 'array',
            defaultsTo: []
        },
        updatedAt: {
            type: 'datetime'
        }
    },

    /**
     * 检查主串状态
     * @param threadsId 串Id
     * @returns {Promise}
     */
    checkParentThreads: function (threadsId) {

        return new Promise(function (resolve, reject) {

            var threads = null;

            var threadsId = parseInt(threadsId);

            if (!threadsId) {
                return reject('threadsId不合法');
            }

            sails.models.threads.findOneById(threadsId)
                .then(function (threads) {

                    if (!threads) {
                        return reject('回复的主串不存在或者已被删除');
                    }

                    if (threads.deleted) {
                        return reject('回复的主串不存在或者已被删除');
                    }

                    if (threads.lock) {
                        return reject('回复的主串已经被锁定');
                    }

                    if (threads.parent) {
                        return reject('并不允许直接回应子串');
                    }

                    return sails.models.forum.findForumById(threads.forum);

                })
                .then(function (forum) {
                    forum.parentThreads = threads;
                })
                .catch(reject);

        });
    },

    /**
     * 发串时处理父串
     * @param parentThreads
     * @param newThreads
     * @returns {Promise}
     */
    handleParentThreads: function (parentThreads, newThreads) {

        return new Promise(function (resolve, reject) {

            if (!parentThreads) {
                return resolve();
            }

            if (!newThreads) {
                return reject('意料之外的方法调用');
            }

            var recentReply = parentThreads.recentReply;

            if (!_.isArray(recentReply)) {
                recentReply = [];
            }

            if (recentReply.length > 4) {
                recentReply.pop();
            }

            recentReply.unshift(newThreads.id);

            var map = {};
            map['recentReply'] = recentReply;
            map['replyCount'] = Number(Number(parentThreads['replyCount']) + 1);

            if (parentThreads.sage) {
                map['updatedAt'] = parentThreads.updatedAt;
            } else {
                map['updatedAt'] = new Date();
            }

            sails.models.threads
                .update({
                    id: parentThreads.id
                }, map)
                .then(function () {
                    resolve(null);
                })
                .catch(function (err) {
                    reject(err);
                });

        });
    }

};

