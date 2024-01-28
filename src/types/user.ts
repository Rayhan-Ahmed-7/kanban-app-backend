export interface IUser extends Document {
    username: string,
    password: string,
    comparePassword: (password: string) => boolean
}