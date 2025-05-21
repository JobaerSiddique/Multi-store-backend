import * as z from 'zod';
import { ProductCategory, ProductSize, SaleChannel } from '../types';


 const  createProductSchema= z.object({
  name: z.string().nonempty('Required'),
  description: z.string().optional(),
  category: z.enum(['GROCERY', 'ELECTRONICS', 'CLOTHING', 'FISHFEED', 'CHICKEN FEED']),
  size: z.string().optional(),
  prices: z.object({
    local: z.number(),
    wholesale: z.number(),
    online: z.number(),
  }),
  stock: z.number(),
  saleChannels: z.array(z.string()).nonempty('At least one sale channel is required'),
})


 const  updateProductSchema= z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    category: z.enum(Object.values(ProductCategory) as [string, ...string[]]).optional(),
    size: z.enum(Object.values(ProductSize) as [string, ...string[]]).optional(),
    prices: z
      .object({
        local: z.number().min(0).optional(),
        wholesale: z.number().min(0).optional(),
        online: z.number().min(0).optional(),
      })
      .optional(),
    stock: z.number().min(0).optional(),
    images: z.array(z.string()).optional(),
    saleChannels: z
      .array(z.enum(Object.values(SaleChannel) as [string, ...string[]]))
      .min(1)
      .optional(),
  })

export const ProductValidation = {
  createProductSchema,
  updateProductSchema
}