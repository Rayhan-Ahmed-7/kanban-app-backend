import { Request, Response } from "express";
import { StatusCode } from "../../../types/util";
import User from "../../auth/models/user_model";

class UserController{
    async getUsers(req: Request, res: Response) {
        try {
            const users = await User.find().select({username:1,_id:1});

            res.status(StatusCode.success).json({
                message: "user  list rettrived.",
                data: users
            });

        } catch (err) {
            res.status(StatusCode.serverError).json({
                message: "failed to load user list",
                data: null,
                error: err
            })
        }
    }
}

export default UserController;