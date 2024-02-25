import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const messagesSchema = new Schema({
    user: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const collectionName = "messages";
const messagesModel = model(collectionName, messagesSchema);

export default messagesModel;