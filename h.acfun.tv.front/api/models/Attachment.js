/**
 * Models : Attachment
 * sails.models.attachment
 *
 * 附件
 */

var fs = require('fs');
var path = require('path');
var gm = require('gm').subClass({imageMagick: true});

module.exports = {

    attributes: {

        filename: {
            type: 'string'
        },
        hash: {
            type: 'string'
        },
        size: {
            type: 'int'
        },
        type: {
            type: 'string'
        },
        info: {
            type: 'object'
        },
        url: {
            type: 'url'
        }

    },

    /**
     * 上传附件
     * TODO: 尽量避免直接使用buffer模式处理，这样可能会造成内存占用增大且难以释放。优先使用file_path进行引用处理。
     * @param uploadedFiles object 文件信息
     * @param useWatermark bool
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
            uploadedFile.md5 = md5(uploadedFileBuffer);
            uploadedFile.useWatermark = useWatermark;

            var uploadedFileType = uploadedFile.type.split('/')[0];

            if (uploadedFileType == 'image') {
                return sails.models.attachment.uploadImage(uploadedFile);
            } else if (uploadedFileType == 'video') {
                return sails.models.attachment.uploadVideo(uploadedFile);
            } else {
                return reject('只能上传图片或者视频');
            }

        });

    },

    /**
     * 上传图片
     * @param uploadedFile object 文件信息
     */
    uploadImage: function (uploadedFile) {

        return new Promise(function (resolve, reject) {

            // 1. 检查md5是否已被排除
            if (sails.models.filter.test.imagemd5(uploadedFile.md5)) {
                return reject('没有权限');
            }

            // 2. 准备
            var now = new Date();
            var imageName = path.basename(uploadedFile.fd.toLowerCase());
            var remoteImagePath = '/image/' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + (now.getDate()+1) + '/' + imageName;
            var remoteThumbPath = remoteImagePath.replace(/image/,'thumb');

            var uploadedFileHandler = gm(uploadedFile.buffer, imageName)
                .autoOrient()
                .noProfile();

            // 3. 如果需要添加水印 那么现在添加了，缩略图缩小反正也看不到
            if(uploadedFile.useWatermark){
                uploadedFileHandler = uploadedFileHandler.drawText(30, 20, "匿名版\n\rnimingban.com");
            }


        });




    },

    /**
     * 上传视频
     * @param uploadedFiles object 文件信息
     */
    uploadVideo: function (uploadedFiles) {


    }


};