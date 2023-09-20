import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app'; 
const expect = chai.expect;

chai.use(chaiHttp);

describe('Session Routes', () => {
  it('should login with valid credentials', async () => {
    const userCredentials = { username: 'testuser', password: 'testpassword' };
    const res = await chai.request(app).post('/api/sessions/login').send(userCredentials);
    expect(res).to.have.status(200);
    expect(res.body.status).to.equal('success');
  });

  it('should fail to login with invalid credentials', async () => {
    const userCredentials = { username: 'invaliduser', password: 'invalidpassword' };
    const res = await chai.request(app).post('/api/sessions/login').send(userCredentials);
    expect(res).to.have.status(400);
    expect(res.body.status).to.equal('error');
    expect(res.body.message).to.equal('Error credenciales inválidas');
  });

  it('should logout', async () => {
    const res = await chai.request(app).post('/api/sessions/logout');
    expect(res).to.have.status(200);
    expect(res.body.message).to.equal('Sesión cerrada');
  });

  it('should register a new user', async () => {
    const newUser = { username: 'newuser', password: 'newpassword' }; 
    const res = await chai.request(app).post('/api/sessions/register').send(newUser);
    expect(res).to.have.status(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.message).to.equal('Usuario registrado');
  });

  it('should fail to register a new user with invalid data', async () => {
    const invalidUser = { username: 'newuser', password: '' };
    const res = await chai.request(app).post('/api/sessions/register').send(invalidUser);
    expect(res).to.have.status(401);
    expect(res.body.status).to.equal('error');
    expect(res.body.message).to.equal('Error al registrar el usuario');
  });

  it('should authenticate with GitHub', async () => {
    const res = await chai.request(app).get('/api/sessions/github');
    expect(res).to.have.status(200);
   
  });

  it('should handle GitHub authentication callback', async () => {
    // Simula el flujo de autenticación de GitHub en la prueba
    const res = await chai.request(app).get('/api/sessions/githubcallback');
    expect(res).to.have.status(200);
    
  });

  it('should get current user if logged in', async () => {
   
    const res = await chai.request(app).get('/api/sessions/current');
    expect(res).to.have.status(200);

  });


});
