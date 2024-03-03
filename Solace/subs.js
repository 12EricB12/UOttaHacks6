const solace = require("solclientjs");

var Subs = function (topicName) {
  "use strict";
  var replier = {};
  replier.session = null;
  replier.topicName = topicName;
  replier.subscribed = false;

  // Logger
  replier.log = function (line) {
    var now = new Date();
    var time = [
      ("0" + now.getHours()).slice(-2),
      ("0" + now.getMinutes()).slice(-2),
      ("0" + now.getSeconds()).slice(-2),
    ];
    var timestamp = "[" + time.join(":") + "] ";
    console.log(timestamp + line);
  };

  replier.log(
    '\n*** replier to topic "' + replier.topicName + '" is ready to connect ***'
  );

  // Establishes connection to Solace PubSub+ Event Broker
  replier.connect = function () {
    if (replier.session !== null) {
      replier.log("Already connected and ready to ready to receive requests.");
      return;
    }
    var hosturl = "wss://mr-connection-edj6keb7ium.messaging.solace.cloud:443";
    // check for valid protocols
    if (
      hosturl.lastIndexOf("ws://", 0) !== 0 &&
      hosturl.lastIndexOf("wss://", 0) !== 0 &&
      hosturl.lastIndexOf("http://", 0) !== 0 &&
      hosturl.lastIndexOf("https://", 0) !== 0
    ) {
      replier.log(
        "Invalid protocol - please use one of ws://, wss://, http://, https://"
      );
      return;
    }
    var username = "solace-cloud-client";
    var pass = "qscrdts02dlu6kj78a0ep7ap6j";
    var vpn = "event-broker";
    if (!hosturl || !username || !pass || !vpn) {
      replier.log(
        "Cannot connect: please specify all the Solace PubSub+ Event Broker properties."
      );
      return;
    }
    replier.log(
      "Connecting to Solace PubSub+ Event Broker using url: " + hosturl
    );
    replier.log("Client username: " + username);
    replier.log("Solace PubSub+ Event Broker VPN name: " + vpn);
    // create session
    try {
      replier.session = solace.SolclientFactory.createSession({
        // solace.SessionProperties
        url: hosturl,
        vpnName: vpn,
        userName: username,
        password: pass,
      });
    } catch (error) {
      replier.log(error.toString());
    }
    // define session event listeners
    replier.session.on(
      solace.SessionEventCode.UP_NOTICE,
      function (sessionEvent) {
        replier.log(
          "=== Successfully connected and ready to subscribe to request topic. ==="
        );
        replier.subscribe();
      }
    );
    replier.session.on(
      solace.SessionEventCode.CONNECT_FAILED_ERROR,
      function (sessionEvent) {
        replier.log(
          "Connection failed to the message router: " +
            sessionEvent.infoStr +
            " - check correct parameter values and connectivity!"
        );
      }
    );
    replier.session.on(
      solace.SessionEventCode.DISCONNECTED,
      function (sessionEvent) {
        replier.log("Disconnected.");
        replier.subscribed = false;
        if (replier.session !== null) {
          replier.session.dispose();
          replier.session = null;
        }
      }
    );
    replier.session.on(
      solace.SessionEventCode.SUBSCRIPTION_ERROR,
      function (sessionEvent) {
        replier.log(
          "Cannot subscribe to topic: " + sessionEvent.correlationKey
        );
      }
    );
    replier.session.on(
      solace.SessionEventCode.SUBSCRIPTION_OK,
      function (sessionEvent) {
        if (replier.subscribed) {
          replier.subscribed = false;
          replier.log(
            "Successfully unsubscribed from request topic: " +
              sessionEvent.correlationKey
          );
        } else {
          replier.subscribed = true;
          replier.log(
            "Successfully subscribed to request topic: " +
              sessionEvent.correlationKey
          );
          replier.log("=== Ready to receive requests. ===");
        }
      }
    );
    // define message event listener
    replier.session.on(solace.SessionEventCode.MESSAGE, function (message) {
      try {
        replier.reply(message);
      } catch (error) {
        replier.log(error.toString());
      }
    });

    replier.connectToSolace();
  };

  // Actually connects the session triggered when the iframe has been loaded - see in html code
  replier.connectToSolace = function () {
    try {
      replier.session.connect();
    } catch (error) {
      replier.log(error.toString());
    }
  };

  // Subscribes to request topic on Solace PubSub+ Event Broker
  replier.subscribe = function () {
    if (replier.session !== null) {
      if (replier.subscribed) {
        replier.log(
          'Already subscribed to "' +
            replier.topicName +
            '" and ready to receive messages.'
        );
      } else {
        replier.log("Subscribing to topic: " + replier.topicName);
        try {
          replier.session.subscribe(
            solace.SolclientFactory.createTopicDestination(replier.topicName),
            true, // generate confirmation when subscription is added successfully
            replier.topicName, // use topic name as correlation key
            10000 // 10 seconds timeout for this operation
          );
        } catch (error) {
          replier.log(error.toString());
        }
      }
    } else {
      replier.log(
        "Cannot subscribe because not connected to Solace PubSub+ Event Broker."
      );
    }
  };

  // Unsubscribes from request topic on Solace PubSub+ Event Broker
  replier.unsubscribe = function () {
    if (replier.session !== null) {
      if (replier.subscribed) {
        replier.log("Unsubscribing from topic: " + replier.topicName);
        try {
          replier.session.unsubscribe(
            solace.SolclientFactory.createTopicDestination(replier.topicName),
            true, // generate confirmation when subscription is removed successfully
            replier.topicName, // use topic name as correlation key
            10000 // 10 seconds timeout for this operation
          );
        } catch (error) {
          replier.log(error.toString());
        }
      } else {
        replier.log(
          'Cannot unsubscribe because not subscribed to the topic "' +
            replier.topicName +
            '"'
        );
      }
    } else {
      replier.log(
        "Cannot unsubscribe because not connected to Solace PubSub+ Event Broker."
      );
    }
  };

  replier.reply = function (message) {
    question = message.getSdtContainer.getValue();

    replier.log(
      'Received message: "' +
        message.getSdtContainer().getValue() +
        '", details:\n' +
        message.dump()
    );
    replier.log("Replying...");
    if (replier.session !== null) {
      var reply = solace.SolclientFactory.createMessage();
      var sdtContainer = message.getSdtContainer();

      const prompt = require("prompt-sync")();
      const ans = String(prompt("insert question"));

      if (sdtContainer.getType() === solace.SDTFieldType.STRING) {
        var replyText =
          "{" +
          message.getSdtContainer().getValue() +
          ", " +
          ans +
          "} - Sample Reply";
        reply.setSdtContainer(
          solace.SDTField.create(solace.SDTFieldType.STRING, replyText)
        );
        replier.session.sendReply(message, reply);
        replier.log("Replied.");
      }
    } else {
      replier.log(
        "Cannot reply: not connected to Solace PubSub+ Event Broker."
      );
    }
  };

  // Gracefully disconnects from Solace PubSub+ Event Broker
  replier.disconnect = function () {
    replier.log("Disconnecting from Solace PubSub+ Event Broker...");
    if (replier.session !== null) {
      try {
        replier.session.disconnect();
      } catch (error) {
        replier.log(error.toString());
      }
    } else {
      replier.log("Not connected to Solace PubSub+ Event Broker.");
    }
  };

  return replier;
};

console.log("a");

var replier = null;

// Initialize factory with the most recent API defaults
var factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10;
solace.SolclientFactory.init(factoryProps);

// enable logging to JavaScript console at WARN level
// NOTICE: works only with "solclientjs-debug.js"
solace.SolclientFactory.setLogLevel(solace.LogLevel.WARN);

// create the replier, specifying name of the request topic
replier = new Subs("tutorial/topic");
// assign buttons to the replier functions
replier.connect();
