process.env.IS_TEST = true;
const jwt = require('jsonwebtoken');
const motels = require('../_data/Motels.json');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
chai.use(chaiHttp);

//Our parent block
describe('Motels', () => {
  beforeEach((done) => {
    //Before each test we empty the database in your case
    done();
  });

  describe('GET /', () => {
    it('it should have Motels', (done) => {
      process.env.TestReturnValue = JSON.stringify(motels);
      chai.request(server).get('/api/motel')
        .end((err, res) => {
          res.should.have.status(200);
          var ret = JSON.parse(res.text);
          ret.data.should.be.a('array');
          ret.count.should.be.eql(6);
          done();
        });
    });
  });

  describe('GET /', () => {
    it('it should not have Motels', (done) => {
      process.env.TestReturnValue = '[]';
      chai.request(server).get('/api/motel')
        .end((err, res) => {
          res.should.have.status(200);
          var ret = JSON.parse(res.text);
          ret.count.should.be.eql(0);
          done();
        });
    });
  });

  describe('GET /:id', () => {
    it('it should have Motel', (done) => {
      process.env.TestReturnValue = JSON.stringify([motels[0]]);
      chai.request(server).get('/api/motel/5fccb2931e10b0191c19ac57')
        .end((err, res) => {
          res.should.have.status(200);
          //var ret = JSON.parse(res.text);
          //ret[0].area.should.be.eql(100);
          //ret[0].title.should.be.eql('Phòng Trọ Cao Cấp 01');
          //ret[0].address.should.be.eql(
          //  '01 Đường Nguyễn Văn Cừ, Phường 4, Quận 5, TP HCM'
          //);
          done();
        });
    });
  });

  describe('GET /user/:id', () => {
    it('it should GET Motels by OWNER_ID', (done) => {
      process.env.TestReturnValue = JSON.stringify([motels[0]]);
      let token = jwt.sign({
          id: '5fccb2931e10b0191c19ac57',
          role: 'USER',
        },
        'BEST_SOLUTION',
        {
          expiresIn: 20 * 24 * 60 * 60000,
        }
      );
      chai.request(server).get('/api/motel/user/5fccb2931e10b0191c19ac57').set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  
  describe('POST /store', () => {
    it('it should STORE Motel into Database', (done) => {
      process.env.TestReturnValue = motels[0]._id;
      let token = jwt.sign({
        id: '5fccb2931e10b0191c19ac57',
        role: 'USER',
        },
        'BEST_SOLUTION',
        {
          expiresIn: 20 * 24 * 60 * 60000,
        }
      );
      chai.request(server).post('/api/motel/store').set({ Authorization: `Bearer ${token}` }).send(motels[0])
        .end((err, res) => {
          res.should.have.status(201);
          var ret = JSON.parse(res.text);
          ret.price.should.be.eql(motels[0].price);
          ret.is_verified = motels[0].is_verified;
          done();
        });
    });
  });

  describe('PUT /:id', () => {
    it('it should UPDATE Motel in Database', (done) => {
      let token = jwt.sign({
          id: '5fccb2931e10b0191c19ac57',
          role: 'USER',
        },
        'BEST_SOLUTION',
        { expiresIn: 20 * 24 * 60 * 60000 }
      );
      process.env.TestReturnValue = JSON.stringify([motels[0]]);
      chai.request(server).put('/api/motel/update/5fccb2931e10b0191c19ac57').set({ Authorization: `Bearer ${token}` }).send(motels[0])
        .end((err, res) => {
          res.should.have.status(200);
          var ret = JSON.parse(res.text);
          ret[0].title.should.be.eql(motels[0].title);
          done();
        });
    });
  });

  describe('PUT /:id', () => {
    it('it should not UPDATE Motel in Database (no item)', (done) => {
      let token = jwt.sign({
        id: '5fccb2931e10b0191c19ac57',
        role: 'USER',
        },
        'BEST_SOLUTION',
        { expiresIn: 20 * 24 * 60 * 60000 }
      );
      process.env.TestReturnValue = '[]';
      chai.request(server).put('/api/motel/update/5fccb2931e10b0191c19ac57').set({ Authorization: `Bearer ${token}` }).send(motels[0])
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
      });
  });

  describe('PUT /:id', () => {
    it('it should not UPDATE Motel in Database (Wrong Role)', (done) => {
      let token = jwt.sign({
        id: '5fccb2931e10b0191c19ac55',
        role: 'USER',
        },
        'BEST_SOLUTION',
        { expiresIn: 20 * 24 * 60 * 60000 }
      );
      process.env.TestReturnValue = JSON.stringify([motels[0]]);
      chai.request(server).put('/api/motel/update/5fccb2931e10b0191c19ac57').set({ Authorization: `Bearer ${token}` }).send(motels[0])
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
      });
  });

  describe('PUT /:id', () => {
    it('it should not UPDATE Motel in Database (Invalid Access Token)', (done) => {
      process.env.TestReturnValue = JSON.stringify(motels[0]);
      chai.request(server).put('/api/motel/update/5fccb2931e10b0191c19ac57').set({ Authorization: `Bearer WrongAccessToken` }).send(motels[0])
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
      });
  });

  describe('PUT /:id', () => {
    it('it should not UPDATE Motel in Database (No Access Token)', (done) => {
      process.env.TestReturnValue = JSON.stringify(motels[0]);
      chai.request(server).put('/api/motel/update/5fccb2931e10b0191c19ac57').send(motels[0])
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
      });
  });

  describe('GET /local', () => {
    it('it should GET Country location base on PARAMS', (done) => {
      chai
        .request(server)
        .get('/api/motel/local?city_id=1&district_id=1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.count.should.be.eql(16);
          res.body.data.should.be.a('array');
          done();
        });
    });
  });
  describe('GET /local', () => {
    it('it should GET All Country location base on City Id', (done) => {
      chai
        .request(server)
        .get('/api/motel/local?city_id=1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('array');
          done();
        });
    });
  });
  describe('GET /local', () => {
    it('it should GET All Country location', (done) => {
      chai
        .request(server)
        .get('/api/motel/local')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('array');
          done();
        });
    });
  });

  /*describe('DELETE /:id', () => {
    it('it should Delete a Motel by Id', (done) => {
      var id = '5fccb2931e10b0191c19ac6b';
      chai
        .request(server)
        .delete('/api/motel/' + id)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });*/

  describe('PUT /:id/verify', () => {
    it('it should Verify a Motel by Id', (done) => {
      process.env.TestReturnValue = 1;
      let token = jwt.sign(
        {
          id: '5fccb2931e10b0191c19ac57',
          role: 'ADMIN',
        },
        'BEST_SOLUTION',
        {
          expiresIn: 10 * 6000,
        }
      );
      chai.request(server).put('/api/motel/5fccb2931e10b0191c19ac57/verify').set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
