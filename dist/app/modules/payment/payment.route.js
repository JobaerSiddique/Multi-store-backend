"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoute = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const router = express_1.default.Router();
router.post("/", payment_controller_1.PaymentController.createOrderPaymet);
router.post("/success/:transactionId", payment_controller_1.PaymentController.paymentSuccess);
router.post("/ssl/:orderId", payment_controller_1.PaymentController.createSslPayment);
router.get("/ssl/ipn", payment_controller_1.PaymentController.ValidPaymentSSL);
exports.PaymentRoute = router;
