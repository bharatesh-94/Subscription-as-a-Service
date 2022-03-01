const userModel = require("../model/userModel");

async function createUser(req, res) {

    try {
        const duplicateUser = await userModel.findOne({ username: req.params.username })
        if(duplicateUser){
            return res.status(400).send({message: `${req.params.username} already registered`})
        }
        const userCreated = await userModel.create({ username: req.params.username })
        if (userCreated) return res.status(200).send()
        else return res.status(400).send()
    }

    catch (err) {
        res.status(500).send({ message: err.message })
    }
}

async function getUser(req, res) {

    try {
        const userInfo = await userModel.findOne({ username: req.params.username }).select({ _id: 0, username: 1, createdAt: 1 })
        if (userInfo) return res.status(200).send(userInfo)
        else return res.status(400).send({ message: "user not found" })

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

async function newSubscription(req, res) {

    try {
        const SUBSCRIPTION_ENUMS = {
            FREE: { validity: "infinite", cost: 0 },
            TRIAL: { validity: 7, cost: 0 },
            LITE_1M: { validity: 30, cost: 100 },
            PRO_1M: { validity: 30, cost: 200 },
            LITE_6M: { validity: 180, cost: 500 },
            PRO_6M: { validity: 180, cost: 900 },
        };

        //destructuring the request body
        const { user_name, plan_id, start_date } = req.body

        //getting the validay and cost of the plan which user subscribed.
        const planValidity = SUBSCRIPTION_ENUMS[plan_id].validity
        const planCost = SUBSCRIPTION_ENUMS[plan_id].cost

        //Calculating the valid till date
        const date = new Date(start_date);
        date.setDate(date.getDate() + planValidity);

        //formatting the valid till date in yyy/mm/dd
        const valid_till = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')

        const userData = await userModel.findOne({ username: user_name })
        if (userData) {

            await userModel.findOneAndUpdate({ username: user_name },{ $push: { subscription: { plan_id: plan_id, start_date: start_date, valid_till: valid_till } } })
            res.status(200).send({ status: "SUCCESS", amount: -planCost })

        } else {
            res.status(400).send({ status: "FAILURE", message: "user not found, please register to subscribe for a plan" })
        }

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}


async function getSubscription(req, res) {

    try {
        const user_name = req.params.username
        const start_date = req.params.date

        if (start_date) {
            const subDetails = await userModel.findOne({ username: user_name }).select({ subscription: { $elemMatch: { start_date: start_date } } })

            if (!subDetails) {
                return res.status(400).send({ message: `user - ${user_name} not found` })
            }

            if (subDetails.subscription.length === 0) {
                return res.status(400).send({ message: `subscription with ${start_date} not found` })
            }

            const plan_id = subDetails.subscription[0].plan_id
            const endDate = subDetails.subscription[0].valid_till

            //count the number of days left
            const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
            const days_left = diffDays(new Date(), new Date(endDate));

            return res.status(200).send({ plan_id: plan_id, days_left: days_left })

        } else {
            const subDetails = await userModel.findOne({ username: user_name }).select({ _id: 0, subscription: 1 })

            if (!subDetails) {
                return res.status(400).send({ message: `user - ${user_name} not found` })
            }

            return res.status(200).send(subDetails)
        }

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}


module.exports = { createUser, getUser, newSubscription, getSubscription }