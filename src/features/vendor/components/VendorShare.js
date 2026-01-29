import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { WhatsappIcon,FacebookIcon,InstapaperIcon,RedditIcon,WhatsappShareButton,FacebookShareButton,InstapaperShareButton,RedditShareButton } from 'react-share';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)', 
  height: '25vh',
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
export  function VendorShare({showModal,setModal}) {
  const [open, setOpen] = React.useState(showModal);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={showModal}
        onClose={setModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div  className='bg-white py-2 flex md:w-[25vw] w-[95%] fex-col items-center justify-center' style={style}>
            <div className='w-[95%]'>
            <p className='w-[100%] relative bg-red-200'><button onClick={()=>{setModal(false)}} className='absolute right-0'>x</button></p>
            <p>Copy link</p>
            <div className='flex'>
                <input className='bg-gray-100 px-2 py-2 text-gray-500 w-[100%] rounded-lg' type='text' value={`${window.location.href}`} readOnly/>
                <button className='bg-[#C94C73]  py-2 text-white font-normal px-5 rounded-lg'>Copy</button>
            </div>
            <div className='w-[50%] mx-auto mt-3'>
            {/* <p>Social</p> */}
            <div className='flex'>
                <WhatsappShareButton className='ml-2' url={`${window.location.href}`}><WhatsappIcon size={50} round={true}/></WhatsappShareButton>
                <FacebookShareButton className='ml-2' url={`${window.location.href}`}><FacebookIcon size={50} round={true}/></FacebookShareButton>
                <InstapaperShareButton className='ml-2' url={`${window.location.href}`}><InstapaperIcon size={50} round={true}/></InstapaperShareButton>
            </div>
            </div>
            </div>
        </div>
      </Modal>
    </div>
  );
}
