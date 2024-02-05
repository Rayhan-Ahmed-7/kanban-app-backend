import { body } from "express-validator"
import User from "../models/user_model"


export const authValidation = [
    body("username").isLength({ min: 8 }).withMessage("username must be at least 8 characters"),
    body("password").isLength({ min: 8 }).withMessage("password must be at least 8 characters"),
    // body('username').custom(value => {
    //     User.findOne({ username: value }).then(user => {
    //         if (user) {
    //             return Promise.reject("user already exists with this username.")
    //         }
    //     })
    // }),
]