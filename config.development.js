/**
 * Global : Config
 * sails.config
 *
 * 开发环境下的配置
 */

module.exports = {

    session: {
        secret: 'd38f989e2dbd315793cb2675d29099a8',
        host: '10.232.0.13'
    },

    cache: false,

    models: {
        migrate: 'safe'
    },

    self : {
        host: 'http://h.nimingban.com'
    },

    oauth: {
        weibo: {
            client_id: '',
            client_secret: ''
        },
        qq: {

        },
        acfun: {

        }
    },

    watermarkImage : 'D:\\h.acfun.tv.cluster\\h.acfun.tv.front\\assets\\nimingban.watermark.png',

    connections: {
        ftpServer: {
            host: '10.232.0.26',
            port: 21,
            user: 'root',
            password: 'root',
            defaultSaveAs: '/h/images'
        },
        mysqlServer: {
            adapter: 'sails-mysql',
            host: '10.232.0.26',
            user: 'root',
            password: 'root',
            database: 'h_acfun_tv_v4'
        },
        redisServer: {
            host: '10.232.0.13',
            port: 6379,
            database: 7
        },
        rabbitMQServer: {
            host: '10.232.0.26',
            port: 5672,
            login: 'root',
            password: 'root'
        }
    }

};