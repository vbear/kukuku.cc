/**
 * 500 (Server Error) Response
 *
 * Usage:
 * return res.serverError();
 * return res.serverError(err);
 * return res.serverError(err, 'some/specific/error/view');
 *
 * NOTE:
 * If something throws in a policy or controller, or an internal
 * error is encountered, Sails will call `res.serverError()`
 * automatically.
 */

module.exports = function serverError(data) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    req.wantType = sails.services.tool.checkWantType(req.params.format);

    // Set status code
    res.status(500);

    if (data !== undefined) {
        sails.log.error('Sending 500 ("Server Error") response: \n',req.url, data);
    }
    else sails.log.error('Sending empty 500 ("Server Error") response');

    if (sails.config.environment === 'production') {
        data = undefined;
    }

    var data = {
        data: data,
        success: false,
        code: 500
    };

    switch (req.wantType.param) {

        case 'json':
            sails.config.jsonp ? res.jsonp(data) : res.json(data);
            break;

        case 'mobile':
            res.render('mobile/code/500', data, function (err, html) {
                if (err) {
                    return res.serverError(err);
                }
                res.send(200, html);
            });
            break;

        case 'desktop':
        default :
            res.render('desktop/code/500', data, function (err, html) {
                if (err) {
                    return res.serverError(err);
                }
                res.send(200, html);
            });
            break;
    }

};

