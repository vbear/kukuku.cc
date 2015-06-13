/**
 * Models : Threads
 * sails.models.threads
 *
 * 串
 */

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
            type: 'email'
        },
        title: {
            type: 'string',
            defaultsTo: ''
        },
        content: {
            type: 'string'
        },
        image: {
            model: 'attachment'
        },
        thumb: {
            model: 'attachment'
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
            model: 'forum'
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
    }

};
