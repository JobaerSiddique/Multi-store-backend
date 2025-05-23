"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
router.post('/login', auth_controller_1.AuthController.UserLogin);
router.post('/forget-password', auth_controller_1.AuthController.forgetPassword);
router.post('/reset-password', auth_controller_1.AuthController.resetPassword);
router.post('/refreshToken', auth_controller_1.AuthController.refreshToken);
exports.AuthRoute = router;
