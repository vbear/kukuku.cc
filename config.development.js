/**
 * Global : Config
 * sails.config
 *
 * 开发环境下的配置
 */

module.exports = {

    session: {
        secret: 'd38f989e2dbd315793cb2675d29099a8',
        host: '127.0.0.1'
    },

    cache: false,

    models: {
        migrate: 'alter'
    },

    self : {
        host: 'http://kukuku.cc'
    },

    oauth: {
        weibo: {
            client_id: '4034664504',
            client_secret: '902c0debbad76b460ebd4e4b8fff6dfc',
            redirect_uri: 'http://kukuku.cc/user/weibo/signin'
        },
        qq: {

        },
        acfun: {

        }
    },

    watermarkImage : 'D:\\h.acfun.tv.cluster\\h.acfun.tv.front\\assets\\nimingban.watermark.png',

    connections: {
        ftpServer: {
            host: '127.0.0.1',
            port: 21,
            user: 'root',
            password: 'root',
            defaultSaveAs: '/h/images'
        },
        mysqlServer: {
            adapter: 'sails-mysql',
            host: '127.0.0.1',
            user: 'root',
            password: 'root',
            database: 'kukuku_cc'
        },
        redisServer: {
            host: '127.0.0.1',
            port: 6379,
            database: 7
        },
        rabbitMQServer: {
            host: '127.0.0.1',
            port: 5672,
            login: 'root',
            password: 'root'
        }
    }

};