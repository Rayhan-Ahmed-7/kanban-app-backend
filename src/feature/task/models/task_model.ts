import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    section: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled",
    },
    content: {
      type: String,
      default: "",
    },
    position: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Task = model("Task", taskSchema);

export default Task;
