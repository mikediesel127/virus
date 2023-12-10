// In message.js or your Message model file
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

messageSchema.statics.fetchRecentChatsForUser = async function(userId) {
    // Correctly converting userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    return this.aggregate([
        {
            $match: {
                $or: [
                    { sender: userObjectId },
                    { receiver: userObjectId }
                ]
            }
        },
        {
            $sort: { timestamp: -1 }
        },
        {
            $group: {
                _id: {
                    $cond: [
                        { $eq: ["$sender", userObjectId] },
                        "$receiver",
                        "$sender"
                    ]
                },
                lastMessage: { $first: "$$ROOT" }
            }
        }
    ]);
};

module.exports = mongoose.model('Message', messageSchema);
