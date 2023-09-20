import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app.js'; 
import { addProduct, deleteProduct } from '../src/controllers/product.controllers.js'; 
import {productModel} from '../src/dao/models/product.model.js'; 

chai.use(chaiHttp);
const { expect } = chai;

describe('Products Routes', () => {
  let productId;


  before(async () => {
    const productData = {
      name: 'Test Product',
      description: 'Test Description',
      price: 9.99,
    };
    const product = new productModel(productData);
    await product.save();
    productId = product._id;
  });


  after(async () => {
    await deleteProduct({ params: { id: productId } });
  });

  it('should get all products', (done) => {
    chai
      .request(app)
      .get('/api/products')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal('success');
        expect(res.body).to.have.property('products').to.be.an('array');
        done();
      });
  });

  it('should create a new product', (done) => {
    const newProduct = {
      name: 'New Product',
      description: 'New Description',
      price: 14.99,
    };

    chai
      .request(app)
      .post('/api/products')
      .send(newProduct)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal('success');
        expect(res.body).to.have.property('product').to.be.an('object');
        productId = res.body.product._id; 
        done();
      });
  });

  it('should update a product', (done) => {
    const updatedProduct = {
      name: 'Updated Product Name',
      description: 'Updated Product Description',
      price: 12.99,
    };

    chai
      .request(app)
      .put(`/api/products/${productId}`)
      .send(updatedProduct)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('msg').to.equal('Producto actualizado');
        done();
      });
  });

  it('should delete a product', (done) => {
    chai
      .request(app)
      .delete(`/api/products/${productId}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(204);
        done();
      });
  });
});
