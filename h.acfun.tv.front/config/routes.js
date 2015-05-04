/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    /**
     * 首页
     */
    '/.:format?':'HomepageController.index',
    '/index.:format?':'HomepageController.index',
    '/homepage/menu.:format?':'HomepageController.menu',
    '/homepage/ref.:format?':'ThreadsController.ref',
    '/homepage/isManager':'HomepageController.isManager',
    '/search.:format?':'HomepageController.search',
    '/homepage/switchType':'HomepageController.switchType',

    /**
     * 版块
     */
    '/forum/:forum.:format?':'ForumController.index',
    'post /forum/:forum/create.:format?':'ThreadsController.create',

    /**
     * 串
     */
    '/threads/:tid.:format?':'ThreadsController.index',
    'post /threads/:tid/create.:format?':'ThreadsController.create',

    /**
     * 上传附件
     */
    'post /attachment/upload': 'AttachmentController.upload',

    /**
     * 订阅
     */
    '/feed.:format?':'FeedController.index',
    '/feed/create.:format?':'FeedController.create',
    '/feed/remove.:format?':'FeedController.remove',
    '/feed/check.:format?':'FeedController.check',

    /**
     * 用户登录
     */
    '/user/:type/redirect': 'UserController.redirect',
    '/user/:type/signin': 'UserController.signin',


    /**
     * 功能
     */
    '/func/removeLastPostThreads.:format?':'ThreadsController.removeLastThreads'
    //'/func/generateUserId.:format?':'HomepageController.generateUserId'

    /**
     * 测试专用
     */
//    '/code/200':{
//        views:'desktop/code/200.jade'
//    }

};
