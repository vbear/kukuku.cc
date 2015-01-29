/**
 * Threads.js
 *
 * @description :: 贴子
 */
var fs = require('fs'),
    path = require('path'),
    gm = require('gm').subClass({imageMagick: true});

module.exports = {

    autoUpdatedAt: false,

    attributes: {
        uid: {
            type: 'string',
            required: true
        },
        name: {
            type: 'string',
            defaultsTo: ''
        },
        email: {
            type: 'string',
            defaultsTo: ''
        },
        title: {
            type: 'string',
            defaultsTo: ''
        },
        content: {
            type: 'string'
        },
        image: {
            type: 'string',
            defaultsTo: ''
        },
        thumb: {
            type: 'string',
            defaultsTo: ''
        },
        lock: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        sage: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        deleted: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        ip: {
            type: 'ip',
            required: true
        },
        forum: {
            type: 'int',
            required: true
        },
        top: {
            type: 'int',
            defaultsTo: 0
        },
        parent: {
            type: 'int',
            defaultsTo: 0
        },
        replyCount: {
            type: 'int',
            defaultsTo: 0
        },
        recentReply: {
            type: 'array',
            defaultsTo: []
        },
        updatedAt: {
            type: 'datetime'
        }

    },


    /**
     * 获取回复列表
     * @param {int} threadsId 贴子ID
     * @param {int} page=1 页数
     */
    getReply: function (threadsId, page) {

        var deferred = Q.defer();

        // 页数
        page = Math.ceil(page);

        sails.models.threads.find()
            .where({parent: threadsId})
            .sort('updatedAt ASC')
            .paginate(({page: page, limit: 20}))
            .then(function (threads) {
                deferred.resolve(threads);
            })
            .fail(function (err) {
                deferred.reject(err);
            });

        return deferred.promise;
    },

    uploadAttachment: function (uploadError, uploadedFiles) {

        var deferred = Q.defer();

        if (uploadError) {
            deferred.reject(uploadError);
            return deferred.promise;
        }

        // 0. 如果没有上传文件则直接pass
        if (!uploadedFiles || uploadedFiles.length == 0) {
            deferred.resolve({image: '', thumb: ''});
            return deferred.promise;
        }

        if (H.settings.allowUpload && H.settings.allowUpload == 'false') {
            deferred.reject('系统暂时禁止了上传图片，请取消附件再重新发串。');
            return deferred.promise;
        }

        var uploadedFile = uploadedFiles[0];

        fs.readFile(uploadedFile.fd, function (readFileError, uploadedFileBuffer) {

            // 0. 就绪,删除原文件
            fs.unlink(uploadedFile.fd);

            // 1. 初次检查文件类型是否合法
            if (!/^.*?\.(jpg|jpeg|bmp|gif|png)$/g.test(uploadedFile.filename.toLowerCase())) {
                deferred.reject('只能上传 jpg|jpeg|bmp|gif|png 类型的文件');
                return deferred.promise;
            }

            if (readFileError) {
                deferred.reject(readFileError);
                return deferred.promise;
            }

            var imagemd5 = md5(uploadedFileBuffer);

            // 2. 检查是否被屏蔽
            if (sails.models.filter.test.imagemd5(imagemd5)) {
                deferred.reject('没有权限');
                return deferred.promise;
            }

            // 3. 准备好路径
            var now = new Date();
            var imageName = path.basename(uploadedFile.fd.toLowerCase());
            var remoteImagePath = '/image/' + now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate() + '/' + imageName;
            var remoteThumbPath = '/thumb/' + now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate() + '/' + imageName;

            var uploadedFileGm = gm(uploadedFileBuffer, imageName)
                .autoOrient()
                .noProfile();

            uploadedFileGm.size(function (readFileSizeError, uploadedFileSize) {

                if (readFileSizeError) {
                    deferred.reject(readFileSizeError);
                    return deferred.promise;
                }

                // 4. 已经确认是图片，上传原图到FTP
                sails.services.ftp.ready()
                    .then(function (ftpClient) {
                        // 尝试创建文件夹
                        ftpClient.mkdir(path.dirname(remoteImagePath), true, function (err) {
                            ftpClient.put(uploadedFileBuffer, remoteImagePath, function (uploadImageError) {

                                if (uploadImageError) {
                                    ftpClient.end();
                                    deferred.reject(uploadImageError);
                                    return deferred.promise;
                                }

                                // 5. resize图片
                                if (uploadedFileSize.width > 250 || uploadedFileSize.height > 250) {
                                    uploadedFileGm = uploadedFileGm.resize(250, 250);
                                }

                                uploadedFileGm.toBuffer(function (thumbToBufferError, thumbBuffer) {
                                    if (thumbToBufferError) {
                                        ftpClient.end();
                                        deferred.reject(thumbToBufferError);
                                        return deferred.promise;
                                    }

                                    // 6.流程结束 上传到ftp后返回
                                    ftpClient.mkdir(path.dirname(remoteThumbPath), true, function (mkdirError) {
                                        ftpClient.put(thumbBuffer, remoteThumbPath, function (uploadThumbError) {

                                            ftpClient.end();

                                            if (uploadThumbError) {
                                                deferred.reject(uploadThumbError);
                                                return deferred.promise;
                                            }

                                            deferred.resolve({image: remoteImagePath, thumb: remoteThumbPath});

                                        });
                                    });

                                })

                            });
                        });

                    })
                    .fail(function (uploadImageError) {
                        deferred.reject(uploadImageError);
                        return deferred.promise;
                    });

            });

        });


        return deferred.promise;
    },

    checkParentThreads: function (parent) {

        var deferred = Q.defer();

        if (!parent || parent == 0) {
            deferred.resolve(null);
            return deferred.promise;
        }

        sails.models.threads.findOneById(parent)
            .then(function (parentThreads) {

                if (!parentThreads) {
                    deferred.reject('回复的对象不存在');
                    return deferred.promise;
                }

                if (parentThreads.lock) {
                    deferred.reject('主串已经被锁定');
                    return deferred.promise;
                }

                deferred.resolve(parentThreads);

            })
            .fail(function (err) {
                deferred.reject(err);
            });


        return deferred.promise;
    },

    handleParentThreads: function (parentThreads, newThreads) {

        var deferred = Q.defer();

        if (!parentThreads) {
            deferred.resolve(null);
            return deferred.promise;
        }

        var recentReply = parentThreads.recentReply;

        if (!_.isArray(recentReply)) {
            recentReply = [];
        }

        if (recentReply.length > 4) {
            recentReply.pop();
        }

        recentReply.unshift(newThreads.id);

        var map = {};
        map['recentReply'] = recentReply;
        map['replyCount'] = Number(Number(parentThreads['replyCount']) + 1);

        if (parentThreads.sage || newThreads.sage) {
            map['updatedAt'] = parentThreads.updatedAt;
        } else {
            map['updatedAt'] = new Date();
        }

        sails.models.threads
            .update({
                id: parentThreads.id
            }, map)
            .then(function () {
                deferred.resolve(null);
            }).fail(function (err) {
                deferred.reject(err);
            });

        return deferred.promise;


    }

};

