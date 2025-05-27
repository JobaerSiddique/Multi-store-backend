import { WholeSale } from "./wholesell.model"



const getAllWholeSaleOrder = async()=>{
    const result = await WholeSale.find().populate('order')
        
    
    return result
}


export const WholeSaleService = {
    getAllWholeSaleOrder
}