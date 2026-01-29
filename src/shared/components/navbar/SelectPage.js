'use client';
import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CgOptions } from "react-icons/cg";
import { LogoutButton } from '../../common/logoutButton';
export default function SelectPage() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <div className='ml-1'>
      <span className='text-[#C94C73] cursor-pointer' onClick={handleClick}>
        <CgOptions/>
      </span>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
      >
        <Typography sx={{ paddingTop: 2,paddingX:4 }}>Favourites</Typography>
        <Typography sx={{ paddingBottom:2,paddingX:4 }}>Settings</Typography>
        <Typography sx={{ paddingBottom:2,paddingX:4 }}><LogoutButton/></Typography>
      </Popover>
    </div>
  );
}
