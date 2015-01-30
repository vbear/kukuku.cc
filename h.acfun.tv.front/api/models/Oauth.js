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
            size: 10
        },
        openId:{
            type:'string',
            size: 128
        },
        accessToken:{
            type:'string',
            size: 64
        },
        userId:{
            model:'user'
        }
    }
};

