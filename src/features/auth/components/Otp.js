'use client'
import React from 'react';
import { useState } from 'react';
import { OtpInput } from 'reactjs-otp-input';
const Otp = () => {
  const [otp, setOtp] = useState('');
  const handleChange = (otp) => setOtp(otp);
  return (
    <OtpInput shouldAutoFocus inputStyle={{border:'1px solid #C94C73',padding:'5px',margin:'5px',width:'50px',borderRadius:'5px',height:'50px'}} value={otp} onChange={handleChange} numInputs={6} separator={<span>-</span>} />
  )
};
export {Otp}