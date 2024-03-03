var Messager = function (topicName) {
    'use strict';
    var requestor = {};
    requestor.session = null;
    requestor.topicName = topicName;

    const host = "wss://mr-connection-edj6keb7ium.messaging.solace.cloud:443";
    const vpn = "event-broker";
    const user = "solace-cloud-client";
    const password = "qscrdts02dlu6kj78a0ep7ap6j";

    // Logger, boiler plate code
    // Taken from github for basic debugging purposes (not required, but super super useful)
    requestor.log = function (line) {
        var now = new Date();
        var time = [('0' + now.getHours()).slice(-2), ('0' + now.getMinutes()).slice(-2),
            ('0' + now.getSeconds()).slice(-2)];
        var timestamp = '[' + time.join(':') + '] ';
        console.log(timestamp + line);
    };

    requestor.log('\n*** requestor to topic "' + requestor.topicName + '" is ready to connect ***');

    requestor.connect = () => {
        if (requestor.session !== null) {
            requestor.log("Already connected!");
            return;
        }

        requestor.log("Connecting to Event Broker using url: " + host);
        requestor.log("Client username: " + user);
        requestor.log("VPN name: " + vpn);

        // create session
        try {
            requestor.session = solace.SolclientFactory.createSession({
                url:      host,
                vpnName:  vpn,
                userName: user,
                password: password,
                publisherProperties: {
                    acknowledgeMode: solace.MessagePublisherAcknowledgeMode.PER_MESSAGE,
                },
            });
        }
        catch (error) {
            requestor.log("Error when creating session:\n" + error.toString());
        }

        // define session event listeners
        requestor.session.on(solace.SessionEventCode.UP_NOTICE, () => {
            requestor.log('=== Successfully connected and ready to send requests. ===');
                                
        });
        requestor.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, (sessionEvent) => {
            requestor.log('Connection failed to the message router: ' + sessionEvent.infoStr +
                ' - check correct parameter values and connectivity!');
        });
        requestor.session.on(solace.SessionEventCode.DISCONNECTED, () => {
            requestor.log('Disconnected.');
            if (requestor.session !== null) {
                requestor.session.dispose();
                requestor.session = null;
            }
        });

        requestor.connectToSolace();
    }

    requestor.request = () => {
        if (requestor.session !== null) {
            var content = 'Test';
            var request = solace.SolclientFactory.createMessage();
            request.setDestination(solace.SolclientFactory.createTopicDestination(requestor.topicName));
            request.setSdtContainer(solace.SDTField.create(solace.SDTFieldType.STRING, content));
            request.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
            try {
                requestor.session.sendRequest(
                    request,
                    5000, // 5 seconds timeout for this operation
                    function (session, message) {
                        requestor.replyReceivedCb(session, message);
                    },
                    function (session, event) {
                        requestor.requestFailedCb(session, event);
                    },
                    null // not providing correlation object
                );
            } 
            catch (error) {
                requestor.log("Error caught when sending message: " + error.toString());
            }
        } 
        else {
            requestor.log('Cannot send request because not connected to Solace PubSub+ Event Broker.');
        }
    };

    // replies
    requestor.replyReceivedCb = function (session, message) {
        requestor.log('Received reply: "' + message.getSdtContainer().getValue() + '"' +
            ' details:\n' + message.dump());
    };

    // request failures
    requestor.requestFailedCb = function (session, event) {
        requestor.log('Request failure: ' + event.toString());
    };

    // disconnect
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

Messager("HELP");
