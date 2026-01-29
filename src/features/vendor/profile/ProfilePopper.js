'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { MdEventNote } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdAppSettingsAlt } from "react-icons/md";
import Link from 'next/link';
import { IoPersonRemove } from "react-icons/io5";
function ProfilePopper() {
    const profileOptions = [
        {
            mode:"1",
            info:"Profile",
            icon:<IoPersonRemove/>
        },
        {
            mode:"2",
            info:"Add event",
            icon:<MdEventNote/>
        },
        {
            mode:"3",
            info:"Dashboard",
            icon:<LuLayoutDashboard/>
        },
        {
            mode:"3",
            info:"Settings",
            icon:<MdAppSettingsAlt/>
        }

    ]
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  return (
    <div>
        <button aria-describedby={id} type="button" onClick={handleClick} className="absolute top-3 right-6 text-[#9A2143] flex items-center"><HiMiniBars3BottomRight className="mr-1"/> More</button>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <div className='w-[14vw] py-3 bg-white min-h-[10vh] flex flex-col items-center border shadow-lg border-gray-500 rounded-md mr-2'>
            {
                profileOptions.map((item,pos)=>{
                    return <Link href={"/"} key={pos} className='w-[95%] hover:bg-[#d16b8b] transition-all duration-200 hover:text-white rounded-md justify-center  py-3 mt-1 flex items-center text-center'>
                        <span className='mr-2'>{item.icon}</span>
                        <span  >{item.info}</span>
                    </Link>
                })
            }
        </div>
      </Popper>
    </div>
  );
}
export { ProfilePopper }
