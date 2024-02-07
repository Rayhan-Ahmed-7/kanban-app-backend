import { Router } from "express"
import BoardController from "../controllers/board_controller";
import authMiddleware from "../../../middleware/authMiddleware";

class BoardRoutes {
    router = Router();
    controller = new BoardController();
    constructor() {
        this.initializeRoutes()
    }
    initializeRoutes() {
        this.router.post('/create-board', authMiddleware.authenticate, this.controller.createBoard)
        this.router.get('/get-boards', authMiddleware.authenticate, this.controller.getBoards)
    }
}

export default new BoardRoutes().router;