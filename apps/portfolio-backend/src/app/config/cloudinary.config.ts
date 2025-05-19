let cloudinaryUpload: any = null;

try {
  const { v2: cloudinary } = require('cloudinary');
  const config = require('./index');
  
  cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });
  
  cloudinaryUpload = cloudinary;
} catch (error) {
  console.warn('Cloudinary not available');
}

export { cloudinaryUpload };