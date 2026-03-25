

export default async function UserProfilePage({params,searchParams}){
    const data=await searchParams;
    //console.log(data,"params");
    return( 
        <div className="w-full h-[100%] text-md text-gray-400 font-medium mt-12 my-auto flex justify-center items-center">
            Looking to handle your profile?
        </div>
    )
}