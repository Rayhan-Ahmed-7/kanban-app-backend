import { Document } from "mongoose"
import { IUser } from "../types/user"

export const schemaOptions = {
    toJSON: {
        virtuals: true,
        // transform: (doc: Document, ret: IUser ) => {
        //     delete ret.
        // }
        
        versionKey: false,
    },
    toObject: {
        virtuals: true
    },
    timeStamp: true
}