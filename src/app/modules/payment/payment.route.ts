import express from 'express'
import { PaymentController } from './payment.controller';

const router = express.Router();

router.post("/",PaymentController.createOrderPaymet)
router.post("/success/:transactionId",PaymentController.paymentSuccess)
router.post("/ssl/:orderId",PaymentController.createSslPayment)
router.get("/ssl/ipn",PaymentController.ValidPaymentSSL)


export const PaymentRoute = router;