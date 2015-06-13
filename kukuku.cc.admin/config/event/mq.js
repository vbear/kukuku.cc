module.exports = function(message){

    var data = message.data.toString();

    try {
        data = JSON.parse(data) || {};
    } catch(e){
        data = {raw:data}
    }

    switch(data.command){



    }


};