
import axios from "axios"
import config from "../../config";



const ValidateSSl = async(payload:any)=>{
    try {
        const response = await axios({
    method:"GET",
    url:`https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${payload.val_id}&store_id=${config.ssl_store_id}&store_passwd=${config.ssl_store_pass}&format=json`
   })

   return response.data;
   
    } catch (error) {
        console.log(error)
    }
}

export const sslService={
    ValidateSSl
}