/**
 * Models : User
 * sails.models.user
 *
 * 第三方验证
 */

module.exports = {

    attributes: {
        name:{
            type:'string',
            size: 10
        },
        secret:{
            type:'string',
            size: 32
        }
    }
};

