export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    WHOLESALE_CUSTOMER = 'WHOLESALE_CUSTOMER',
    LOCAL_CUSTOMER = 'LOCAL_CUSTOMER',
    ONLINE_CUSTOMER = 'ONLINE_CUSTOMER',
  }
  
  export enum UserStatus {
    ACTIVE = 'ACTIVE',
    BLOCKED = 'BLOCKED',
  }
  
  export enum ProductCategory {
    GROCERY = 'GROCERY',
    ELECTRONICS = 'ELECTRONICS',
    CLOTHING = 'CLOTHING',
    FISHFEED="FISHFEED",
    CHICKENFEED="CHICKEN FEED"
  }
  
  export enum ProductSize {
    SMALL = 'SMALL',
    MEDIUM = 'MEDIUM',
    LARGE = 'LARGE',
    XL = 'XL',
  }
  
  export enum SaleChannel {
    LOCAL = 'LOCAL',
    WHOLESALE = 'WHOLESALE',
    ONLINE = 'ONLINE',
  }
  
  export enum OrderType {
    LOCAL = 'LOCAL',
    WHOLESALE = 'WHOLESALE',
    ONLINE = 'ONLINE',
  }
  
  export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
  }
  
  export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    PARTIAL = 'PARTIAL',
    FAILED = 'FAILED',
  }
  
  export enum ReportType {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    HALF_YEARLY = 'HALF_YEARLY',
    YEARLY = 'YEARLY',
  }