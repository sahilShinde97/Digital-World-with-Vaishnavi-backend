import cloudinary from "../config/cloudinary.js";
import { Readable } from 'stream';

const cloudinaryUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    // Create a readable stream from the buffer
    const stream = Readable.from(req.file.buffer);

    // Upload to Cloudinary using streaming
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          chunk_size: 6000000, // 6MB chunks
          timeout: 300000, // 5 minutes
          eager: [
            { format: "mp4", quality: "auto" },
            { format: "webm", quality: "auto" }
          ],
          eager_async: true,
          invalidate: true,
          use_filename: true,
          unique_filename: true,
          overwrite: true
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Handle stream errors
      stream.on('error', (error) => {
        console.error("Stream error:", error);
        reject(error);
      });

      // Pipe the stream to Cloudinary
      stream.pipe(uploadStream);
    });

    // Store the Cloudinary URL in req.body
    if (req.file.fieldname === 'video') {
      req.body.video = result.secure_url;
    } else if (req.file.fieldname === 'image') {
      req.body.image = result.secure_url;
    }

    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error uploading file to Cloudinary",
      error: error.message 
    });
  }
};

export default cloudinaryUpload;