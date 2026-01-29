const { getCookies } = require("@/app/action")
const { axiosInstance } = require("@/axios/axios")
const saveUserPost=async(data)=>{
    try {
        let response=await axiosInstance.post('/user/savePost',data,
           {
            headers: {
                "wedoraCredentials":await getCookies()
        }
           })
           //console.log(response.data);
           
    } catch (error) {
        //(error);
    }
}
export {saveUserPost}