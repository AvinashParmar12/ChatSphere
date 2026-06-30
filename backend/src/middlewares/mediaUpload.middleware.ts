import multer from "multer";

// ==============================
// Multer Memory Storage
// ==============================

const storage = multer.memoryStorage();

// ==============================
// Allowed Mime Types
// ==============================

const allowedMimeTypes = [
  "image/",
  "video/",
  "audio/",
  "application/",
];

// ==============================
// File Filter
// ==============================

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const isAllowed =
    allowedMimeTypes.some((type) =>
      file.mimetype.startsWith(type)
    );

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported file type"
      )
    );
  }
};

// ==============================
// Media Upload Middleware
// ==============================

const mediaUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
});

export default mediaUpload;