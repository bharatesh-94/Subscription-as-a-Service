const mongoose = require ("mongoose")

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    subscription : {
        type: Array
    }

}, {timestamps:true})


module.exports = mongoose.model("User-subscription", userSchema)