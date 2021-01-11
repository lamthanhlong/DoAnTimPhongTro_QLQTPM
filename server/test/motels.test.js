process.env.IS_TEST = true;
const jwt = require('jsonwebtoken');
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
    it('it should QUERY Motels base on PARAMS conditions', (done) => {
      chai
        .request(server)
        .get(
          '/api/motel?city=TP HCM&district=6&address=01&sort=price&price=7-10&area=100-200&searchkey=Gia re&is_verified=true&has_furniture=true'
        )
        .end((err, res) => {
          res.should.have.status(200);
          var ret = JSON.parse(res.text);
          ret.data.should.be.a('array');
          ret.count.should.be.eql(7);
          done();
        });
    });
  });

  describe('GET /', () => {
    it('it should QUERY Motels base on PARAMS conditions', (done) => {
      chai
        .request(server)
        .get(
          '/api/motel?city=TP HCM&district=6&address=01&sort=price&price=7&area=100&searchkey=Gia re'
        )
        .end((err, res) => {
          res.should.have.status(200);
          var ret = JSON.parse(res.text);
          ret.data.should.be.a('array');
          ret.count.should.be.eql(7);
          done();
        });
    });
  });

  describe('GET /:id', () => {
    it('it should Get Motels base on ID', (done) => {
      let id = 1;
      chai
        .request(server)
        .get('/api/motel/' + id)
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
      var user_id = 1;
      var user_role = 'MOTEL_OWNER';
      let token = jwt.sign(
        {
          id: user_id,
          role: user_role,
        },
        'BEST_SOLUTION',
        {
          expiresIn: 20 * 24 * 60 * 60000,
        }
      );
      chai
        .request(server)
        .get(
          '/api/motel/user/' +
            user_id +
            '?city=TP HCM&district=6&address=01&sort=price&price=7-10&area=100-200&searchkey=Gia re'
        )
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('GET /user/:id', () => {
    it('it should GET Motels by OWNER_ID', (done) => {
      var user_id = 1;
      var user_role = 'MOTEL_OWNER';
      let token = jwt.sign(
        {
          id: user_id,
          role: user_role,
        },
        'BEST_SOLUTION',
        {
          expiresIn: 20 * 24 * 60 * 60000,
        }
      );
      chai
        .request(server)
        .get(
          '/api/motel/user/' +
            user_id +
            '?city=TP HCM&district=6&address=01&sort=price&price=7&area=100&searchkey=Gia re'
        )
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('POST /store', () => {
    it('it should STORE Motel into Database', (done) => {
      var motel = {
        title: 'Phòng Trọ Cao Cấp Mới',
        description: 'Phòng Trọ Cao Cấp Mới',
        address: 'Phòng Trọ Cao Cấp Mới',
        images: 'Phòng Trọ Cao Cấp Mới',
        area: 1,
        has_furniture: true,
        price: 1,
        owner_id: '5fccb2931e10b0191c19ac6b',
      };
      chai
        .request(server)
        .post('/api/motel/store')
        .send(motel)
        .end((err, res) => {
          res.should.have.status(201);
          var ret = JSON.parse(res.text);
          ret.price.should.be.eql(1);
          ret.is_verified = false;
          chai.request(server).delete('/api/motel/' + ret._id);
          done();
        });
    });
  });

  describe('PUT /:id', () => {
    it('it should UPDATE Motel in Database', (done) => {
      var user_id = 1;
      var user_role = 'MOTEL_OWNER';
      let token = jwt.sign(
        {
          id: user_id,
          role: user_role,
        },
        'BEST_SOLUTION',
        {
          expiresIn: 20 * 24 * 60 * 60000,
        }
      );
      var id = '5fccb2931e10b0191c19ac6b';
      var motel = {
        title: 'Phòng Trọ Cao Cấp 01',
        address: '01 Đường Nguyễn Văn Cừ, Phường 4, Quận 5, TP HCM',
      };
      chai
        .request(server)
        .put('/api/motel/update/' + id)
        .set({ Authorization: `Bearer ${token}` })
        .send(motel)
        .end((err, res) => {
          res.should.have.status(200);
          var ret = JSON.parse(res.text);
          ret[0].title.should.be.eql(motel.title);
          done();
        });
    });
  });

  describe('PUT /:id', () => {
    it('it should not UPDATE Motel in Database (Wrong id)', (done) => {
      var id = 1;
      var user_id = 2;
      var user_role = 'MOTEL_OWNER';
      let token = jwt.sign(
        {
          id: user_id,
          role: user_role,
        },
        'BEST_SOLUTION',
        {
          expiresIn: 20 * 24 * 60 * 60000,
        }
      );
      var motel = {
        title: 'Phòng Trọ Cao Cấp 01 Update',
        description: 'Update phòng trọ 01',
        address: 'Địa chỉ phòng trọ 01',
      };
      chai
        .request(server)
        .put('/api/motel/update/' + id)
        .set({ Authorization: `Bearer ${token}` })
        .send(motel)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });

  describe('PUT /:id', () => {
    it('it should not UPDATE Motel in Database (Wrong Role)', (done) => {
      let token = jwt.sign(
        {
          id: 1,
          role: 'CUSTOMER',
        },
        'BEST_SOLUTION',
        {
          expiresIn: 10 * 6000,
        }
      );
      var id = 1;
      var motel = {
        title:
          'Phòng chuẩn 18m2 và 24m2, phù hợp cho nhân viên văn phòng và sinh viên',
        address: 'Đường Chân Lý, Phường Tân Thành, Quận Tân Phú, Hồ Chí Minh',
      };
      chai
        .request(server)
        .put('/api/motel/update/' + id)
        .set({ Authorization: `Bearer ${token}` })
        .send(motel)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });

  describe('PUT /:id', () => {
    it('it should not UPDATE Motel in Database (Invalid Access Token)', (done) => {
      let token = jwt.sign(
        {
          id: 1,
          role: 'ADMIN',
        },
        'BEST_SOLUTION',
        {
          expiresIn: 10 * 6000,
        }
      );
      token = token + 'dsgfagedsgysg';
      var id = 1;
      var motel = {
        title:
          'Phòng chuẩn 18m2 và 24m2, phù hợp cho nhân viên văn phòng và sinh viên',
        address: 'Đường Chân Lý, Phường Tân Thành, Quận Tân Phú, Hồ Chí Minh',
      };
      chai
        .request(server)
        .put('/api/motel/update/' + id)
        .set({ Authorization: `Bearer ${token}` })
        .send(motel)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
  describe('PUT /:id', () => {
    it('it should not UPDATE Motel in Database (AccessToken Not Found)', (done) => {
      let token = jwt.sign(
        {
          id: 1,
          role: 'MOTEL_OWNER',
        },
        'BEST_SOLUTION',
        {
          expiresIn: 10 * 6000,
        }
      );
      var id = 1;
      var motel = {
        title:
          'Phòng chuẩn 18m2 và 24m2, phù hợp cho nhân viên văn phòng và sinh viên',
        description:
          '<p>(Số 4, đ.chân lý, p.tân thanh, q.tân phu) phòng thoáng mát, yên tỉnh, gần chợ, siêu thị , điện nước wifi riêng, máy lạnh. Phòng chuẩn 18m2 và 24m2. Phù hợp cho nhân viên văn phòng và sinh viên thoi.kgp@gmai.com</p><p>---------------------------------------------</p>',
        address: 'Đường Chân Lý, Phường Tân Thành, Quận Tân Phú, Hồ Chí Minh',
      };
      chai
        .request(server)
        .put('/api/motel/update/' + id)
        .send(motel)
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
  describe('DELETE /:id', () => {
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
  });
  describe('PUT /:id/verify', () => {
    it('it should Verify a Motel by Id', (done) => {
      var id = '5fccb2931e10b0191c19ac6b';
      let token = jwt.sign(
        {
          id: 1,
          role: 'ADMIN',
        },
        'BEST_SOLUTION',
        {
          expiresIn: 10 * 6000,
        }
      );
      chai
        .request(server)
        .put('/api/motel/' + id + '/verify')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
