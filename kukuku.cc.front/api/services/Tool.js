/**
 * AcFun 匿名版 - 实用工具库
 */

module.exports = {

    /**
     * 检查需要类型并输出
     * @param param
     */
    checkWantType: function (param) {

        var result = {
            param: param || '',
            isDesktop: false,
            isMobile: false,
            isXml: false,
            isJson: false,
            suffix: ''
        };

        switch (result.param) {
            case 'json':
                result.isJson = true;
                result.suffix = ':json';
                break;
            case 'mobile':
                result.isMobile = true;
                result.suffix = ':mobile';
                break;
            case 'xml':
                result.isXml = true;
                result.suffix = ':xml';
                break;
            case 'desktop':
            default:
                result.param = 'desktop';
                result.isDesktop = true;
                result.suffix = ':desktop';
                break;
        }

        return result;

    },

    unix_to_datetime: function (time) {
        var trans;

        trans = function (t) {
            var dayAgo, dt, dtNow, hrAgo, hrMin, longAgo, longLongAgo, minAgo, secAgo, ts, tsDistance, tsNow;
            dt = new Date(t);
            ts = dt.getTime();
            dtNow = new Date;
            tsNow = dtNow.getTime();
            tsDistance = tsNow - ts;
            hrMin = dt.getHours() + ":" + (dt.getMinutes() < 10 ? "0" : "") + dt.getMinutes() + ":" + (dt.getSeconds() < 10 ? "0" : "") + dt.getSeconds();
            longAgo = dt.getMonth() + 1 + "/" + dt.getDate() + " " + hrMin;
            longLongAgo = dt.getFullYear() + "/" + longAgo;
            return longLongAgo;

            if (tsDistance < 0) {
                return "刚刚"
            } else {
                if (tsDistance / 1e3 / 60 / 60 / 24 / 365 | 0 > 0) {
                    return longLongAgo
                } else {
                    if ((dayAgo = tsDistance / 1e3 / 60 / 60 / 24) > 3) {
                        return longLongAgo
                    } else {
                        if ((dayAgo = (dtNow.getDay() - dt.getDay() + 7) % 7) > 2) {
                            return longAgo
                        } else {
                            if (dayAgo > 1) {
                                return "前天 " + hrMin
                            } else {
                                if ((hrAgo = tsDistance / 1e3 / 60 / 60) > 12) {
                                    return (dt.getDay() !== dtNow.getDay() ? "昨天 " : "今天 ") + hrMin
                                } else {
                                    if ((hrAgo = tsDistance / 1e3 / 60 / 60 % 60 | 0) > 0) {
                                        return hrAgo + "小时前"
                                    } else {
                                        if ((minAgo = tsDistance / 1e3 / 60 % 60 | 0) > 0) {
                                            return minAgo + "分钟前"
                                        } else {
                                            if ((secAgo = tsDistance / 1e3 % 60 | 0) > 0) {
                                                return secAgo + "秒前"
                                            } else {
                                                return "刚刚"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        return trans(new Date(time).getTime());
    },

    isMobile: function (ua) {

        var ua = ua || '';
        ua = ua.toLowerCase();
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4))) {
            return true;
        }

        return false;


    },

    generateUUID: function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

};