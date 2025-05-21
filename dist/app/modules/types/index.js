"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportType = exports.PaymentStatus = exports.OrderStatus = exports.OrderType = exports.SaleChannel = exports.ProductSize = exports.ProductCategory = exports.UserStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["WHOLESALE_CUSTOMER"] = "WHOLESALE_CUSTOMER";
    UserRole["LOCAL_CUSTOMER"] = "LOCAL_CUSTOMER";
    UserRole["ONLINE_CUSTOMER"] = "ONLINE_CUSTOMER";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["BLOCKED"] = "BLOCKED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["GROCERY"] = "GROCERY";
    ProductCategory["ELECTRONICS"] = "ELECTRONICS";
    ProductCategory["CLOTHING"] = "CLOTHING";
    ProductCategory["FISHFEED"] = "FISHFEED";
    ProductCategory["CHICKENFEED"] = "CHICKEN FEED";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
var ProductSize;
(function (ProductSize) {
    ProductSize["SMALL"] = "SMALL";
    ProductSize["MEDIUM"] = "MEDIUM";
    ProductSize["LARGE"] = "LARGE";
    ProductSize["XL"] = "XL";
})(ProductSize || (exports.ProductSize = ProductSize = {}));
var SaleChannel;
(function (SaleChannel) {
    SaleChannel["LOCAL"] = "LOCAL";
    SaleChannel["WHOLESALE"] = "WHOLESALE";
    SaleChannel["ONLINE"] = "ONLINE";
})(SaleChannel || (exports.SaleChannel = SaleChannel = {}));
var OrderType;
(function (OrderType) {
    OrderType["LOCAL"] = "LOCAL";
    OrderType["WHOLESALE"] = "WHOLESALE";
    OrderType["ONLINE"] = "ONLINE";
})(OrderType || (exports.OrderType = OrderType = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["PARTIAL"] = "PARTIAL";
    PaymentStatus["FAILED"] = "FAILED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var ReportType;
(function (ReportType) {
    ReportType["DAILY"] = "DAILY";
    ReportType["WEEKLY"] = "WEEKLY";
    ReportType["MONTHLY"] = "MONTHLY";
    ReportType["HALF_YEARLY"] = "HALF_YEARLY";
    ReportType["YEARLY"] = "YEARLY";
})(ReportType || (exports.ReportType = ReportType = {}));
