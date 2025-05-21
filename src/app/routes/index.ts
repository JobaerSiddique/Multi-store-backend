import express from 'express'
import { UserRoute } from '../modules/user/user.route';
import { AuthRoute } from '../modules/auth/auth.route';
import { ProductRoutes } from '../modules/product/product.route';


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
    }
]


moduleRoutes.forEach((route)=>router.use(route.path,route.route) )

export default router;