/**
 * UserController
 *
 * @module      :: Controller
 * @description    :: 用户
 */

module.exports = {

    /**
     * 请求引导页
     * @route /user/:type/redirect
     */
    redirect: function (req, res) {

        var OAuthTimestamp = new Date().getTime();
        req.session.OAuthTimestamp = OAuthTimestamp;

        switch (req.params.type) {

            case 'weibo':
                return res.redirect('https://api.weibo.com/oauth2/authorize?client_id='
                    + sails.config.oauth.weibo.client_id
                    + '&response_type=code&redirect_uri='
                    + encodeURIComponent(sails.config.oauth.weibo.redirect_uri));
                break;

            case 'qq':
                return res.redirect('https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' + sails.config.oauth.qq.client_id + '&redirect_uri=' + encodeURIComponent(sails.config.self.host + '/user/oauth/qq') + '&state=' + OAuthTimestamp);
                break;

            default:
                return res.notFound();
                break;
        }

    },


    /**
     * 验证Oauth
     * @route /user/:type/signin
     */
    signin: function (req, res) {

        switch (req.params.type) {

            case 'weibo':
                // 1.通过code换取token
                if (!req.query.code) {
                    res.notFound('没有填写验证用的CODE');
                }

                request.postAsync('https://api.weibo.com/oauth2/access_token',
                    {
                        form: {
                            'client_id': sails.config.oauth.weibo.client_id,
                            'client_secret': sails.config.oauth.weibo.client_secret,
                            'grant_type': 'authorization_code',
                            'redirect_uri': sails.config.oauth.weibo.redirect_uri,
                            'code': req.query.code
                        }
                    }).then(function (httpResponse) {

                        var response = httpResponse[0];
                        var data = httpResponse[1];

                        try {
                            data = JSON.parse(data);
                        } catch(e) {
                            // do nothing
                        }

                        if(response.statusCode != 200){
                            return res.forbidden(data);
                        }

                        if(data.access_token){
                            return
                        }

                    });

                break;

            default:
                return res.notFound();
                break;
        }
    }

};

