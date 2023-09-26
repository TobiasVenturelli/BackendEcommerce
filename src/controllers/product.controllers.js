import * as productServices from "../services/product.services.js";
import { EErrors, customError } from "../utils/customErro.js";
import { generateProducts } from "../utils/generateProducts.js";
import { logger } from "../utils/logger.js";
import { sendProductDeletionEmail } from "../utils/sendProductDeletionEmail.js";

const getAllProducts = async (req, res) => {
  try {
    const resProducts = await productServices.getAllProducts(req.query);

    const { totalPages, docs, hasPrevPage, hasNextPage, prevPage, nextPage } = resProducts;
    res.status(200).json({
      status: "success",
      products: docs,
      totalPages,
      prevPage,
      nextPage,
      page: resProducts.page,
      hasPrevPage,
      hasNextPage,
      prevLink: `http://localhost:8081/products?page=${prevPage}`,
      nextLink: `http://localhost:8081/products?page=${nextPage}`,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Server internal error" });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const resProduct = await productServices.getProductById(id);

    res.status(200).json(resProduct);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Server internal error" });
  }
};

const addProduct = async (req, res) => {
  const body = req.body;
  try {
    const user = req.session.user;
    // Verificamos si el usuario es premium y si lo es, le asignamos el producto
    if (user.role === "premium") {
      const newProduct = { ...body, owner: user.email };
      const resProducts = await productServices.addProduct(newProduct);
      return res.status(200).json(resProducts);
    }

    const resProducts = await productServices.addProduct(body);

    res.status(200).json(resProducts);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Server internal error" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    await productServices.updateProduct(id, body);
    const product = await productServices.getProductById(id);

    res.status(200).json({
      msg: "Producto actualizado",
      product,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Server internal error" });
  }
};


const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productServices.getProductById(id);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const user = req.session.user;
    if (product.owner === user.email) {
      await productServices.deleteProduct(id);
      if (user.role === "premium") {
        await sendProductDeletionEmail(user.email, product.name);
      }
      res.status(200).json({ msg: "Producto eliminado con éxito" });
    } else {
      res.status(403).json({ error: "No tiene permisos para realizar esta acción" });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


const generateMockingProducts = async (req, res) => {
  try {
    const products = generateProducts();
    if (products.length > 1)
      customError({
        name: "Error mock",
        message: "Error al generar productos de mock",
        cause: "Error en el servidor",
        code: EErrors.PRODUCT_NOT_FOUND,
      });
    res.status(200).json(products);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Server internal error" });
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export { addProduct, deleteProduct, generateMockingProducts, getAllProducts, getProductById, updateProduct };
