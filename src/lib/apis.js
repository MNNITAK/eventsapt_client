let fetchCity=async(cityName)=>{
    //console.log(cityName);
    
    if(cityName!=""){
        let resp=await fetch(`https://api.api-ninjas.com/v1/city?name=${cityName}`,{
            method: 'GET',
            headers: {
                'X-Api-Key': '3Wlk1z/7EUfZob9p9l06Kg==014ARTIKUfZ9q2Jn',
            },
        })
        let data=await resp.json()
        //console.log(data);
        
        return data
    }     
}
export {fetchCity}