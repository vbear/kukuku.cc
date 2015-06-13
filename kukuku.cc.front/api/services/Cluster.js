/**
 * Services : Cluster
 * sails.services.cluster
 *
 * @require rabbitMQ
 */

var amqp = require('amqp');

var cluster = {

    // 链接时使用的链接
    connection: null,
    exchange: null,
    queue: null,

    // 安装
    install: function (options) {
        return new Promise(function (resolve, reject) {

            var connected = false;

            var options = options || sails.config.connections.rabbitMQServer;
            cluster.connection = amqp.createConnection(options);

            cluster.connection.on('ready', function () {
                if (!connected) {
                    connected = true;
                    cluster.join()
                        .then(resolve);
                }
            });
        });
    },

    // 加入集群
    // 自动加入，请不要重复执行，避免事件绑定混乱
    join: function () {

        return new Promise(function (resolve, reject) {
            cluster.connection.exchange('nimingban.com', {
                type: 'fanout',
                durable: true,
                autoDelete: false
            }, function (exchange) {
                cluster.exchange = exchange;
                resolve();
            });
        });

    },

    // 发布消息
    publish: function (message) {

        return new Promise(function (resolve, reject) {

            if (!cluster.exchange) {
                return reject();
            }

            cluster.exchange.publish('', message);
            resolve();

        });

    },

    // 订阅消息
    subscribe: function(subscribeCallback) {
        return new Promise(function (resolve, reject) {

            if (!cluster.exchange) {
                return reject();
            }

            cluster.connection.queue('', function (queue) {

                cluster.connection.queue = queue;

                queue.bind('nimingban.com','');

                queue.subscribe(subscribeCallback);

                resolve();

            });

        });

    }




};

module.exports = cluster;