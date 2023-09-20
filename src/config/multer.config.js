import multer from "multer";

export const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          let destinationFolder = "documents";
          if (file.fieldname === "profileImage") {
               destinationFolder = "profiles";
          } else if (file.fieldname === "productImage") {
               destinationFolder = "products";
          }
          cb(null, destinationFolder);
     },
     filename: (req, file, cb) => {

          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const extension = file.originalname.split(".").pop();
          const fileName = file.fieldname + "-" + uniqueSuffix + "." + extension;
          cb(null, fileName);
     },
});

export const upload = multer({ storage: storage });


