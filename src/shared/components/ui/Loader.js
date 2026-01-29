import { LuLoaderCircle } from "react-icons/lu";
const Loader=()=>{
    return(
        <>
        <h1 className="w-[100%] h-[10vh] text-center"><LuLoaderCircle className="animate-spin mx-auto text-[30px]" /></h1>
        </>
    )
}
export {Loader}