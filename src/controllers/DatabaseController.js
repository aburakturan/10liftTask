const models = require("../db/models");
const ActivityModel = models.Activity;
const { Op, Sequelize } = require('sequelize');

class DatabaseController {
    /**
     * Method for to record activities to the database
     * @data Object
     */
    static createActivity = async (data) => {
        this.data = data;
        try{
            const record = await ActivityModel.build({
                userId:this.data.userId,
                activity:this.data.activity,
                point:this.data.point
            });
            return await record.save()
        } catch(error) {
            return error
        }
    }
    /**
     * Method for to fetch activities from the database within the last hour frame
     */
    static fetchAllActivities = async () => {
        try{
            // The retrieved data is grouped by userId 
            // and the total points for both biking and running in the last hour frame is calculated
            // The top three users are filtered and ordered according to the total score.
            const records = await ActivityModel.findAll({
                    where: {
                        createdAt: {
                          [Op.gt]: new Date(Date.now() - (160 * 160 * 1000)),
                        }
                    },
                    attributes: [
                        'userId',
                        [Sequelize.fn('sum', Sequelize.col('point')), 'total_point'],
                    ],
                    group: ['userId'],
                    order: Sequelize.literal('total_point DESC'),
                    limit: 3
                });
            return records
        } catch(error) {
            return error
        }
    }
    /**
     * Method for to fetch activities from the database within the last hour frame depending on the activity name
     * @activity string
     */
     static fetchPointsByActivity = async (activity) => {
        this.activity = activity;
        try{
            // The retrieved data is grouped by userId 
            // Filtered by activity name
            // Total points for both biking and running in the last hour frame is calculated
            // The top three users are filtered and ordered according to the total score
            const records = await ActivityModel.findAll({
                    where: {
                        createdAt: {
                          [Op.gt]: new Date(Date.now() - (160 * 160 * 1000)),
                        },
                        activity: this.activity,
                    },
                    attributes: [
                        'userId',
                        [Sequelize.fn('sum', Sequelize.col('point')), 'total_point'],
                    ],
                    group: ['userId'],
                    order: Sequelize.literal('total_point DESC'),
                    limit: 3
                });
            return records
        } catch(error) {
            return error
        }
    }
    /**
     * Method for to fetch activities' total points within the last hour frame 
     * @activity string
     */
     static fetchAllActivityPoints = async (activity) => {
        this.activity = activity;
        try{
            // The retrieved data is grouped by activity name 
            // Total points for both biking and running in the last hour frame is calculated
            // Ordered according to the total score
            const records = await ActivityModel.findAll({
                    where: {
                        createdAt: {
                          [Op.gt]: new Date(Date.now() - (160 * 160 * 1000)),
                        },
                    },
                    attributes: [
                        'activity',
                        [Sequelize.fn('sum', Sequelize.col('point')), 'total_point'],
                    ],
                    group: ['activity'],
                    order: Sequelize.literal('total_point DESC'),
                });
            return records
        } catch(error) {
            return error
        }
    }
    /**
     * Method for to fetch mos active user by activity
     * @activity string
     */
     static mosActiveUserbyActivity = async (activity) => {
        this.activity = activity
        try{
            // The retrieved data is grouped by userId 
            // Filtered by activity name
            // Total points for both biking and running in the last hour frame is calculated
            // The top one user are filtered according to the total score
            const records = await ActivityModel.findAll({
                    where: {
                        createdAt: {
                          [Op.gt]: new Date(Date.now() - (160 * 160 * 1000)),
                        },
                        activity: this.activity,
                    },
                    attributes: [
                        'userId',
                        [Sequelize.fn('sum', Sequelize.col('point')), 'total_point'],
                    ],
                    group: ['userId'],
                    order: Sequelize.literal('total_point DESC'),
                    limit: 1
                });

            // Return the most active user ID
            for (const [key, data] of Object.entries(records)) {
                return data.dataValues.userId
            }    
        } catch(error) {
            return error
        }
    }
}

module.exports = DatabaseController;