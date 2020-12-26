process.env.IS_TEST = true;

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

describe('Ratings', () => {
  beforeEach((done) => {
    //Before each test we empty the database in your case
    done();
  });

  describe('GET /', () => {
    it('it should GET all ratings in Motels', (done) => {
      chai
        .request(server)
        .get('/api/rating')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          var ret = JSON.parse(res.text);
          done();
        });
    });
  });

  describe('GET /:id', () => {
    it('it should Get Rating base on Id', (done) => {
      let id = '5fddbb35d86dd127c01df36e';
      chai
        .request(server)
        .get('/api/rating/' + id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0].should.be.a('object');
          res.body.length.should.be.eql(1);
          var ret = JSON.parse(res.text);
          ret[0]._id.should.be.eql('5fddbb35d86dd127c01df36e');
          ret[0].user_id.should.be.eql('5fddba4b5ee3560660340a61');
          ret[0].rating.should.be.eql(4);
          done();
        });
    });
  });

  describe('GET /motel/:id', () => {
    it('it should Get Rating base on Motel Id', (done) => {
      let id = '5fccb2b71e10b0191c1a0f5b';
      chai
        .request(server)
        .get('/api/rating/motel/' + id + '?' + 'limit=10&skip=1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(3);
          var ret = JSON.parse(res.text);
          done();
        });
    });
  });

  describe('POST /', () => {
    it('it should Post Rating to Motel Id', (done) => {
      const rating = {
        motel_id: '5fccb2b71e10b0191c1a5c08',
        user_id: '5fccb2931e10b0191c19ac48',
        rating: 4,
        comment: 'Phòng trọ tốt, giá cả phải chăng',
      };
      chai
        .request(server)
        .post('/api/rating/')
        .send(rating)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          var ret = JSON.parse(res.text);
          ret.motel_id.should.be.eql('5fccb2b71e10b0191c1a5c08');
          ret.user_id.should.be.eql('5fccb2931e10b0191c19ac48');
          ret.rating.should.be.eql(4);
          ret.comment.should.be.a('string');
          let new_id = ret._id;
          chai
            .request(server)
            .delete('/api/rating/' + new_id)
            .end();
          done();
        });
    });
  });

  describe('DELETE /', () => {
    it('it should Delete Rating by Id', (done) => {
      const id = '5fe755641a84bf4a3c8ba597';
      chai
        .request(server)
        .delete('/api/rating/' + id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('PUT /', () => {
    it('it should Update Rating by Id', (done) => {
      const id = '5fddbb35d86dd127c01df38b';
      const update = {
        user_id: '5fddba4b5ee3560660340a61',
        motel_id: '5fccb2b71e10b0191c1a0fc6',
        rating: 4,
        comment: 'phòng trọ ổn.',
      };
      chai
        .request(server)
        .put('/api/rating/' + id)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
