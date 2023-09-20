import { Router } from "express";
import { changeRole, uploadDocuments } from "../controllers/user.controllers.js";
import { upload } from "../config/multer.config.js";

const routerUsers = Router();


routerUsers.get("/changeRole/:uid", changeRole);
routerUsers.post("/:uid/documents", upload.array("documents", 5), uploadDocuments);

export { routerUsers };
