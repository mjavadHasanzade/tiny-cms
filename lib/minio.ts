const Minio = require("minio");
const multer = require("multer");
const multerMinio = require("multer-minio-storage-engine");

export const minioClient = new Minio.Client({
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  useSSL: false,
});

const upload = multer({
  storage: multerMinio({
    minio: minioClient,
    bucketName: "default",
    metaData: function (req: any, file: any, cb: any) {
      cb(null, { fieldName: file.fieldname });
    },
    objectName: function (req: any, file: any, cb: any) {
      cb(null, Date.now().toString() + file.originalname);
    },
  }),
});
export default upload;
