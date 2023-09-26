import { Router } from "express";
import { changeRole, uploadDocuments, getAllUsers, deleteInactiveUsers, adminUserView } from "../controllers/user.controllers.js";
import { upload } from "../config/multer.config.js";
import { isAuthorize } from "../middlewares/checkUser.js";

const routerUsers = Router();

routerUsers.get("/", getAllUsers);
routerUsers.get("/changeRole/:uid", isAuthorize, changeRole);
routerUsers.post("/:uid/documents", upload.array("documents", 5), uploadDocuments);

routerUsers.get("/adminView/:uid", isAuthorize, adminUserView);
routerUsers.delete("/deleteInactiveUsers", deleteInactiveUsers);

export { routerUsers };
