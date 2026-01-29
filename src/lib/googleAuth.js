import { signInWithPopup,GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebaseInit";
const LoginViaGoogle=(userDetails,setDetails)=>{
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        let {user,_tokenResponse}=result
        let {phoneNumber}=user
        let {email,firstName}=_tokenResponse
        setDetails({...userDetails,password:"",email:email,username:firstName,phoneNumber:phoneNumber || userDetails.phoneNumber,isGoogleAuthenticated:true})
        //console.log(email,firstName,phoneNumber);
        
        return {email,firstName,phoneNumber}
        // The signed-in user info.
       // const user = result.user;
        // ...
      }).catch((error) => {
        // Handle Errors here.
        //console.log(error);
        
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
}
const logViaGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const { user, _tokenResponse } = result;
    const { email, phoneNumber } = user;
    const { firstName } = _tokenResponse;

    const data = { email, firstName, phoneNumber };
    //console.log("User Data:", data); // Logs inside logViaGoogle
    return data; // Return resolved data
  } catch (error) {
    //console.error("Error during sign-in:", error);
    throw error; // Rethrow error for outer handling
  }
};


export {LoginViaGoogle,logViaGoogle}