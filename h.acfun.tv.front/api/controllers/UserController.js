/**
 * UserController
 *
 * @module      :: Controller
 * @description    :: 用户
 */

module.exports = {

    /**
     * 请求引导页
     * @route /user/jump
     */
    jump: function (req, res) {

        var OAuthTimestamp = new Date().getTime();
        req.session.OAuthTimestamp = OAuthTimestamp;

        switch(req.query.type){

            case 'weibo':
                return res.redirect('https://api.weibo.com/oauth2/authorize?client_id='+sails.config.oauth.weibo.client_id+'&response_type=code&redirect_uri='+encodeURIComponent(sails.config.self.host+'/user/oauth/weibo'));
                break;

            case 'qq':
                return res.redirect('https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id='+sails.config.oauth.qq.client_id+'&redirect_uri='+encodeURIComponent(sails.config.self.host+'/user/oauth/qq')+'&state='+OAuthTimestamp);
                break;

            case 'acfun':
                return res.redirect('https://ssl.acfun.tv/oauth2/authorize.aspx?client_id='+sails.config.oauth.acfun.client_id+'&redirect_uri='+encodeURIComponent(sails.config.self.host+'/user/oauth/acfun')+'&state='+OAuthTimestamp+'&response_type=token&approval_prompt=force')
                break;

            default:
                return res.notFound();
                break;
        }

    },


    /**
     * 验证Oauth
     */
    check: {

        /**
         * 验证微博
         * YOUR_REGISTERED_REDIRECT_URI/?code=CODE
         */
        weibo: function(req,res){

            // 1.通过code换取token
            if(!req.query.code){
                res.notFound('没有填写验证用的CODE');
            }

            request.get('https://api.weibo.com/oauth2/access_token?client_id='+sails.config.oauth.acfun.client_id+'&client_secret='+sails.config.oauth.acfun.client_secret+'&grant_type=authorization_code&redirect_uri='+sails.config.oauth.weibo.client_id+'&response_type=code&redirect_uri='+encodeURIComponent(sails.config.self.host+'/user/oauth/weibo')+'&code=CODE')

        }

        /**
         * 验证QQ
         *
         */

    }

};

