export interface IUser {
    username: string,
    password: string,
    comparePassword: (password: string) => boolean
}