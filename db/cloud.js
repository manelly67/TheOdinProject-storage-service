const myObject = {};
const dotenv = require('dotenv');
dotenv.config({ processEnv: myObject });

const connectionString =
  process.env.CLOUDINARY_URL || myObject.CLOUDINARY_URL;

const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  CLOUDINARY_URL: connectionString,
  secure: true,
});

/////////////////////////
// Uploads an image file
/////////////////////////
const uploadImage = async (imagePath) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      return result;
    } catch (error) {
      console.error(error);
    }
};

module.exports = {
    cloudinary,
    uploadImage,
};