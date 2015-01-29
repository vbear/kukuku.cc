/**
 * Services : Cache
 * sails.services.cache
 *
 * @require redis
 */

var cache = {

    // 链接时使用的链接
    connection: null,

    // 安装
    install: function (options) {
        return new Promise(function (resolve, reject) {
            var options = options || sails.config.connections.redisServer;
            cache.connection = redis.createClient(options.port, options.host);
            cache.connection.select(options.database, resolve);
        });
    },

    // 设置缓存
    set: function (key, value, expire) {
        return new Promise(function (resolve, reject) {

            var rawValue = value;

            if (!key) {
                return reject('key是一个必填参数');
            }

            if (_.isObject(value)) {
                value = JSON.stringify(value);
            }

            cache.version(key)
                .then(function (version) {

                    if (_.isNumber(version)) {
                        cache.connection.set(key.replace(/\:version.*$/g, ':version'), (version + 1));
                        key = key.replace(/\:version/g, ':' + (version + 1));
                    }

                    cache.connection.set(key, value);


                    if (expire) {
                        cache.connection.expire(key, expire);
                    }

                    return resolve(rawValue);

                })
                .catch(reject);

        });
    },

    // 获取缓存
    get: function (key) {
        return new Promise(function (resolve, reject) {
            cache.version(key)
                .then(function (version) {

                    if (_.isNumber(version)) {
                        key = key.replace(/\:version/g, ':' + version);
                    }

                    cache.connection.get(key, function (err, value) {

                        if(value === null){
                            return reject(null);
                        }

                        if(key.indexOf(':json') >= 0 ){
                            try {
                                value = JSON.parse(value);
                            } catch (ex) {
                                // do nothing.
                            }
                        }

                        return resolve(value);
                    });

                });
        });
    },

    // 获取版本
    version: function (key) {
        return new Promise(function (resolve, reject) {

            if (key.indexOf(':version') < 0) {
                return resolve(null);
            }

            cache.connection.get(key.replace(/\:version.*$/g, ':version'), function (err, value) {
                return resolve(parseInt(value) || 0);
            });

        });
    },

    // 清除缓存
    flush: function (key) {

        return new Promise(function (resolve, reject) {
            if (key.indexOf('*') > 0) {
                cache.connection.eval("return redis.call('del', unpack(redis.call('keys', ARGV[1])))", 0, key, function (err, replys) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(replys)
                });
            } else {
                cache.connection.del(key, function (err, replys) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(replys)
                });
            }
        });

    }

};

module.exports = cache;