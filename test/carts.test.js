import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app.js';
import { addCart, deleteCart } from '../src/controllers/cart.controllers.js'; 
import {Cart} from '../src/dao/models/cart.model.js'; 
import {productModel} from '../src/dao/models/product.model.js'; 

chai.use(chaiHttp);
const { expect } = chai;

describe('Cart Routes', () => {
  let cartId;
  let productId;

  before(async () => {
    const cart = new Cart();
    await cart.save();
    cartId = cart._id;

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
    await deleteCart({ params: { cid: cartId } });
    await productModel.findByIdAndRemove(productId);
  });

  it('should get all carts', (done) => {
    chai
      .request(app)
      .get('/api/carts')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should create a new cart', (done) => {
    chai
      .request(app)
      .post('/api/carts')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('_id');
        cartId = res.body._id; 
        done();
      });
  });

  it('should delete a cart', (done) => {
    chai
      .request(app)
      .delete(`/api/carts/${cartId}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('msg').to.equal('Carrito eliminado');
        done();
      });
  });

});
