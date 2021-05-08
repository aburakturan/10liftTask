const { App } = require('@slack/bolt');
const fn = require('./src/helpers');
const DatabaseController = require('./src/controllers/DatabaseController');
require('dotenv').config();

// Set the token and secret
const bot = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

// Capture command running sent by the user over slack for to record data
bot.command('/running', async ({ command, ack, say }) => {
    let activity = 'running'
    // Acknowledge command request
    await ack();
    // Remove double quotes from the point value
    let point = command.text.replace(/['"“”]+/g, '')
    // Check if the incoming value is a number
    if (!isNaN(point)) {
      // Send the entire dataset to the database,
      // including the multiplied version of the value (point) calculated with the helper.
      record = await DatabaseController.createActivity({
        'userId': command.user_id, 
        'activity': activity, 
        'point': await fn.calculateMultiplication(point,activity)
      }).then(function(res){
        if(!res) say("An error occured!")
        else say("⚡️ Activity recorded")
      })  
    } else await say(`${command.text} is not a number`)
});

// Capture command biking sent by the user over slack for to record data
bot.command('/biking', async ({ command, ack, say }) => {
    let activity = 'biking'
    // Acknowledge command request
    await ack();
    // Check if the incoming value is a number
    if (!isNaN(command.text)) {
      // Send the entire dataset to the database,
      // including the multiplied version of the value (point) calculated with the helper.
      record = await DatabaseController.createActivity({
        'userId': command.user_id, 
        'activity': activity, 
        'point': await fn.calculateMultiplication(command.text,activity)
      }).then(function(res){
        if(!res) say("An error occured!")
        else say("⚡️ Activity recorded")
      })  
    } else await say(`${command.text} is not a number`)
});

// Creates a table that ranks top 3 users from highest points 
// accumulated to the lowest within the last hour frame
bot.command('/leaderboard', async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();

  const medals = ['🥇','🥈','🥉']

  // To fetch activities from the database within the last hour frame
  allActivities = await DatabaseController.fetchAllActivities()
  .then(async function(res){ 
    if(!res) say("An error occured!") 
    else{
      let text_blocks = []
      text_blocks.push({
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Leaderboard 🏆",
          "emoji": true
        }
      })
      for (const [key, data] of Object.entries(res)) {
        let totalPoint = parseFloat(data.dataValues.total_point).toFixed(2)
        let user = data.dataValues.userId
        let medal = medals[key]
        text_blocks.push({
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": `${medal}   *<@${user}>* :   With point: *${totalPoint}*`
            }
          ]
        })
      }
      await say({"blocks":text_blocks})
    }
  }) 

  // To fetch activities from the database within the last hour frame depending on the activity name
  runningPointsByActivity = await DatabaseController.fetchPointsByActivity('running')
  .then(async function(res){ 
    if(!res) say("An error occured!") 
    else{
      let text_blocks = []
      text_blocks.push({
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Leaderboard for Running :runner:",
          "emoji": true
        }
      })
      for (const [key, data] of Object.entries(res)) {
        let totalPoint = parseFloat(data.dataValues.total_point).toFixed(2)
        let user = data.dataValues.userId
        let medal = medals[key]
        text_blocks.push({
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": `${medal}   *<@${user}>* :   With point: *${totalPoint}*`
            }
          ]
        })
      }
      await say({"blocks":text_blocks})
    }
  }) 

  // To fetch activities from the database within the last hour frame depending on the activity name
  bikingPointsByActivity = await DatabaseController.fetchPointsByActivity('biking')
  .then(async function(res){ 
    if(!res) say("An error occured!") 
    else{
      let text_blocks = []
      text_blocks.push({
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Leaderboard for Biking 🚴",
          "emoji": true
        }
      })
      for (const [key, data] of Object.entries(res)) {
        let totalPoint = parseFloat(data.dataValues.total_point).toFixed(2)
        let user = data.dataValues.userId
        let medal = medals[key]

        text_blocks.push({
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": `${medal}   *<@${user}>* :   With point: *${totalPoint}*`
            }
          ]
        })
      }
      await say({"blocks":text_blocks})
    }
  }) 

  //To fetch activities' total points within the last hour frame 
  allActivityPoints = await DatabaseController.fetchAllActivityPoints()
  .then(async function(res){ 
    if(!res) say("An error occured!") 
    else{
      let text_blocks = []
      text_blocks.push({
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Activity Summary 🔥",
          "emoji": true
        }
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": `\n>*Activity summary for the last hour* \n>`,
          }
        ]
      })
      for (const [key, data] of Object.entries(res)) {
        let activity = fn.capitalizeFirstLetter(data.dataValues.activity)
        let totalPoint = parseFloat(data.dataValues.total_point).toFixed(2)
        let mostActive = await DatabaseController.mosActiveUserbyActivity(data.dataValues.activity)
        text_blocks.push({
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": `\n>*Activity:* ${activity} \n>*Total*: ${totalPoint} point \n>*Most Active:* *<@${mostActive}>* \n`
            }
          ]
        })
      }
      await say({"blocks":text_blocks})
    }
  }) 
});

(async () => {
  // Start the Bolt App
  await bot.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();