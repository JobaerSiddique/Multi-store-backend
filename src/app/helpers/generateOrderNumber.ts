import { Order } from "../modules/order/order.model";
import { OrderType } from "../modules/types";

// Helper function to get prefix based on order type
const getOrderPrefix = (orderType: OrderType): string => {
    const prefixes = {
      [OrderType.LOCAL]: 'LOC',   // Example: "LOC" for Local orders
      [OrderType.WHOLESALE]: 'WHO', // "WHO" for Wholesale orders
      [OrderType.ONLINE]: 'ONL'   // "ONL" for Online orders
    };
    return prefixes[orderType] || 'ORD'; // Default: "ORD"
  };
  
  // Function to generate a unique order number
 export const generateOrderNumber = async (orderType: OrderType): Promise<string> => {
    const prefix = getOrderPrefix(orderType);
    const today = new Date();
    
    // Format: YYYYMMDD (e.g., 20240515 for May 15, 2024)
    const datePart = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
    
    // Find the latest order with the same prefix and date
    const lastOrder = await Order.findOne(
      { orderNumber: new RegExp(`^${prefix}${datePart}`) }, // Matches prefix + date
      { orderNumber: 1 },
      { sort: { orderNumber: -1 } } // Sort by orderNumber (descending)
    ).exec();
  
    // Start sequence from 1 (if no orders exist) or increment the last sequence
    let sequence = 1;
    if (lastOrder?.orderNumber) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-3), 10); // Extract last 3 digits
      sequence = lastSequence + 1;
    }
  
    // Format: [PREFIX][YYYYMMDD][3-digit sequence]
    return `${prefix}${datePart}${sequence.toString().padStart(3, '0')}`;
  };