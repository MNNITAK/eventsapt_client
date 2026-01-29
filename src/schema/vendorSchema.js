import {z} from "zod"
const vendorSchema=z.object({
    businessName:z.string().min(4,"Provide valid name"),
    businessEmail:z.string().email(),
    password:z.string().min(8,"Min 8 length"),
    businessPhone:z.string().min(12,"Length 12 required"),
    city:z.string().min(3,'Empty city'),
    address:z.string().min(5,"provide valid location"),
    gstNumber:z.string().min(15,"Length to be 15"),
    servicesProvided:z.array(z.string()).min(1,"Min 1 services has to be there"),
    citiesActive:z.array(z.string()).min(1,"Min 1 city hhas to be there")
})
export {vendorSchema}