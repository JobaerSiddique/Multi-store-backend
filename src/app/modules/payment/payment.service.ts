import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Order } from "../order/order.model";
import mongoose from "mongoose";
import { generateTransactionId } from "../../utils/generateTrans";
import axios from "axios";
import config from "../../config";
import { Payment } from "./payment.model";
import { sslService } from "../SSL/ssl.service";




const createPaymentOrderIntoDB = async (orderId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate order existence
    const order = await Order.findOne({ _id: orderId, isDeleted: false }).session(session);

    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, "Order Not Found");
    }

    const transactionId = generateTransactionId();

    // Create payment document
    const payment = new Payment({
      order: order._id,
      transactionId,
      amount: order.totalAmount,
      status: "PENDING",
    });

    await payment.save({ session });



    console.log(config.store_pass);

    const requestData = {
        store_id: config.store_id,
        signature_key:config.store_pass,
        amount: order.totalAmount,
        currency:  'BDT',
        tran_id: transactionId,
        desc:  'Payment for order',
        cus_name:  'dfgdfg',
        cus_email: 'dfgdfg@g.com',
        cus_phone:  'dfg',
        cus_add1:  'dfgdfg',
        success_url: `http://localhost:5000/api/v1/payment/success/${transactionId}`,
        fail_url: "dfgsdgf",
        cancel_url: "dfgdfg",
        type: 'json'
      };
   
   const response = await axios.post(config.store_url as string, requestData, {
      headers: {
         "Content-Type": "application/json",
      },
    });

   console.log(response.data.payment_url);
    const GatewayURl = response.data.payment_url
   
    await session.commitTransaction();
    session.endSession();

    return GatewayURl

  } catch (error) {
    // Rollback transaction and log error
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating payment order:", error);
    throw error;
  }
};


const handlePaymentSuccess = async (transactionId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Verify payment with AmarPay
    const verificationResponse = await axios.get('https://sandbox.aamarpay.com/jsonpost.php/verify', {
      params: {
        store_id: config.store_id,
        signature_key: config.store_pass,
        tran_id: transactionId
      }
    });

   
    // Update payment status
    const payment = await Payment.findOneAndUpdate(
      { transactionId },
      { 
        status: "COMPLETED",
        paymentDate: new Date(),
        paymentMethod: "AmarPay",
        transactionDetails: verificationResponse.data
      },
      { new: true, session }
    ).populate('order');

    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, "Payment record not found");
    }

    // Update order status
    const order = await Order.findById(payment.order);

    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, "Order record not found");
    }

    order.paidAmount = order.totalAmount; // Mark full payment
    order.dueAmount = 0; // No due amount remaining
    order.paymentStatus = "PAID"; // Update status to PAID

    await order.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    console.log("Payment and Order updated successfully:", payment);
    return payment;

  } catch (error) {
    // Rollback the transaction in case of error
    await session.abortTransaction();
    session.endSession();
    console.error("Error handling payment success:", error);
    throw error;
  }
};

const createSslCommerzPayment = async(orderId:string)=>{
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate order existence
    const order = await Order.findOne({ _id: orderId, isDeleted: false }).session(session);

    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, "Order Not Found");
    }

    if(order.paymentStatus === "PAID"){
      throw new AppError(httpStatus.BAD_GATEWAY,"Bill Already Paid")
    }
    const transactionId = generateTransactionId();

    // Create payment document
    const payment = new Payment({
      order: order._id,
      transactionId,
      amount: order.totalAmount,
      status: "PENDING",
    });

    await payment.save({ session });



    

    const data = {
        store_id:config.ssl_store_id as string,
        store_passwd:config.ssl_store_pass as string,
        total_amount:order.totalAmount ,
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
    
    const response = await axios({
            method: 'post',
            url: config.ssl_store_url as string,
            data: data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        console.log(response);
        const GatewayPageURL=response.data.GatewayPageURL
        
        console.log(GatewayPageURL);
    await session.commitTransaction();
    session.endSession();

    return GatewayPageURL

  } catch (error) {
    // Rollback transaction and log error
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating payment order:", error);
    throw error;
  }
  
}



const handleSslPaymentSuccess = async (payload: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    
  //  if(!payload || !payload.status || payload.status !== "VALID"){
  //   throw new AppError(httpStatus.BAD_REQUEST,"Invaild Payment")
  //  }

   
const response = await sslService.ValidateSSl(payload)
//   if(response?.status !=="VALID"){
  //   throw new AppError(httpStatus.BAD_GATEWAY,"Payment Failed")
  //  }
const payment = await Payment.findOneAndUpdate(
      { transactionId:response.tran_id },
      { 
        status: "COMPLETED",
        paidAt: new Date().toLocaleDateString(),
        gateway: "SSLCommerz",
        paymentDetails: response
      },
      { new: true, session }
    ).populate('order');

    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, "Payment record not found");
    }

    // Update order status
    const order = await Order.findById(payment.order);

    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, "Order record not found");
    }

    order.paidAmount = order.totalAmount; // Mark full payment
    order.dueAmount = 0; // No due amount remaining
    order.paymentStatus = "PAID"; // Update status to PAID

    await order.save({ session });
    
  

  
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

   
   

  } catch (error) {
    // Rollback the transaction in case of error
    await session.abortTransaction();
    session.endSession();
    console.error("Error handling payment success:", error);
    throw error;
  }
};

export const PaymentService = {
  createPaymentOrderIntoDB,
  handlePaymentSuccess,
  createSslCommerzPayment,
  handleSslPaymentSuccess
};