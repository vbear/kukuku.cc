/**
 * AttachmentController
 *
 * @module      :: Controller
 * @description    :: 附件
 */

module.exports = {

    /**
     * 上传附件
     * TODO: Skipper似乎近乎失去维护 有必要换个新的middleware
     * @route /attachment/upload
     */
    upload: function (req, res) {

        req.params.format = 'json';

        var maxBytes = 52428800;

        if (req._fileparser.form.bytesExpected > maxBytes) {
            res.set('Content-Type', 'application/json');
            return res.end(JSON.stringify({
                data: '文件大小不能超过 '+maxBytes+' 字节',
                code: 500,
                success: false
            }));
        }

        var uploadMiddleware = req.file('attachment');

        var skipperUpload = Promise.promisify(uploadMiddleware.upload,uploadMiddleware);

        skipperUpload({maxBytes: maxBytes})
            .then(sails.models.attachment.upload)
            .then(function(attachments){
                return res.ok(attachments);
            })
            .catch(function(err){
                return res.serverError(err);
            });

    }
};