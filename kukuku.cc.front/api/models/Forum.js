/**
 * Forum.js
 *
 * @description :: 版块
 */

module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        header: {
            type: 'text',
            required: true
        },
        lock: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        close: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        index: {
            type: 'array',
            defaultsTo: ['',0]
        },
        cooldown: {
            type: 'int',
            required: true,
            defaultsTo: 30
        }
    },

    /**
     * 通过ID获取单个版块信息
     * @param id 版块ID
     * @returns {Promise}
     */
    findForumById: function (id) {

        // id仅作为aliasesCacheKey重定向至findForumByName(因为findForumByName访问次数更多)
        return new Promise(function (resolve, reject) {

            if(!id){
                return reject('版块ID不合法')
            }

            var aliasesCacheKey = 'forum:id:' + id;

            // 通过缓存获得forum.name重新请求
            sails.services.cache.get(aliasesCacheKey)
                .then(sails.models.forum.findForumByName)
                .then(resolve)
                .catch(function (err) {

                    if(err !== null){
                        return res.serverError(err);
                    }

                    sails.models.forum.findOne()
                        .where({id: id})
                        .then(function (forum) {

                            resolve(forum);

                            // 缓存实体请求
                            var cacheKey = 'forum:name:' + encodeURIComponent(forum.name) + ':json';
                            return sails.services.cache.set(cacheKey, forum);
                        })
                        .then(function (forum) {
                            // 缓存别名请求
                            return sails.services.cache.set(aliasesCacheKey, forum.name);
                        })
                        .catch(reject);
                });

        });

    },

    /**
     * 通过版块名获取版块信息
     * @param name 版块名
     * @returns {Promise}
     */
    findForumByName: function (name) {

        return new Promise(function (resolve, reject) {

            if(!name){
                return reject('版块名不合法')
            }

            var cacheKey = 'forum:name:' + encodeURIComponent(name) + ':json';  // 避免数据传输中出现问题cacheKey中的中文encode

            // 直接通过cacheKey获得实体
            sails.services.cache.get(cacheKey)
                .then(resolve)
                .catch(function () {
                    sails.models.forum.findOne()
                        .where({name: name})
                        .then(function (forum) {

                            resolve(forum);

                            // 缓存实体请求
                            return sails.services.cache.set(cacheKey, forum);
                        })
                        .then(function (forum) {

                            // 缓存别名请求
                            var aliasesCacheKey = 'forum:id:' + forum.id;
                            return sails.services.cache.set(aliasesCacheKey, forum.name);
                        })
                        .catch(reject);
                });

        });
    },

    /**
     * 获取版块主串数目
     * @param id 版块ID
     * @returns {Promise}
     */
    getTopicCount: function(id){

        return new Promise(function (resolve, reject) {

            if(!id){
                return reject('版块ID不合法')
            }

            var cacheKey = 'forum:id:'+ id + ':count';

            sails.services.cache.get(cacheKey)
                .then(resolve)
                .catch(function(){

                    sails.models.threads.count()
                        .where({forum: id,parent: 0})
                        .then(resolve)
                        .catch(reject);

                });

        });

    }

};

