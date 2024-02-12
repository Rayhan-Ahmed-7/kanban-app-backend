import { Schema, model } from "mongoose";

const sectionSchema = new Schema({
    board: {
        type: Schema.Types.ObjectId,
        ref: "Board",
        required: true,
    },
    title: {
        type: String,
        defautl: 'Untitled'
    }
})

const Section = model("Section", sectionSchema);

export default Section;