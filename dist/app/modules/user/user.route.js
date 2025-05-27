"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.post('/create-user', user_controller_1.UserController.createUser);
router.post('/createAdmin', user_controller_1.UserController.createAdmin);
router.post('/createLocal', user_controller_1.UserController.createLocalUser);
router.post('/createWhole', user_controller_1.UserController.createWholerSeller);
router.get('/user', user_controller_1.UserController.getAllUser);
router.delete('/user/:id', user_controller_1.UserController.deleteUser);
router.put('/user/:id', user_controller_1.UserController.userStatus);
exports.UserRoute = router;
