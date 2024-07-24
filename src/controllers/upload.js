const AWS = require("aws-sdk");
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
const uploadToS3 = async (filePath, fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  let mimeType;
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      mimeType = "image/jpeg";
      break;
    case ".png":
      mimeType = "image/png";
      break;
    default:
      mimeType = "application/octet-stream"; // valor por defecto
  }
  const fileContent = fs.readFileSync(filePath);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ACL: "public-read",
    ContentType: mimeType,
  };
  try {
    const data = await s3.upload(params).promise();
    fs.unlinkSync(filePath);
    console.log("Archivo local eliminado");
    console.log("Archivo subido exitosamente:", data.Location);
    return {
      success: true,
      message: "Archivo subido exitosamente",
      location: data.Location,
    };
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    return {
      success: false,
      message: "Error al subir el archivo",
      error,
    };
  }
};

module.exports = uploadToS3;
