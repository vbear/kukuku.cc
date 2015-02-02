/**
 * Models : Attachment
 * sails.models.attachment
 *
 * 附件
 */

module.exports = {

    attributes: {

        filename: {
            type: 'string'
        },
        size: {
            type: 'integer'
        },
        type: {
            type: 'string'
        },
        width: {
            type: 'integer'
        },
        height:{
            type: 'integer'
        },
        url: {
            type: 'string'
        },
        status: {
            type: 'integer',
            defaultTo: 0
        }

    },


    /**
     * 检查附件是否存在
     * @param attachmentId 附件Id
     * @returns {Promise}
     */
    checkById: function(attachmentId){
        return new Promise(function (resolve, reject) {

            var attachmentId = parseInt(attachmentId);

            if(!attachmentId){
                return resolve(false);
            }

            sails.models.attachment.count()
                .where({
                    id:attachmentId
                })
                .then(function(count){
                    count ? resolve(true) : resolve(false);
                })
                .catch(reject);

        });

    },

    /**
     * 上传附件
     * TODO: 尽量避免直接使用buffer模式处理，这样可能会造成内存占用增大且难以释放。优先使用file_path进行引用处理。
     * @param uploadedFiles object 文件信息
     * @param useWatermark bool
     * @returns {Promise}
     */
    upload: function (uploadedFiles, useWatermark) {

        return new Promise(function (resolve, reject) {

            var useWatermark = useWatermark || false;

            if (!_.isArray(uploadedFiles) || uploadedFiles.length < 1 || !uploadedFiles[0]) {
                return reject('必须要选择一个文件上传');
            }

            var uploadedFile = uploadedFiles[0];

            var uploadedFileBuffer = fs.readFileSync(uploadedFile.fd);
            fs.unlink(uploadedFile.fd);

            if (!uploadedFileBuffer) {
                return reject('文件读取失败');
            }

            uploadedFile.buffer = uploadedFileBuffer;
            // uploadedFile.md5 = md5(uploadedFileBuffer);
            uploadedFile.useWatermark = useWatermark;

            var uploadedFileType = uploadedFile.type.split('/')[0];
            uploadedFile.suffix = uploadedFile.filename.replace(/^.*?\.(\w+)$/g, "$1");

            if (uploadedFileType == 'image') {
                return sails.models.attachment.handleImage(uploadedFile)
                    .then(resolve)
                    .catch(reject)
            //} else if (uploadedFileType == 'video') {
            //    return sails.models.attachment.handleVideo(uploadedFile)
            //        .then(resolve)
            //        .catch(reject)
            } else {
                return reject('只能上传图片或者视频');
            }

        });

    },

    /**
     * 上传图片
     * @param uploadedFile {object} 文件信息
     * @returns {Promise}
     */
    handleImage: function (uploadedFile) {

        return new Promise(function (resolve, reject) {

            // 1. 检查md5是否已被排除
            if (sails.models.filter.test.imagemd5(uploadedFile.md5)) {
                return reject('没有权限');
            }

            // 2. 准备

            var remoteImageFilename = sails.services.tool.generateUUID() + '.' + uploadedFile.suffix;
            var remoteThumbFilename = sails.services.tool.generateUUID() + '.' + uploadedFile.suffix;
            var remoteImagePath = sails.config.connections.ftpServer.defaultSaveAs + '/' + remoteImageFilename.substr(0, 2) + '/' + remoteImageFilename.substr(2, 2) + '/' + remoteImageFilename;
            var remoteThumbPath = sails.config.connections.ftpServer.defaultSaveAs + '/' + remoteThumbFilename.substr(0, 2) + '/' + remoteThumbFilename.substr(2, 2) + '/' + remoteThumbFilename;

            sails.models.attachment.getImageSize(uploadedFile.buffer)
                .then(function (uploadedFileSize) {
                    uploadedFile.size = uploadedFileSize;
                    if (uploadedFile.useWatermark) {
                        // gif/尺寸不够默认不加水印
                        if (!(uploadedFile.suffix == 'gif' || uploadedFile.size.width > 500 || uploadedFile.size.height > 500)) {
                            return sails.models.attachment.appendImageWatermark(uploadedFile)
                        }
                    }
                    return uploadedFile.buffer;
                })
                .then(function (handledImageBuffer) {
                    uploadedFile.handledImageBuffer = handledImageBuffer;
                    if (uploadedFile.size.width > 250 || uploadedFile.size.height > 250) {
                        return sails.models.attachment.generateImageThumb(uploadedFile)
                    }
                    return uploadedFile.buffer;
                })
                .then(function(handledThumbBuffer){
                    uploadedFile.handledThumbBuffer = handledThumbBuffer;
                    return sails.models.attachment.getImageSize(handledThumbBuffer)
                })
                .then(function (handledThumbSize) {

                    uploadedFile.thumbSize = handledThumbSize;

                    return sails.services.ftp.upload([
                        {
                            file: uploadedFile.handledImageBuffer,
                            path: remoteImagePath
                        },
                        {
                            file: uploadedFile.handledThumbBuffer,
                            path: remoteThumbPath
                        }])
                })
                .then(function () {
                    return sails.models.attachment.create([
                        // 源文件
                        {
                            filename:remoteImageFilename,
                            size: uploadedFile.handledImageBuffer.length ,
                            type: uploadedFile.type,
                            width:uploadedFile.size.width ,
                            height:uploadedFile.size.height,
                            url: remoteImagePath
                        },
                        // 缩略图
                        {
                            filename:remoteThumbFilename,
                            size: uploadedFile.handledThumbBuffer.length ,
                            type: uploadedFile.type,
                            width:uploadedFile.thumbSize.width ,
                            height:uploadedFile.thumbSize.height,
                            url: remoteThumbPath
                        }
                    ])
                })
                .then(resolve)
                .catch(reject);
        });
    },

    /**
     * 获取图片
     */
    getImageSize: function (uploadedFileBuffer) {

        return new Promise(function (resolve, reject) {
            var uploadedFileHandler = gm(uploadedFileBuffer);
            uploadedFileHandler.size(function (err, uploadedFileSize) {
                err ? reject(err) : resolve(uploadedFileSize);
            });
        });

    },

    /**
     * 为图片生成水印并返回buffer
     * @param uploadedFile {object} 文件信息
     * @returns {Promise}
     */
    appendImageWatermark: function (uploadedFile) {
        return new Promise(function (resolve, reject) {
            var uploadedFileHandler = gm(uploadedFile.buffer);
            uploadedFileHandler
                .composite(sails.config.watermarkImage)
                .gravity('SouthEast')
                .geometry('+15+10')
                .toBuffer(function (err, handledImageBuffer) {
                    err ? reject(err) : resolve(handledImageBuffer);
                })
        });
    },

    /**
     * 为图片生成缩略图并返回
     * @param uploadedFile {object} 文件信息
     * @returns {Promise}
     */
    generateImageThumb: function (uploadedFile) {
        return new Promise(function (resolve, reject) {
            var uploadedFileHandler = gm(uploadedFile.buffer);
            uploadedFileHandler
                .geometry(250, 250, '>')
                .compress('jpeg')
                .quality(75)
                .toBuffer(function (err, handledThumbBuffer) {
                    err ? reject(err) : resolve(handledThumbBuffer);
                });
        });
    }

};