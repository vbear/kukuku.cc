/**
 * 200 (OK) Response - Generate Result , Include html & json etc.
 *
 * Usage:
 * return res.generateResult(data,wantType,cacheKey);
 *
 * @param  {Object} data
 * @param  {Object} option
 *              {
 *                  wantType: {enum} desktop/mobile/json/xml
 *                  desktopView: {string}
 *                  cacheKey: {string}
 *              }
 */

module.exports = function generateResult(data, option) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    sails.log.silly('res.ok() :: Sending 200 ("OK") response');

    // Set status code
    res.status(200);

    if (!option || !_.isObject(option)) {
        return res.serverError('结果生成初始化失败:预期外参数');
    }

    if (req.wantType.param == 'json') {
        sails.services.cache.set(req.cacheKey, data)
            .then(function () {
                return sails.config.jsonp ? res.jsonp(data) : res.json(data);
            })
            .catch(function () {
                return res.serverError(err);
            });
    } else {
        var selectedView = option[req.wantType.param + 'View'];
        if(selectedView){
            return res.render(selectedView, data, function (err, html) {
                if (err) {
                    return res.serverError(err);
                }
                sails.services.cache.set(req.cacheKey, html)
                    .then(function () {
                        return res.send(200, html);
                    })
                    .catch(function () {
                        return res.serverError(err);
                    });

            });
        } else {
            return res.serverError('没有指定View');
        }

    }

};
