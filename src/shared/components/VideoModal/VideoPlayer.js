import React from 'react';
import ReactPlayer from 'react-player/lazy';
import Image from 'next/image';
const VideoPlayer = ({PostUrl,thumbnail}) => {
  return (
    <>
      <ReactPlayer
        width="100%"
        height="100%"
        url={PostUrl}
        controls={true}
        light={<Image  style={{objectFit:"cover"}} priority fill={true} layout="fill" src={thumbnail} alt="thumbnail"/>}
       
      />
    </>
  );
}
export {VideoPlayer}