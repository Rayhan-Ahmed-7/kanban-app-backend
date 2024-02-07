import { Schema, model } from "mongoose";

const taskSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "Section",
        required: true,
    },
    title: {
        type: String,
        defautl: ''
    },
    content: {
        type: String,
        default: ''
    },
    position: {
        type: Number
    }
})

const Task = model("Task", taskSchema);

export default Task;