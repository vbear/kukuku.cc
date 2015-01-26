/**
 * Global : Config
 * sails.config
 *
 * 生产环境下的配置
 */

module.exports = {

    cache: true,

    jsonp: true,

    session: {
        host: '127.0.0.1'
    },

    models: {
        migrate: 'safe'
    },

    connections: {
        ftpServer:{
            host: '192.168.241.35',
            port: 21,
            user: 'h',
            password: 'h@acfun@tv'
        },
        mysqlServer: {
            adapter: 'sails-mysql',
            host: '192.168.241.40',
            port: 3401,
            user: 'hisland',
            password: 'hi_to_ri_de_i_you',
            database: 'h_acfun_tv'
        },
        redisServer: {
            host: '127.0.0.1',
            port: 6379,
            database: 7
        }
    },

    http:{
        middleware:{
            poweredBy: function xPoweredBy(req, res, next) {
                res.header('X-Powered-By', 'Akino Mizuho.Koukuko <koukuko.com>');
                next();
            }
        }
    }
};