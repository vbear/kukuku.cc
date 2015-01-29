/**
 * Setting
 *
 * @module      :: Model
 * @description :: 系统配置
 */

module.exports = {

    attributes: {
        key: {
            type: 'string',
            required: true,
            max: 50
        },
        value: {
            type: 'text'
        }
    },

    /**
     * 从数据库同步到全局变量
     */
    findAll: function () {

        return new Promise(function (resolve, reject) {
            sails.models.setting.find()
                .then(function(rawSettings){
                    // 对配置进行处理
                    var handledSettings = {};

                    _.forEach(rawSettings,function(item){
                        handledSettings[item.key] = item.value;
                    });

                    resolve(handledSettings)
                })
                .catch(reject)
        });

    }

};
