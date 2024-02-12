import { Router } from "express"
import BoardController from "../controllers/board_controller";
import authMiddleware from "../../../middleware/authMiddleware";
import { param } from "express-validator";
import { isObjectId, validate } from "../../../utils/validate";

class BoardRoutes {
    router = Router();
    controller = new BoardController();
    constructor() {
        this.initializeRoutes()
    }
    initializeRoutes() {
        this.router.post('/create-board', authMiddleware.authenticate, this.controller.createBoard)
        this.router.get('/get-board/:boardId', param('boardId').custom(value => {
            if (!isObjectId(value)) {
                return Promise.reject('invalid id');
            } else {
                return Promise.resolve()
            }
        }), validate, authMiddleware.authenticate, this.controller.getBoard)
        this.router.put('/update-board/:boardId', param('boardId').custom(value => {
            if (!isObjectId(value)) {
                return Promise.reject('invalid id');
            } else {
                return Promise.resolve()
            }
        }), validate, authMiddleware.authenticate, this.controller.updateBoard)
        this.router.get('/get-favourite-boards', authMiddleware.authenticate, this.controller.getFavouriteBoards)
        this.router.put('/update-favourite-boards', authMiddleware.authenticate, this.controller.updateFavouritePosition)
        this.router.get('/get-boards', authMiddleware.authenticate, this.controller.getBoards)
        this.router.put('/update-boards', authMiddleware.authenticate, this.controller.updatePosition)
    }
}

export default new BoardRoutes().router;