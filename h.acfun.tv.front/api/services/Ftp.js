/**
 * FtpService
 *
 * @description :: 文件上传通用包
 *
 * WARN: 请连接后一定要主动断开FTP
 */
var path = require('path');
var ftp = require('ftp');
var fs = require('fs');

module.exports = {

    ready: function () {

        return new Promise(function (resolve, reject) {
            var ftpClient = new ftp();

            ftpClient.on('ready', function () {
                resolve(ftpClient);
            });

            ftpClient.on('error', function (err) {
                sails.log.error(err);
                reject(err);
                ftpClient.end();
            });

            ftpClient.connect(sails.config.connections.ftpServer);

        });
    },

    /**
     * 上传文件
     * @param files {mixed}
     */
    upload: function (files) {

        return new Promise(function (resolve, reject) {

            _.isArray(files) || (files = [files]);

            sails.services.ftp.ready()
                .then(function (ftpClient) {
                    // 逐个上传文件
                    async.eachSeries(files,
                        function (file,callback) {
                            ftpClient.mkdir(path.dirname(file.path), true, function (err) {
                                ftpClient.put(file.file,file.path,callback);
                            });
                        }, function (err,result) {
                            ftpClient.end();
                            err ? reject(err) : resolve();
                        });
                })
                .catch(reject);

        });

    }
};

