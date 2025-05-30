import express from 'express'
import { UserRoute } from '../modules/user/user.route';
import { AuthRoute } from '../modules/auth/auth.route';
import { ProductRoutes } from '../modules/product/product.route';
import { OrderRoute } from '../modules/order/order.route';
import { WholeSaleRoute } from '../modules/WholeSellOrder/wholesale.route';
import { PaymentRoute } from '../modules/payment/payment.route';


const router = express.Router();


const moduleRoutes = [
    {
        path:"/",
        route:UserRoute
    },
    {
        path:"/auth",
        route:AuthRoute
    },
    {
        path:"/product",
        route:ProductRoutes
    },
    {
        path:"/order",
        route:OrderRoute
    },
    {
        path:"/wholeSale",
        route:WholeSaleRoute
    },
    {
        path:"/payment",
        route:PaymentRoute
    }
]


moduleRoutes.forEach((route)=>router.use(route.path,route.route) )

export default router;