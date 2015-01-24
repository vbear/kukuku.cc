/**
 * Models : Attachment
 * sails.models.attachment
 *
 * 附件
 */

module.exports = {

    // DEV ONLY!
    migrate: 'alter',

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
        width: {
            type: 'int',
            size: 6,
            defaultTo: 0
        },
        height: {
            type: 'int',
            size: 6,
            defaultTo: 0
        },
        url: {
            type: 'url'
        }
    }


};
