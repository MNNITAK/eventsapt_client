import {z} from "zod"
const userschema=z.union([
    z.object({
        username:z.string().min(3,"Username is small"),
        password:z.string().min(8,"Passowrd length has to to minimun 8"),
        email:z.string().email({message:"Email is not valid"}),
        phoneNumber:z.string().regex(/^\d+$/, "Provide a valid phone number").min(12,"Length should be 12").max(12,"Length should be 12"),
        usertype:z.string(),
        isGoogleAuthenticated:z.literal(false),
        locationCity:z.string().min(2,{message:"Location should not be empty"})
    }),
    z.object({
        username:z.string().min(3,"Username is small"),
        email:z.string().email({message:"Email is not valid"}),
        phoneNumber:z.string().regex(/^\d+$/, "Provide a valid phone number").min(12,"Length should be 12").max(12,"Length should be 12"),
        usertype:z.string(),
        isGoogleAuthenticated:z.literal(true),
        locationCity:z.string().min(2,{message:"Location should not be empty"})
    })
])
const loginSchema=z.union([
    z.object({
        userid:z.string().min(1,"Empty field"),
        password:z.string().min(4,"Passowrd length has to to minimun 8"),
        isGoogleAuthenticated:z.literal(false),
    }),
    z.object({
        userid:z.string().min(1,"Empty field"),
        isGoogleAuthenticated:z.literal(true),
    })
])
export {userschema,loginSchema}