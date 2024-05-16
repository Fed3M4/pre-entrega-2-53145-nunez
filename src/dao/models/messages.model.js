import { Schema, model } from "mongoose";

const messageCollection = 'messages'

const messageSchema = new Schema({
    user: String,
    message: String
})

export const messageModel = model(messageCollection, messageSchema)