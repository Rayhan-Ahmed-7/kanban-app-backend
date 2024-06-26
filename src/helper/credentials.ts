import dotenv from "dotenv";
dotenv.config({
  path: "src/config/.env",
});
class AppCredentials {
  static PORT = process.env.PORT || 8000;
  static DB_URL = process.env.DB_LIVE_URL || "";
  static JWT_SECRET = process.env.JWT_SECRET || "";
}

export default AppCredentials;
