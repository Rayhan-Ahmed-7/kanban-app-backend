import { Schema, model } from "mongoose";
import { schemaOptions } from "../../../utils/modelOptions";
import { IBoard } from "../types/board_types";


const boardSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, // mongoose special type to represent MongoDB ObjectId
        ref: 'User', // reference to the collection to which this ObjectId refers
        required: true, // user id must be present on every document we will create
    },
    icon: {
        type: String,
        default: "🦕"
    },
    title: {
        type: String,
        default: 'untitled'
    },
    description: {
        type: String,
        default: `Add description here
        🐍 You can add multiline description
        🐍 Let's start...`
    },
    position: {
        type: Number
    },
    favourite: {
        type: Boolean,
        default: false
    },
    favouritePosition: {
        type: Number,
        default: 0
    }
}, schemaOptions);


const Board = model<IBoard>("Board", boardSchema);

export default Board;