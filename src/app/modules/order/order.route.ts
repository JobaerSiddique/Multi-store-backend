import express from 'express'
import { OrderController } from './order.controller';

const router  = express.Router();


router.post('/wholesaleOrder',OrderController.createWholeSaleOrder)



export const OrderRoute = router;