process.env.IS_TEST = true;

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let jwt = require('jsonwebtoken');
chai.use(chaiHttp);

//Our parent block
describe('Motels', () => {
  beforeEach((done) => {
    //Before each test we empty the database in your case
    done();
  });
  describe('GET /', () => {
    it('it should QUERY Motels with pagination', (done) => {
      chai
        .request(server)
        .get('/api/motel/')
        .end((err, res) => {
          res.should.have.status(200);
          var ret = JSON.parse(res.text);
          ret.data.should.be.a('array');
          done();
        });
    });
  });

  describe('GET /', () => {
    it('it should QUERY Motels base on PARAMS conditions', (done) => {
      chai
        .request(server)
        .get(
          '/api/motel?offset=0&limit=10&sort=price_desc&searchkey=sinh%20viên&city=Hồ%20Chí%20Minh&district=Tân%20Phú&area=10-20&price=1.5-5&has_furniture=false&is_verified=false'
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
        owner_id: 'me',
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
      let token = jwt.sign(
        {
          id: '5fccb2931e10b0191c19e5bd',
          role: 'MOTEL_OWNER',
        },
        'BEST_SOLUTION',
        {
          expiresIn: 10 * 6000,
        }
      );
      var id = '5fccb2b71e10b0191c1a5163';
      var motel = {
        title:
          'Phòng chuẩn 18m2 và 24m2, phù hợp cho nhân viên văn phòng và sinh viên',
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
      let token = jwt.sign(
        {
          id: '5fccb2931e10b0191c19efdsf',
          role: 'MOTEL_OWNER',
        },
        'BEST_SOLUTION',
        {
          expiresIn: 10 * 6000,
        }
      );
      var id = '5fccb2b71e10b0191c1a5163';
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
});
