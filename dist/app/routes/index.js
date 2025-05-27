"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const product_route_1 = require("../modules/product/product.route");
const order_route_1 = require("../modules/order/order.route");
const wholesale_route_1 = require("../modules/WholeSellOrder/wholesale.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/",
        route: user_route_1.UserRoute
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoute
    },
    {
        path: "/product",
        route: product_route_1.ProductRoutes
    },
    {
        path: "/order",
        route: order_route_1.OrderRoute
    },
    {
        path: "/wholeSale",
        route: wholesale_route_1.WholeSaleRoute
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
