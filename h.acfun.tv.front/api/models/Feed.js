/**
 * Feed
 *
 * @module      :: Model
 * @description :: 订阅
 */

module.exports = {

    attributes: {
        deviceToken: {
            type: 'string',
            required: true,
            size: 100
        },
        threadsId: {
            model:'threads'
        }

    },

    /**
     * 检查是否已经订阅
     * @param deviceToken
     * @param threadsId
     */
    exist:function(deviceToken,threadsId){

        var deferred = Q.defer();

        sails.models.feed.findOne()
            .where({
                deviceToken:deviceToken,
                threadsId:threadsId
            })
            .then(function(data){
                if(data){
                    deferred.resolve(true);
                } else {
                    deferred.resolve(false);
                }
            })
            .fail(function(err){
                deferred.resolve(err);
            });

        return deferred.promise;

    }


};