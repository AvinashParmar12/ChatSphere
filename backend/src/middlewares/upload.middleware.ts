import multer from "multer";

// ==============================
// Multer Memory Storage
// ==============================

const storage = multer.memoryStorage();

// ==============================
// File Filter
// ==============================

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image files are allowed"
      )
    );
  }
};

// ==============================
// Upload Middleware
// ==============================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export default upload;