import * as userServices from "../services/user.services.js";
import { logger } from "../utils/logger.js";


const createUser = async (user) => {
  try {
    user.documents = [];
    user.last_connection = null;

    const newUser = await userServices.createUser(user);
    return newUser;
  } catch (error) {
    logger.error(error.message);
    throw error; 
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await userServices.getUserByEmail(email);
    return user;
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const user = await userServices.getUserById(id);
    return user;
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

const changePassword = async (email, newPassword) => {
  try {
    await userServices.changePassword(email, newPassword);
    return "Contraseña cambiada con éxito";
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

const changeRole = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await userServices.getUserById(uid);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
    
    if (user.role === "user" && (!user.documents || user.documents.length !== 3)) {
      return res.status(400).json({ error: "El usuario debe cargar los 3 documentos requeridos para convertirse en premium" });
    }
    await userServices.changeRole(user.email);
    const userUpdated = await userServices.getUserById(uid);

    res.status(200).json({ status: "success", msg: "Rol cambiado con éxito", newRole: userUpdated.role });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Server internal error" }); 
  }
};

const uploadDocuments = async (req, res) => {
  const { uid } = req.params;
  try {
    
    const user = await userModel.findById(uid);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    
    user.documents = req.files.map((file) => {
      return {
        name: file.originalname,
        reference: file.filename,
      };
    });

    await user.save();

    res.status(200).json({ status: "success", message: "Documentos cargados con éxito" });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export { createUser, getUserByEmail, getUserById, changePassword, changeRole, uploadDocuments };
