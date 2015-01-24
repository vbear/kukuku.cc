/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (standBy) {

    global.H = {};  // 准备弃用全局变量缓存，将缓存全部寄予Cache

    // Require Lib.
    global.Promise = require("bluebird");
    Promise.promisifyAll(require("redis"));
    global.redis = require('redis');

    // 将会弃用的库
    global.Q = require("q");
    global.md5 = require('MD5');
    global.request = require('request');

    sails.log.ship = null;
    sails.log('--------------------------------------------------------'.grey);
    sails.log.info('AC匿名版 - When i wish upon a star');
    sails.log('--------------------------------------------------------'.grey);
    sails.log.blank();


    // 初始化模块
    sails.services.cache.install()
        .then(sails.services.cluster.install)
        .then(function(){
            return sails.services.cluster.subscribe(require('./event/mq'));
        })
        .then(sails.models.setting.findAll)
        .then(function(settings){
            H.settings = settings;
        })
        .then(function(){
            standBy();
        })
        .catch(function(err){
            sails.log.error(err);
        });

};