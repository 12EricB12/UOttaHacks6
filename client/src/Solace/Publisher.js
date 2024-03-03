const solace = require("solclientjs");

var Publisher = function (topicName) {
    'use strict';
    var requestor = {};
    requestor.session = null;
    requestor.topicName = topicName;

    // Logger
    requestor.log = function (line) {
        var now = new Date();
        var time = [('0' + now.getHours()).slice(-2), ('0' + now.getMinutes()).slice(-2),
            ('0' + now.getSeconds()).slice(-2)];
        var timestamp = '[' + time.join(':') + '] ';
        console.log(timestamp + line);
    };

    requestor.log('\n*** requestor to topic "' + requestor.topicName + '" is ready to connect ***');

    // Establishes connection to Solace PubSub+ Event Broker
    requestor.connect = function () {
        if (requestor.session !== null) {
            requestor.log('Already connected and ready to send requests.');
            return;
        }
        var hosturl = 'wss://mr-connection-edj6keb7ium.messaging.solace.cloud:443';
        // check for valid protocols
        if (hosturl.lastIndexOf('ws://', 0) !== 0 && hosturl.lastIndexOf('wss://', 0) !== 0 &&
            hosturl.lastIndexOf('http://', 0) !== 0 && hosturl.lastIndexOf('https://', 0) !== 0) {
            session.log('Invalid protocol - please use one of ws://, wss://, http://, https://');
            return;
        }
        var username = 'solace-cloud-client';
        var pass = 'qscrdts02dlu6kj78a0ep7ap6j';
        var vpn = 'event-broker';
        if (!hosturl || !username || !pass || !vpn) {
            session.log('Cannot connect: please specify all the Solace PubSub+ Event Broker properties.');
            return;
        }
        requestor.log('Connecting to Solace PubSub+ Event Broker using url: ' + hosturl);
        requestor.log('Client username: ' + username);
        requestor.log('Solace PubSub+ Event Broker VPN name: ' + vpn);
        // create session
        try {
            requestor.session = solace.SolclientFactory.createSession({
                // solace.SessionProperties
                url:      hosturl,
                vpnName:  vpn,
                userName: username,
                password: pass,
            });
        } catch (error) {
            requestor.log(error.toString());
        }
        // define session event listeners
        requestor.session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
            requestor.log('=== Successfully connected and ready to send requests. ===');
            requestor.request();
        });
        requestor.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, function (sessionEvent) {
            requestor.log('Connection failed to the message router: ' + sessionEvent.infoStr +
                ' - check correct parameter values and connectivity!');
        });
        requestor.session.on(solace.SessionEventCode.DISCONNECTED, function (sessionEvent) {
            requestor.log('Disconnected.');
            if (requestor.session !== null) {
                requestor.session.dispose();
                requestor.session = null;
            }
        });

        requestor.connectToSolace();   
    };

    // Actually connects the session triggered when the iframe has been loaded - see in html code
    requestor.connectToSolace = function () {
        try {
            requestor.session.connect();
        } catch (error) {
            requestor.log(error.toString());
        }
    };

    // sends one request
    requestor.request = function (question) {
        if (requestor.session !== null) {
            var requestText = String(question);
            var request = solace.SolclientFactory.createMessage();
            requestor.log('Sending request "' + requestText + '" to topic "' + requestor.topicName + '"...');
            request.setDestination(solace.SolclientFactory.createTopicDestination(requestor.topicName));
            request.setSdtContainer(solace.SDTField.create(solace.SDTFieldType.STRING, requestText));
            request.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
            try {
                requestor.session.sendRequest(
                    request,
                    2147483646, // 5 seconds timeout for this operation
                    function (session, message) {
                        requestor.replyReceivedCb(session, message);
                    },
                    function (session, event) {
                        requestor.requestFailedCb(session, event);
                    },
                    null // not providing correlation object
                );
            } catch (error) {
                requestor.log(error.toString());
            }
        } else {
            requestor.log('Cannot send request because not connected to Solace PubSub+ Event Broker.');
        }
    };

    // Callback for replies
    requestor.replyReceivedCb = function (session, message) {
        requestor.log('Received reply: "' + message.getSdtContainer().getValue() + '"' +
            ' details:\n' + message.dump());

        const prompt = require('prompt-sync')();
        const q = prompt('insert question: ');

        requestor.request(q);
    };

    // Callback for request failures
    requestor.requestFailedCb = function (session, event) {
        requestor.log('Request failure: ' + event.toString());
    };

    // Gracefully disconnects from Solace PubSub+ Event Broker
    requestor.disconnect = function () {
        requestor.log('Disconnecting from Solace PubSub+ Event Broker...');
        if (requestor.session !== null) {
            try {
                requestor.session.disconnect();
            } catch (error) {
                requestor.log(error.toString());
            }
        } else {
            requestor.log('Not connected to Solace PubSub+ Event Broker.');
        }
    };
    
    return requestor;
};

var requestor = null;

// Initialize factory with the most recent API defaults
var factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10;
solace.SolclientFactory.init(factoryProps);

// enable logging to JavaScript console at WARN level
// NOTICE: works only with "solclientjs-debug.js"
solace.SolclientFactory.setLogLevel(solace.LogLevel.WARN);

// create the publisher, specifying name of the request topic
requestor = new Publisher('tutorial/topic');
// assign buttons to the publisher functions
requestor.connect();
requestor.session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
    requestor.log('=== Successfully connected and ready to send requests. ===');

        const prompt = require('prompt-sync')();
        const q = prompt('insert question');

        requestor.request(q);
                        
}); // WILL BE DIFFERENT