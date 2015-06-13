/**
 * HomepageController
 *
 * @module      :: Controller
 * @description    :: 首页
 */

module.exports = {

    /**
     * 首页
     * @route /homepage
     * @key homepage:index:{$format}
     */
    index: function (req, res) {

        req.wantType = sails.services.tool.checkWantType(req.params.format);
        req.cacheKey = 'homepage:index' + req.wantType.suffix;

        sails.services.cache.get(req.cacheKey)
            .then(function (cache) {

                if (req.wantType.param == 'json') {
                    return sails.config.jsonp ? res.jsonp(JSON.parse(cache)) : res.json(JSON.parse(cache));
                } else {
                    return res.send(200, cache);
                }

            })
            .catch(function () {

                var data = {
                    page: {
                        title: '首页'
                    },
                    code: 200,
                    success: true
                };

                return res.generateResult(data, {
                    desktopView: 'desktop/homepage/index',
                    mobileView: 'mobile/homepage/index'
                });

            });
    },

    /**
     * 切换版本
     * @param req
     * @param res
     */
    switchType: function (req, res) {


        return res.render('mobile/homepage/switch', {
            page: {
                title: '切换'
            }
        }, function (err, html) {
            if (err) {
                return res.serverError(err);
            }
            res.send(200, html);
        });

    },

    /**
     * 版块列表
     * @route /homepage/menu
     * @key homepage:index:{$format}
     */
    menu: function (req, res) {

        req.wantType = sails.services.tool.checkWantType(req.params.format);
        req.cacheKey = 'homepage:menu' + req.wantType.suffix;

        sails.services.cache.get(req.cacheKey)
            .then(function (cache) {

                if (req.wantType.param == 'json') {
                    return sails.config.jsonp ? res.jsonp(JSON.parse(cache)) : res.json(JSON.parse(cache));
                } else {
                    return res.send(200, cache);
                }

            })
            .fail(function () {

                var data = {
                    page: {
                        title: '版块列表'
                    },
                    code: 200,
                    success: true
                };

                sails.models.forum.find()
                    .then(function (rawForums) {

                        var handledForums = [];
                        _(rawForums).forEach(function(forum){
                            forum['createdAt'] = (forum['createdAt']) ? new Date(forum['createdAt']).getTime() : null;
                            forum['updatedAt'] = (forum['updatedAt']) ? new Date(forum['updatedAt']).getTime() : null;
                            handledForums.push(forum)
                        });

                        data.forum = handledForums;

                        return res.generateResult(data, {
                            desktopView: 'desktop/homepage/menu',
                            mobileView: 'mobile/homepage/menu'
                        });

                    })
                    .catch(function (err) {
                        return res.serverError(err);
                    });

            });

    },

    /**
     * /homepage/isManager
     */
    isManager: function (req, res) {

        var result = {
            success: false
        };

        if (req.signedCookies.managerId) {
            result.success = true;
        }

        res.json(result);

    },

    /**
     * 搜索
     */
    search: function (req, res) {


        req.wantType = sails.services.tool.checkWantType(req.params.format);
        req.cacheKey = 'homepage:search:' + req.wantType.suffix;

        var data = {
            page: {
                title: '搜索'
            },
            code: 200,
            success: true
        };

        return res.generateResult(data, {
            desktopView: 'desktop/homepage/search',
            mobileView: 'mobile/homepage/search'
        });

    }

};
