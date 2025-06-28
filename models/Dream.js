const mongoose = require("mongoose")
const { ObjectID } = mongoose.Schema;

const dreamSchema = new mongoose.Schema(
    {
        user: {
            type: ObjectID,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            trim: true,
            required: true
        },
        content: {
            type: String,
            trim: true,
            required: true
        },
        interpretation: {
            type: String,
            trim: true,
        },
        generated_image: {
            data: Buffer,
            contentType: String
        }

    },
    { timestamps: true }
)

module.exports = mongoose.model("Dream", dreamSchema);