/**
 * Models : Oauth
 * sails.models.oauth
 *
 * 第三方验证
 */

module.exports = {

    attributes: {
        openType:{
            type:'string',
            size: 10,
            required: true
        },
        openId:{
            type:'string',
            size: 128,
            required: true,
            unique: true
        },
        accessToken:{
            type:'string',
            size: 64
        },
        user:{
            model:'user'
        }
    },

    /**
     * 注册/登陆通用绑定接口
     * @private WARN: 切勿将此接口暴露至public，存在安全风险。
     * @param type
     * @param openId
     */
    bind: function(type,openId,accessToken){

        sails.models.oauth.findOrCreate()
            .populate('user')
            .where({
                openType: type,
                openId: openId
            })
            .then(function(OAuthInfo){
                // 检查是否有绑定user 否则注册一个
                if(OAuthInfo.user){
                    return sails.models.user.signUpByOAuth(OAuthInfo)
                } else {
                    return OAuthInfo;
                }
            })
            .then(function(OAuthInfo){
                return sails.models.oauth.update(OAuthInfo.id,{
                    accessToken: accessToken
                });
            })
            .then(function(OAuthInfo){
                return res.ok(OAuthInfo.user);
            })
            .catch(res.serverError);

    }
};

