const io = require('socket.io-client');
class client {

    constructor(ip) {
        this.access_token = null;
        this.socket = io(ip);
    }

    publishSpec(pathToFile) {
        if (this.access_token !== null) {
            var fs = require('fs');
            var fetch = require('node-fetch');
            try {
                fs.readFile('../../' + pathToFile, "utf8", function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(data);
                    let applicationName = {
                        yaml: data,
                    }

                    fetch('http://172.23.238.217:8002/register-yaml', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(applicationName)
                    })
                })
            }
            catch (error) {
                console.log('error in reading/fetching yaml file : ' + error);
            }

        }
    }

    configure(tokenFilePath) {
        try {
            let config = require('../../' + tokenFilePath);
            this.access_token = config.access_token;
            console.log('token sent');
            this.socket.emit('config', this.access_token);
        }
        catch (error) {
            console.log('error in sending token :' + error);
        }
    }

    push(eventType, activity) {
        if (this.access_token !== '') {
            // console.log('in push');
            this.socket.emit('activities', activity);
            this.socket.emit('eventType', eventType);
            // console.log('exit push');
        }

    }

    on(tokenValue, listenForEvent, callback) {
        try {
            this.access_token = tokenValue;
            this.socket.emit('config',this.access_token)
            this.socket.on(listenForEvent, (activity) => {
                callback(activity);
            });
        }
        catch (error) {
            console.log('error : ' + error);
        }
    }

}


module.exports = client;
