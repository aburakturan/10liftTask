# 10lift Test for backend Applicants

Creating a local Slack application

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install dependencies.

```bash
npm install
```

Create an .env file and configure it
```bash
SLACK_SIGNING_SECRET = <SLACK_SIGNING_SECRET>
SLACK_BOT_TOKEN = <SLACK_BOT_TOKEN>
DB_HOST = <DB_HOST>
DB_USERNAME = <DB_USERNAME>
DB_PASSWORD = <DB_PASSWORD>
```

Use the sequelize commands to create the database table and the associated model, then migrate it

```bash
npm run db:create
npm run db:g:model
npm run db:g:migration
npm run db:migrate
```

## Usage

Record your activity to the database using the `/running <value>` or `/biking <value>` commands via Slack.

```slack
/running 10.40
/biking 20
```

With the command `/leaderboard`, observe the leaderboards of the top three users with tables separated in the general, running and biking axis. Leaderboard also shows you which activity is the most active and the highest rated player in those activities.

```slack
/leaderboard
```
![Leaderboard Image](https://github.com/aburakturan/10liftTask/blob/master/src/img/leaderboard.png?raw=true)

## What I've done
I created a Slack Bot to be able to use the Slack API. I gave the necessary permissions, made the settings, added the necessary slash commands for the task, and assigned the webhooks I created by opening a tunnel from my localhost with ngrok to these commands.

I chose Postgres as a database. I used the Sequelize package as an ORM. I created a table called Activity. I performed the database create, model creation and migrate operations with the Sequelize commands that I added to the package.json. I have created a database controller class that will be a bridge for database connections.

I create the index.js to capture slash commands from Slack. I wrote the Running and Biking commands and Leaderboard commands based on the examples in the Slack API documentation.


## License
[MIT](https://choosealicense.com/licenses/mit/)
