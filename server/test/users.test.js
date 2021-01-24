/*
process.env.IS_TEST = true;
const jwt = require('jsonwebtoken');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
const model = require('../models/user.model');
describe('Users', () => {
  beforeEach((done) => {
    //Before each test we empty the database in your case
    done();
  });

  describe('GET /', () => {
    it('it should GET all Users', (done) => {
      chai
        .request(server)
        .get('/api/user')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.data.should.be.a('array');
          var ret = JSON.parse(res.text);
          done();
        });
    }).timeout(15000);
  });

  describe('GET /:id', () => {
    it('it should Get User base on Id', (done) => {
      let id = '5fccb2931e10b0191c19ac6b';
      chai
        .request(server)
        .get('/api/user/' + id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0].should.be.a('object');
          res.body.length.should.be.eql(1);
          var ret = JSON.parse(res.text);
          ret[0]._id.should.be.eql('5fccb2931e10b0191c19ac6b');
          ret[0].phone.should.be.eql('0779151579');
          ret[0].password.should.be.a('string');
          ret[0].name.should.be.eql('Phạm Ngọc Hùng');
          ret[0].address.should.be.eql(
            '43 Đường Thân Nhân Trung, Phường 13, Quận Tân Bình, Hồ Chí Minh'
          );
          ret[0].role.should.be.eql('MOTEL_OWNER');
          ret[0].images.should.be.eql('');
          done();
        });
    }).timeout(15000);
  });

  describe('POST /login', () => {
    it('it should Post User base on Phone and Password', (done) => {
      const User = {
        phone: '0779151579',
        password: '1',
      };
      chai
        .request(server)
        .post('/api/auth/login')
        .send(User)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          var ret = JSON.parse(res.text);
          ret.token.should.be.a('string');
          done();
        });
    }).timeout(15000);
  });

  describe('POST /login', () => {
    it('it should not Post User base on Phone', (done) => {
      const User = {
        phone: '0779151579',
        password: '',
      };
      chai
        .request(server)
        .post('/api/auth/login')
        .send(User)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    }).timeout(15000);
  });

  describe('POST /login', () => {
    it('it should not Post User base on Password', (done) => {
      const User = {
        phone: '',
        password: '1',
      };
      chai
        .request(server)
        .post('/api/auth/login')
        .send(User)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    }).timeout(15000);
  });

  describe('POST /login', () => {
    it('it should not Post User base on Phone have status 404', (done) => {
      const User = {
        phone: '1',
        password: '1',
      };
      chai
        .request(server)
        .post('/api/auth/login')
        .send(User)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    }).timeout(15000);
  });

  describe('POST /login', () => {
    it('it should not Post User base on Password have status 404', (done) => {
      const User = {
        phone: '0779151579',
        password: '2',
      };
      chai
        .request(server)
        .post('/api/auth/login')
        .send(User)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    }).timeout(15000);
  });

  describe('POST /register', () => {
    it('it should Post Register User', (done) => {
      const User = {
        phone: '0963212454955',
        password: '1',
        name: 'Huỳnh Trần Bảo An',
        address: '622/10 Đường Cộng Hòa, Phường 13, Quận Tân Bình, Hồ Chí Minh',
        role: 'CUSTOMER',
        images: '',
      };
      chai
        .request(server)
        .post('/api/auth/register')
        .send(User)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          var ret = JSON.parse(res.text);
          ret.user.phone.should.be.a('string');
          ret.user.password.should.be.a('string');
          ret.user.name.should.be.eql('Huỳnh Trần Bảo An');
          ret.user.address.should.be.eql(
            '622/10 Đường Cộng Hòa, Phường 13, Quận Tân Bình, Hồ Chí Minh'
          );
          ret.user.role.should.be.eql('CUSTOMER');
          ret.user.images.should.be.eql('');
          done();
        });
    }).timeout(15000);
  });

  describe('POST /register', () => {
    it('it should Post Register User', (done) => {
      process.env.CHANGE_ID = true;
      const User = {
        phone: '0963212454955',
        password: '1',
        name: 'Huỳnh Trần Bảo An',
        address: '622/10 Đường Cộng Hòa, Phường 13, Quận Tân Bình, Hồ Chí Minh',
        role: 'CUSTOMER',
        images: '',
      };
      chai
        .request(server)
        .post('/api/auth/register')
        .send(User)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          var ret = JSON.parse(res.text);
          ret.user.phone.should.be.a('string');
          ret.user.password.should.be.a('string');
          ret.user.name.should.be.eql('Huỳnh Trần Bảo An');
          ret.user.address.should.be.eql(
            '622/10 Đường Cộng Hòa, Phường 13, Quận Tân Bình, Hồ Chí Minh'
          );
          ret.user.role.should.be.eql('CUSTOMER');
          ret.user.images.should.be.eql('');
          done();
        });
    }).timeout(15000);
  });

  describe('POST /register', () => {
    it('it should Post Register User Status 400', (done) => {
      const User = {
        phone: '0779151579',
        password: '1',
        name: 'Huỳnh Trần Bảo An',
        address: '622/10 Đường Cộng Hòa, Phường 13, Quận Tân Bình, Hồ Chí Minh',
        role: 'CUSTOMER',
        images: '',
      };
      chai
        .request(server)
        .post('/api/auth/register')
        .send(User)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    }).timeout(15000);
  });

  describe('POST /', () => {
    it('it should Post User', (done) => {
      const User = {
        phone: '0857518499',
        password: '1',
        name: 'Huỳnh Trần Bảo An',
        address: '622/10 Đường Cộng Hòa, Phường 13, Quận Tân Bình, Hồ Chí Minh',
        role: 'CUSTOMER',
        images: '',
      };
      chai
        .request(server)
        .post('/api/user/')
        .send(User)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          var ret = JSON.parse(res.text);
          res.body.should.be.a('object');
          var ret = JSON.parse(res.text);
          ret.user.phone.should.be.a('string');
          ret.user.password.should.be.a('string');
          ret.user.name.should.be.eql('Huỳnh Trần Bảo An');
          ret.user.address.should.be.eql(
            '622/10 Đường Cộng Hòa, Phường 13, Quận Tân Bình, Hồ Chí Minh'
          );
          ret.user.role.should.be.eql('CUSTOMER');
          ret.user.images.should.be.eql('');
          done();
        });
    }).timeout(15000);
  });

  describe('POST /', () => {
    it('it should Post User have status 400', (done) => {
      const User = {
        phone: '0779151579',
        password: '1',
        name: 'Huỳnh Trần Bảo An',
        address: '622/10 Đường Cộng Hòa, Phường 13, Quận Tân Bình, Hồ Chí Minh',
        role: 'CUSTOMER',
        images: '',
      };
      chai
        .request(server)
        .post('/api/user/')
        .send(User)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    }).timeout(15000);
  });

  describe('DELETE /', () => {
    it('it should Delete User by Id', (done) => {
      const id = '5fccb2931e10b0191c19ac6b';
      chai
        .request(server)
        .delete('/api/user/' + id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    }).timeout(15000);
  });

  describe('PUT /', () => {
    it('it should Update User by Id change password', (done) => {
      const id = '5fccb2931e10b0191c19ac6b';
      const update = {
        phone: '0779151579',
        password: '2',
        name: 'Phạm Ngọc Hùng',
        address:
          '43 Đường Thân Nhân Trung, Phường 13, Quận Tân Bình, Hồ Chí Minh',
        role: 'MOTEL_OWNER',
        images: '',
      };
      chai
        .request(server)
        .put('/api/user/' + id)
        .send(update)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    }).timeout(15000);
  });

  describe('PUT /', () => {
    it('it should not Update User by Id', (done) => {
      const id = '5fccb2931e10b0191c19ac6b';
      const update = {
        phone: '0779151579',
        name: 'Phạm Ngọc Hùng',
        address:
          '43 Đường Thân Nhân Trung, Phường 13, Quận Tân Bình, Hồ Chí Minh',
        role: 'MOTEL_OWNER',
        images: '',
      };
      chai
        .request(server)
        .put('/api/user/' + id)
        .send(update)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    }).timeout(15000);
    afterEach(function (done) {
      done();
    });
  });
  describe('GET /auth/me', () => {
    it('it should get current user', (done) => {
      let token = jwt.sign(
        {
          id: '5fccb2931e10b0191c19ac6b',
          role: 'ADMIN',
        },
        'BEST_SOLUTION',
        {
          expiresIn: 10 * 6000,
        }
      );
      chai
        .request(server)
        .get('/api/auth/me/')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('GET /auth/me', () => {
    it('it should not get current user(user not found!)', (done) => {
      let token = jwt.sign(
        {
          id: 'fafsdgsgsdgs',
          role: 'ADMIN',
        },
        'BEST_SOLUTION',
        {
          expiresIn: 10 * 6000,
        }
      );
      chai
        .request(server)
        .get('/api/auth/me/')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  describe('POST /auth/me', () => {
    it('it should update current user', (done) => {
      let token = jwt.sign(
        {
          id: '5fccb2931e10b0191c19ac6b',
          role: 'ADMIN',
        },
        'BEST_SOLUTION',
        {
          expiresIn: 10 * 6000,
        }
      );
      user = {
        _id: '5fccb2931e10b0191c19ac6b',
        phone: '0779151579',
        password:
          '$2a$10$0RtZnlhi1KMdvvCBKzv7s.czECkl27qseJS1GAb5U9Nxl1xhYB8Wy',
        name: 'Phạm Ngọc Hùng',
        address:
          '43 Đường Thân Nhân Trung, Phường 13, Quận Tân Bình, Hồ Chí Minh',
        images: '',
        description: '',
        role: 'MOTEL_OWNER',
        is_verified: false,
        modified_date: '2020-12-27T15:13:59.255Z',
        created_date: '2020-12-06T10:28:54.516Z',
      };
      chai
        .request(server)
        .post('/api/auth/me/')
        .send(user)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('PUT /user/:id/verify', () => {
    it('it should verify user', (done) => {
      let token = jwt.sign(
        {
          id: '5fccb2931e10b0191c19ac6b',
          role: 'ADMIN',
        },
        'BEST_SOLUTION',
        {
          expiresIn: 10 * 6000,
        }
      );
      id = '5fccb2931e10b0191c19ac6b';
      chai
        .request(server)
        .put('/api/user/' + id + '/verify')
        .send()
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('PUT /user/:id/verify', () => {
    it('it shouldnt verify user (user not found)', (done) => {
      let token = jwt.sign(
        {
          id: '5fccb2931e10b0191c19ac6b',
          role: 'ADMIN',
        },
        'BEST_SOLUTION',
        {
          expiresIn: 10 * 6000,
        }
      );
      id = '5fccb2931e10b0191c19ac6a';
      chai
        .request(server)
        .put('/api/user/' + id + '/verify')
        .send()
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
*/