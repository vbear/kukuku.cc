/**
 * Models : User
 * sails.models.user
 *
 * 第三方验证
 */

module.exports = {

    attributes: {
        name: {
            type: 'string',
            size: 10
        },
        password: {
            type: 'string',
            size: 32
        },
        salt: {
            type: 'string',
            size: 32
        },
        uuid: {
            type: 'string',
            size: 32
        },
        mobile: {
            type: 'integer',
            size: 32
        },
        email: {
            type: 'email'
        }
    },

    generateUserId: function () {
        // 生成饼干
        var char = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
        var seed = new Date().getTime();
        var userId = "";
        for (var i = 0; i < 8; i++) {
            userId += char.charAt(Math.ceil(Math.random() * seed) % char.length);
        }

        return userId;
    },

    /**
     * 通过OAuth注册
     */
    signUpByOAuth: function (OAuthInfo) {
        return new Promise(function (resolve, reject) {
            sails.models.user
                .create({
                    name: sails.models.user.generateUserId(),
                    uuid: sails.services.tool.generateUUID()
                })
                .then(function (createdUser) {
                    OAuthInfo.user = createdUser;
                    return OAuthInfo;
                })
                .then(function (OAuthInfo) {
                    sails.models.oauth
                        .update(OAuthInfo.id, {
                            userId: OAuthInfo.user.id
                        })
                        .then(function () {
                            resolve(OAuthInfo)
                        })
                        .catch(reject)
                })
                .catch(reject)
        });


    }
};

