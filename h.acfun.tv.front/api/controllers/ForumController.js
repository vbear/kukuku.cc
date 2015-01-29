/**
 * ForumController
 *
 * @module      :: Controller
 * @description    :: 版块
 */

module.exports = {


    /**
     * 获取版块页面
     * @route /:forum(.format)?page=?&pagesize=?
     * @key forum:id:version:pagesize:page:type
     */
    index: function (req, res) {

        var result = {
            forum: {},
            data: {},
            page: {},
            code: 200,
            success: true
        };

        sails.models.forum.findForumByName(req.params.forum)
            .then(function (forum) {

                if (!forum || !forum.name) {
                    return res.notFound('版块不存在');
                }

                if (forum.close) {
                    return res.notFound('版块已被关闭');
                }

                forum['createdAt'] = (forum['createdAt']) ? new Date(forum['createdAt']).getTime() : null;
                forum['updatedAt'] = (forum['updatedAt']) ? new Date(forum['updatedAt']).getTime() : null;

                result.forum = forum;

                return sails.models.forum.getTopicCount(forum.id);
            })
            .then(function (topicCount) {

                var pageSize = parseInt(req.query.pagesize || 10);
                var pageIndex = parseInt(req.query.page || 1);
                var pageCount = Math.ceil(topicCount / 10) || 1;
                pageCount > 200 ? pageCount = 200 : '';

                result.page = {
                    title: result.forum.name,
                    page: pageIndex,
                    size: pageSize,
                    count: pageCount
                };

                req.wantType = sails.services.tool.checkWantType(req.params.format);
                req.cacheKey = 'forum:' + forum.id + ':version:' + pageSize + ':' + pageIndex + req.wantType.suffix;

                // 获得缓存，如果获得失败那么尝试直接获取。
                sails.services.cache.get(req.cacheKey)
                    .then(function (cache) {
                        if (req.wantType.param == 'json') {
                            return sails.config.jsonp ? res.jsonp(JSON.parse(cache)) : res.json(JSON.parse(cache));
                        } else {
                            return res.send(200, cache);
                        }
                    })
                    .catch(function (err) {

                        if (err !== null) {
                            return res.serverError(err);
                        }

                        // 获取所有主题帖
                        sails.models.threads.find()
                            .where({
                                forum: result.forum.id,
                                parent: 0
                            })
                            .sort({
                                updatedAt: 1,
                                top: 1
                            })
                            .paginate({
                                page: pageIndex,
                                limit: pageSize
                            })
                            .then(function (rawTopics) {

                                var handledTopics = [];
                                var replyIds = [];

                                _.forEach(rawTopics, function (rawTopic) {

                                    if (rawTopic.recentReply && _.isArray('rawTopic') && rawTopic.recentReply.length > 0) {
                                        replyIds = replyIds.concat(rawTopic.recentReply);
                                    }

                                    delete rawTopic['ip'];
                                    rawTopic['createdAt'] = (rawTopic['createdAt']) ? new Date(rawTopic['createdAt']).getTime() : null;
                                    rawTopic['updatedAt'] = (rawTopic['updatedAt']) ? new Date(rawTopic['updatedAt']).getTime() : null;

                                    handledTopics.push(rawTopic);

                                });

                                _.forEach(replyIds, function (replyId, i) {
                                    replyIds[i] = parseInt(replyId);
                                });

                                if (replyIds.length == 0) {
                                    return [];
                                }

                                result.data.threads = handledTopics;

                                // 获取所有回复贴
                                return sails.models.threads.find()
                                    .where({
                                        id: replyIds
                                    });

                            })
                            .then(function (rawReplies) {

                                var handledReplies = {};

                                _.forEach(rawReplies, function (rawReply) {

                                    if (!rawReply) {
                                        return false;
                                    }

                                    delete rawReply['ip'];
                                    delete rawReply['recentReply'];
                                    rawReply['createdAt'] = (rawReply['createdAt']) ? new Date(rawReply['createdAt']).getTime() : null;
                                    rawReply['updatedAt'] = (rawReply['updatedAt']) ? new Date(rawReply['updatedAt']).getTime() : null;

                                    handledReplies['t' + rawReply.id] = rawReply;

                                });

                                result.data.replies = handledReplies;

                                return result;
                            })
                            .then(function (result) {
                                return res.generateResult(result, {
                                    desktopView: 'desktop/forum/index',
                                    mobileView: 'mobile/forum/index'
                                });
                            });

                    });

            })
            .catch(function (err) {
                return res.serverError(err);
            });

    }
};
