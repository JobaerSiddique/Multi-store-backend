"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WholeSaleRoute = void 0;
const express_1 = __importDefault(require("express"));
const wholesale_controller_1 = require("./wholesale.controller");
const router = express_1.default.Router();
router.get('/', wholesale_controller_1.WholeSaleController.getAllWholeSale);
exports.WholeSaleRoute = router;
