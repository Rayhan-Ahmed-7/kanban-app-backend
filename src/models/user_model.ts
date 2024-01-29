import { Schema, model } from "mongoose"
import bcrypt from "bcryptjs";
import { IUser } from "../types/user";
import { schemaOptions } from "./modelOptions";



const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, }
}, schemaOptions);
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

const User = model<IUser>("User", userSchema);

export default User;