import axios from 'axios';
import { createClient } from 'pexels';
const client = createClient('XrJqjzjCzNMW0hNCFnWZq0nq7RWsQK8b7YvfviDhG6F3xBHZvysPLEKw');
const query = 'Nature';
const create2DArray = (arr, n) => {
    const result = [];
    for (let i = 0; i < arr.length; i += n) {
        result.push(arr.slice(i, i + n));
    }
    return result;
};
const getVideoUrl=async(query="forest",page=1)=>{
    const videoResponse=await axios(`https://pixabay.com/api/videos/?key=48012297-063120112f8bc477731969d55&q=${encodeURIComponent(query)}&pretty=true`)
    const videoData=videoResponse?.data?.hits.filter((item,pos)=>pos==2 || pos == 4)
    //console.log(videoData[0]);
    return videoData   
}
const getImageUrl=async(query="indian wedding",page)=>{
    const res=await client.photos.search({query,per_page:12,page:page,orientation:'landscape'})    
    let result=create2DArray(res.photos,4)
    return result
}
export {getVideoUrl,getImageUrl}
