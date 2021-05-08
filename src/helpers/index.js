const { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_BOT_TOKEN;
const client = new WebClient(token);
const factors = require('../../enums/factors');


class fn  {
    /**
     * Function for to get and to return the user info from Slack using WebClient 
     * @userID string
     */
    static getUserInfo = async (userId) => {
        this.userId = userId
        try {
            // Call the users.info method using the WebClient
            const result = await client.users.info({
                user: this.userId
            });
            return result.user.name;
        }
        catch (error) {
            console.error(error);
        }
    }
    /**
     * Function for to calculate the multiplied version of the value 
     * @point float
     */
    static calculateMultiplication = async (point, activity) => {
        this.point = point
        this.activity = activity
        try {
            // For this task there are just two activity option, 
            // so possible to fetch the factor value from enums file with two dimensional if condition
            let factor = (this.activity === 'running') ? factors.RUNNING : factors.BIKING
            let result = this.point * factor
            // Return the float value with 2 decimal places
            return parseFloat(result).toFixed(2)
        }
        catch (error) {
            console.error(error);
        }
    }
     /**
     * Capitalize first letter of string 
     * @string string
     */
    static capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

module.exports = fn;