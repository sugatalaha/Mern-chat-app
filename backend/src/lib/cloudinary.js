import {v2 as cloudinary, v2} from "cloudinary";
import {config} from "dotenv";

config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLODINARY_API_SECRET 
});

export default cloudinary;