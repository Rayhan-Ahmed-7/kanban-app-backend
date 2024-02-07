import { Schema, model } from "mongoose";

const sectionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "Board",
        required: true,
    },
    title: {
        type: String,
        defautl: ''
    }
})

const Section = model("Section", sectionSchema);

export default Section;