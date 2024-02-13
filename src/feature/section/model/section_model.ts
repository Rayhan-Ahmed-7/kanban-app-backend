import { Schema, model } from "mongoose";

interface SectionDoc extends Document {
    board: Schema.Types.ObjectId;
    title: string;
}

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

const Section = model<SectionDoc>("Section", sectionSchema);

export default Section;