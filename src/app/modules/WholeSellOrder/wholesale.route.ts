import express from 'express';
import { WholeSaleController } from './wholesale.controller';


const router = express.Router();


router.get('/',WholeSaleController.getAllWholeSale)



export const WholeSaleRoute = router; 