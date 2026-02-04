
import axios from "axios"
const axiosInstance=axios.create(
    {
        baseURL:"http://localhost:4000/api",
        timeout:6000,
        withCredentials:true
    }
)
const pseudoAxios=axios.create({
    baseURL:"http://localhost:4000/api",
        withCredentials:true
})
const test = async(data)=>{

    try{
              const response=await axiosInstance.post(`http://localhost:4000/api/auth/user/login`,
           data
)
console.log("Login Response:", response.data)
    }
    catch(error){
        console.log("Error during login:", error);
    }

}
    
test({
  userid: "johny",
  password: "securepass123"
})
  



