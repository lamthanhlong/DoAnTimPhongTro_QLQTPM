process.env.IS_TEST = true;

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

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
          '/api/motel?city=TP HCM&district=6&sort=price&price=7-10&area=100-200'
        )
        .end((err, res) => {
          res.should.have.status(200);
          var ret = JSON.parse(res.text);
          ret.data.should.be.a('array');
          ret.count.should.be.eql(3);
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
          ret._id.should.be.eql(7);
          done();
        });
    });
  });
});
