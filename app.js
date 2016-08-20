var restify = require('restify');
var builder = require('botbuilder');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/facts');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
  console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
  appId: "9796fe76-4aa6-4d02-8ae8-ea4d264e6107",
  appPassword: "xRnZp6UmfRxgUJp6CajanzT"
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

// bot.dialog('/', [
//   function(session, args, next) {
//     //console.log(session);
//     if (!session.userData.name) {
//       session.beginDialog('/profile');
//     } else {
//       next();
//     }
//   },
//   function(session, results) {
//     //console.log(session);
//     session.send('Hello %s!', session.userData.name);
//   }
// ]);

// bot.dialog('/profile', [
//   function(session) {
//     builder.Prompts.text(session, 'Hi! What is your name?');
//   },
//   function(session, results) {
//     session.userData.name = results.response;
//     session.endDialog();
//   }
// ]);

bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
                .address(message.address)
                .text("Hello %s... Thanks for adding me. Say '!help' to see commands.", name || 'there');
        bot.send(reply);
    } else {
        // delete their data
    }
});

bot.endConversationAction('goodbye', 'Goodbye (bye)', { matches: /^goodbye/i });

bot.dialog('/', new builder.IntentDialog()
    .matches(/^!norris/i, function (session) {
      var db = req.db;
      session.send("one fact about Chuck incoming!");
    })
    .matches(/^!name/i, function (session) {
        session.send(session.userData.name);
    })
    .matches(/^!help/i, function (session) {
      session.send("**!norris** - one fact about chuck");
      session.send("**!name** - your name");
      session.send("**!help** - this info");
    })
    .matches(/^!ping/i, function (session) {
      ping(session);
    })
    .matches(/^!signin/i, function (session) {
      session.send("let's go signin");
      session.beginDialog('/signin');
    })

    .onDefault(function (session, results) {
      if (results.response) {
        session.send('response ' + results.response);
      }
      session.send("Type !help to get help");
    }));

function ping(session) {
  session.send('pong: ' + session.message.user.name);
  console.log('session ', session.message.user.name);
}

bot.dialog('/signin', [ 
    function (session) { 
        // Send a signin 
        var msg = new builder.Message(session) 
            .attachments([ 
                new builder.SigninCard(session) 
                    .text("You must first signin to your account.") 
                    .button("signin", "http://example.com/") 
            ]); 
        session.endDialog(msg); 
    } 
]); 
