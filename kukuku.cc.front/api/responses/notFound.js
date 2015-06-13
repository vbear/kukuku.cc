/**
 * 404 (Not Found) Handler
 *
 * Usage:
 * return res.notFound();
 * return res.notFound(err);
 * return res.notFound(err, 'some/specific/notfound/view');
 *
 * e.g.:
 * ```
 * return res.notFound();
 * ```
 *
 * NOTE:
 * If a request doesn't match any explicit routes (i.e. `config/routes.js`)
 * or route blueprints (i.e. "shadow routes", Sails will call `res.notFound()`
 * automatically.
 */

module.exports = function notFound(data) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    req.wantType = sails.services.tool.checkWantType(req.params.format);

    // Set status code
    res.status(404);

    // Log error to console
    if (data !== undefined) {
        sails.log.verbose('Sending 404 ("Not Found") response: \n',req.url, data);
    }
    else sails.log.verbose('Sending 404 ("Not Found") response');

    var data = {
        data: data,
        success: false,
        code: 404,
        url: req.url
    };

    switch (req.wantType.param) {

        case 'json':
            sails.config.jsonp ? res.jsonp(data) : res.json(data);
            break;

        case 'mobile':
            res.render('mobile/code/404', data, function (err, html) {
                if (err) {
                    return res.serverError(err);
                }
                res.send(200, html);
            });
            break;

        case 'desktop':
        default :
            res.render('desktop/code/404', data, function (err, html) {
                if (err) {
                    return res.serverError(err);
                }
                res.send(200, html);
            });
            break;
    }

};

