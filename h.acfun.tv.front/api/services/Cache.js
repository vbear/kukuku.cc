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

                    return resolve();

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

                        try {
                            var result = JSON.parse(value);
                        } catch (ex) {
                            var result = value;
                        }

                        return resolve(result);
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



    ///**
    // * 获取缓存
    // */
    //get: function (key) {
    //
    //    var deferred = Q.defer();
    //
    //    if (!sails.config.cache) {
    //        deferred.reject(null);
    //        return deferred.promise;
    //    }
    //
    //    sails.services.cache.version(key)
    //        .then(function (version) {
    //
    //            if (!version || version == null) {
    //                deferred.reject(null);
    //            } else {
    //                // 获取最新缓存
    //                redis.get(key + ':' + version, function (err, cache) {
    //                    if (err) {
    //                        deferred.reject(err);
    //                    } else if (cache == null) {
    //                        deferred.reject(null);
    //                    } else {
    //                        deferred.resolve(cache);
    //                    }
    //                });
    //            }
    //        })
    //        .fail(function (err) {
    //            deferred.reject(err);
    //        });
    //
    //    return deferred.promise;
    //
    //
    //},
    //
    ///**
    // * 设置缓存
    // */
    //set: function (key, value) {
    //
    //    var deferred = Q.defer();
    //
    //    sails.services.cache.version(key)
    //        .then(function (version) {
    //
    //            if (!version) {
    //                version = 1;
    //            }
    //
    //            if (_.isObject(value)) {
    //                value = JSON.stringify(value);
    //            }
    //
    //            redis.set(key + ':' + version, value);
    //            redis.expire(key + ':' + version, 600);
    //
    //        })
    //        .fail(function (err) {
    //            deferred.reject(err);
    //        });
    //
    //    return deferred.promise;
    //
    //},
    //
    ///**
    // * 刷新缓存
    // */
    //flush: function (key) {
    //
    //    var deferred = Q.defer();
    //
    //    if (key.indexOf('*') > 0) {
    //        redis.eval("return redis.call('del', unpack(redis.call('keys', ARGV[1])))", 0, key, function (err, reply) {
    //            if (err) {
    //                deferred.reject(err);
    //            } else {
    //                deferred.resolve(reply);
    //            }
    //        });
    //    } else {
    //        redis.del(key, function (err, reply) {
    //            if (err) {
    //                deferred.reject(err);
    //            } else {
    //                deferred.resolve(reply);
    //            }
    //        });
    //    }
    //
    //    return deferred.promise;
    //
    //},
    //
    ///**
    // * 预处理
    // * @param key
    // * @returns {*}
    // */
    //prehandleKey: function (rawKey) {
    //    // 如果是 forum: 或者 threads: 先去除页数
    //    if (rawKey && (rawKey.indexOf('forum:') >= 0 || rawKey.indexOf('threads:') >= 0)) {
    //        handledKey = /((threads|forum)\:\d+)/g.exec(rawKey);
    //        if (handledKey != null) {
    //            return handledKey[1]
    //        } else {
    //            return rawKey;
    //        }
    //    }
    //
    //    return rawKey;
    //},
    //
    ///**
    // * 获取版本
    // */
    //version: function (key) {
    //
    //    var deferred = Q.defer();
    //
    //    key = sails.services.cache.prehandleKey(key);
    //
    //    // 获取最新版本号
    //    redis.get(key + ':version', function (err, version) {
    //
    //        if (err) {
    //            deferred.reject(err);
    //        } else if (version == null) {
    //            redis.set(key + ':version', 1);
    //            deferred.resolve(1);
    //        } else {
    //            deferred.resolve(version);
    //        }
    //
    //    });
    //
    //    return deferred.promise;
    //},
    //
    ///**
    // * 更新版本
    // */
    //update: function (key) {
    //
    //    var deferred = Q.defer();
    //
    //    key = sails.services.cache.prehandleKey(key);
    //
    //    sails.services.cache.version(key)
    //        .then(function (version) {
    //            if (!version || version == null) {
    //                version = 1;
    //            } else {
    //                version = Number(version) + 1;
    //            }
    //
    //            redis.set(key + ':version', version);
    //
    //            deferred.resolve(null);
    //
    //        })
    //        .fail(function (err) {
    //            deferred.reject(err);
    //        });
    //
    //    return deferred.promise;
    //}

};

module.exports = cache;