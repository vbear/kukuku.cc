/**
 * FtpService
 *
 * @description :: 文件上传通用包
 *
 * - put(buffer) 上传文件
 * - list(path) 显示对应路径列表
 * - mkdir(path) 创建文件夹
 * - exist(path) 对应文件/文件夹是否存在
 * - unlink(path) 删除对应文件
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

