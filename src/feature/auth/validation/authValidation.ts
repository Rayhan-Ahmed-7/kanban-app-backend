import { body } from "express-validator"
import User from "../models/user_model"


export const authValidation = [
    body("username")
        .notEmpty()
        .withMessage("username is required.")
        .bail()
        .isLength({ min: 8 })
        .withMessage("username must be at least 8 characters")
        .custom(async (value) => {
            // Check if a user with the provided username already exists
            const existingUser = await User.findOne({ username: value });
            if (existingUser) {
                // If user already exists, reject the promise with an error message
                return Promise.reject("User already exists with this username.");
            }
            // If user doesn't exist, resolve the promise
        }),
    body("password").isLength({ min: 8 }).withMessage("password must be at least 8 characters"),
    // body('username').custom(value => {
    //     User.findOne({ username: value }).then(user => {
    //         if (user) {
    //             return Promise.reject("user already exists with this username.")
    //         }
    //     })
    // }),
]