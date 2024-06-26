import { Document, Schema, Types } from "mongoose";

export interface IBoard extends Document {
    user: Types.ObjectId;
    icon: string;
    title: string;
    description: string;
    position?: number;
    favourite: boolean;
    favouritePosition: number;
}

