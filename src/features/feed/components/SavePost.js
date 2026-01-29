import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FaRegBookmark } from "react-icons/fa6";
import { useState } from 'react';
import { FaBookmark } from "react-icons/fa6";
import { saveUserPost } from '@/features/user/api/savePost';
 function Save({savePayLoad,isSavedByUser}) {
  let [isSaved,setSave]=useState(isSavedByUser)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  let savePost=async(e)=>{
    if(!isSaved){
      handleClick(e)
    }else{
      savePayLoad={...savePayLoad,saveType:"post",status_type:false}
      await saveUserPost(savePayLoad)
      setSave(false)
    }
  }
  const savePostApi=async(saveType="vendor")=>{ // be careful with value ofsave type here,backend ony handles these two
    setSave(true);
    savePayLoad={...savePayLoad,saveType:saveType,status_type:true}
    await saveUserPost(savePayLoad)
    handleClose()
  }
  return (
    <div>
      <span onClick={(e)=>{savePost(e)}}>{
        isSaved ? <FaBookmark className='text-[#C94C73] text-2xl'/>:<FaRegBookmark className=' text-2xl'/>
        }</span>
      {
         <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography onClick={()=>{savePostApi("idea")}} className='cursor-pointer hover:bg-gray-200' sx={{ p: 1,px:2 }}>Save as an Idea</Typography>
        <Typography onClick={()=>{savePostApi("vendor")}} className='cursor-pointer hover:bg-gray-200' sx={{ p: 1,px:2 }}>Save as a Vendor</Typography>
      </Popover> 
      }
    </div>
  );
}
export {Save}
