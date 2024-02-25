import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const messagesSchema = new Schema({
    user: String,
    message: String,
});

const collectionName = "messages";
const messagesModel = model(collectionName, messagesSchema);

export default messagesModel;