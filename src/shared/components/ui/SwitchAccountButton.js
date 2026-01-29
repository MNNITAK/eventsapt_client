"use client";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/app/Components/ui/Card";
import Image from "next/image";
import { motion } from "framer-motion";
import Logo from "@/shared/common/logo"
import Linkbutton from "../../common/linkbutton";
import Link from "next/link";
export function SwitchAccount() {
  return (
   <>
   <Modal>
   <ModalTrigger>
   <div className="text-[#C94C73]">Switch Account</div>
   </ModalTrigger>
   <ModalContent>
   <ModalBody>
   <h2 className="text-center text-[#70706f] mt-3 text-semibold text-lg">Identify yourself to </h2>
   <div className="mt-2"><Logo/></div>
   <div className="w-[100%] flex flex-col items-center py-5 mt-10">
    <Link className="w-[80%] text-center bg-[#C94C73] text-white py-2 text-bold  rounded-[25px]" href={`/authPage/vendor`}>Vendor</Link>
    <Link className="w-[80%] text-center bg-[#FFECEC] text-[#C94C73] py-2 mt-4 text-bold  rounded-[25px]" href={`/authPage/user`}>User</Link>
   </div>
   </ModalBody>
   </ModalContent>
   </Modal>
   </>
  );
}