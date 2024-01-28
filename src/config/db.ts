import mongoose from "mongoose";
import AppCredentials from "../helper/credentials";

class DataBase {
    async connect() {
        try {
            await mongoose.connect(AppCredentials.DB_URL, );
            console.log("db is connected");
        } catch (err) {
            console.log("MongoDb connect error: ", err);
            process.exit(1);
        }
    }
}

export default new DataBase();