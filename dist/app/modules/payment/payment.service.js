"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const order_model_1 = require("../order/order.model");
const mongoose_1 = __importDefault(require("mongoose"));
const generateTrans_1 = require("../../utils/generateTrans");
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../config"));
const payment_model_1 = require("./payment.model");
const ssl_service_1 = require("../SSL/ssl.service");
const createPaymentOrderIntoDB = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Validate order existence
        const order = yield order_model_1.Order.findOne({ _id: orderId, isDeleted: false }).session(session);
        if (!order) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order Not Found");
        }
        const transactionId = (0, generateTrans_1.generateTransactionId)();
        // Create payment document
        const payment = new payment_model_1.Payment({
            order: order._id,
            transactionId,
            amount: order.totalAmount,
            status: "PENDING",
        });
        yield payment.save({ session });
        console.log(config_1.default.store_pass);
        const requestData = {
            store_id: config_1.default.store_id,
            signature_key: config_1.default.store_pass,
            amount: order.totalAmount,
            currency: 'BDT',
            tran_id: transactionId,
            desc: 'Payment for order',
            cus_name: 'dfgdfg',
            cus_email: 'dfgdfg@g.com',
            cus_phone: 'dfg',
            cus_add1: 'dfgdfg',
            success_url: `http://localhost:5000/api/v1/payment/success/${transactionId}`,
            fail_url: "dfgsdgf",
            cancel_url: "dfgdfg",
            type: 'json'
        };
        const response = yield axios_1.default.post(config_1.default.store_url, requestData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(response.data.payment_url);
        const GatewayURl = response.data.payment_url;
        yield session.commitTransaction();
        session.endSession();
        return GatewayURl;
    }
    catch (error) {
        // Rollback transaction and log error
        yield session.abortTransaction();
        session.endSession();
        console.error("Error creating payment order:", error);
        throw error;
    }
});
const handlePaymentSuccess = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Verify payment with AmarPay
        const verificationResponse = yield axios_1.default.get('https://sandbox.aamarpay.com/jsonpost.php/verify', {
            params: {
                store_id: config_1.default.store_id,
                signature_key: config_1.default.store_pass,
                tran_id: transactionId
            }
        });
        // Update payment status
        const payment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId }, {
            status: "COMPLETED",
            paymentDate: new Date(),
            paymentMethod: "AmarPay",
            transactionDetails: verificationResponse.data
        }, { new: true, session }).populate('order');
        if (!payment) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Payment record not found");
        }
        // Update order status
        const order = yield order_model_1.Order.findById(payment.order);
        if (!order) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order record not found");
        }
        order.paidAmount = order.totalAmount; // Mark full payment
        order.dueAmount = 0; // No due amount remaining
        order.paymentStatus = "PAID"; // Update status to PAID
        yield order.save({ session });
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        console.log("Payment and Order updated successfully:", payment);
        return payment;
    }
    catch (error) {
        // Rollback the transaction in case of error
        yield session.abortTransaction();
        session.endSession();
        console.error("Error handling payment success:", error);
        throw error;
    }
});
const createSslCommerzPayment = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Validate order existence
        const order = yield order_model_1.Order.findOne({ _id: orderId, isDeleted: false }).session(session);
        if (!order) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order Not Found");
        }
        if (order.paymentStatus === "PAID") {
            throw new AppError_1.default(http_status_1.default.BAD_GATEWAY, "Bill Already Paid");
        }
        const transactionId = (0, generateTrans_1.generateTransactionId)();
        // Create payment document
        const payment = new payment_model_1.Payment({
            order: order._id,
            transactionId,
            amount: order.totalAmount,
            status: "PENDING",
        });
        yield payment.save({ session });
        const data = {
            store_id: config_1.default.ssl_store_id,
            store_passwd: config_1.default.ssl_store_pass,
            total_amount: order.totalAmount,
            currency: "BDT",
            tran_id: transactionId, // use unique tran_id for each api call
            success_url: 'http://localhost:3030/success',
            fail_url: 'http://localhost:3030/fail',
            cancel_url: 'http://localhost:3030/cancel',
            ipn_url: 'http://localhost:3030/ipn',
            shipping_method: 'Courier',
            product_name: 'Computer.',
            product_category: 'Electronic',
            product_profile: 'general',
            cus_name: 'Customer Name',
            cus_email: 'customer@example.com',
            cus_add1: 'Dhaka',
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01711111111',
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };
        console.log(data);
        const response = yield (0, axios_1.default)({
            method: 'post',
            url: config_1.default.ssl_store_url,
            data: data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        console.log(response);
        const GatewayPageURL = response.data.GatewayPageURL;
        console.log(GatewayPageURL);
        yield session.commitTransaction();
        session.endSession();
        return GatewayPageURL;
    }
    catch (error) {
        // Rollback transaction and log error
        yield session.abortTransaction();
        session.endSession();
        console.error("Error creating payment order:", error);
        throw error;
    }
});
const handleSslPaymentSuccess = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        //  if(!payload || !payload.status || payload.status !== "VALID"){
        //   throw new AppError(httpStatus.BAD_REQUEST,"Invaild Payment")
        //  }
        const response = yield ssl_service_1.sslService.ValidateSSl(payload);
        //   if(response?.status !=="VALID"){
        //   throw new AppError(httpStatus.BAD_GATEWAY,"Payment Failed")
        //  }
        const payment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: response.tran_id }, {
            status: "COMPLETED",
            paidAt: new Date().toLocaleDateString(),
            gateway: "SSLCommerz",
            paymentDetails: response
        }, { new: true, session }).populate('order');
        if (!payment) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Payment record not found");
        }
        // Update order status
        const order = yield order_model_1.Order.findById(payment.order);
        if (!order) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order record not found");
        }
        order.paidAmount = order.totalAmount; // Mark full payment
        order.dueAmount = 0; // No due amount remaining
        order.paymentStatus = "PAID"; // Update status to PAID
        yield order.save({ session });
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
    }
    catch (error) {
        // Rollback the transaction in case of error
        yield session.abortTransaction();
        session.endSession();
        console.error("Error handling payment success:", error);
        throw error;
    }
});
exports.PaymentService = {
    createPaymentOrderIntoDB,
    handlePaymentSuccess,
    createSslCommerzPayment,
    handleSslPaymentSuccess
};
