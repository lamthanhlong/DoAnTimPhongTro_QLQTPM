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
          res.body.length.should.be.eql(8);
          var ret = JSON.parse(res.text);
          done();
        });
    }).timeout(3000);
  });

  describe('GET /:id', () => {
    it('it should Get Rating base on Id', (done) => {
      let id = 1;
      chai
        .request(server)
        .get('/api/rating/' + id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0].should.be.a('object');
          res.body.length.should.be.eql(1);
          var ret = JSON.parse(res.text);
          ret[0]._id.should.be.eql("5fccb2931e10b0191c19ac6b");
          ret[0].user_id.should.be.eql("5fccb2931e10b0191c19ac6b");
          ret[0].motel_id.should.be.eql("5fccb2931e10b0191c19ac6b");
          //ret[0].rating.should.be.eql(4);
          done();
        });
    });
  });

  describe('GET /motel/:id', () => {
    it('it should Get Rating base on Motel Id', (done) => {
      let id = 1;
      chai
        .request(server)
        .get('/api/rating/motel/' + id + '?' + 'limit=10&skip=1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          //res.body.length.should.be.eql(3);
          //var ret = JSON.parse(res.text);
          done();
        });
    });
  });

  describe('POST /', () => {
    it('it should Post Rating to Motel Id', (done) => {
      const rating = {
        motel_id: "5fccb2931e10b0191c19ac69",
        user_id: "5fccb2931e10b0191c19ac69",
        rating: 5,
        comment: 'Phòng trọ tốt, giá cả phải chăng',
      };
      chai
        .request(server)
        .post('/api/rating')
        .send(rating)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          var ret = JSON.parse(res.text);
          ret.motel_id.should.be.eql("5fccb2931e10b0191c19ac69");
          ret.user_id.should.be.eql("5fccb2931e10b0191c19ac69");
          ret.rating.should.be.eql(5);
          ret.comment.should.be.a('string');

          done();
        })
        .timeout(5000);
    });
  });

<<<<<<< HEAD
  // describe('POST /', () => {
  //   it('it should not Post Rating to Motel Id because of duplication', (done) => {
  //     const rating = {
  //       motel_id: 2,
  //       user_id: 1,
  //       rating: 4,
  //       comment: 'Phòng trọ tốt, giá cả phải chăng',
  //     };
  //     chai
  //       .request(server)
  //       .post('/api/rating/')
  //       .send(rating)
  //       .end((err, res) => {
  //         res.should.have.status(400);
  //         done();
  //       })
  //       .timeout(5000);
  //   });
  // });

=======
  describe('POST /', () => {
    it('it should not Post Rating to Motel Id because of duplication', (done) => {
      const rating = {
        motel_id: "5fccb2931e10b0191c19ac62",
        user_id: "5fccb2931e10b0191c19ac62",
        rating: 4,
        comment: 'Phòng trọ tốt, giá cả phải chăng',
      };
      chai
        .request(server)
        .post('/api/rating/')
        .send(rating)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        })
        .timeout(5000);
    });
  });
/*
<<<<<<< HEAD
>>>>>>> 4a248e6ae848ebbf3518351fbd6ad5d116b09216
=======
>>>>>>> 4a248e6ae848ebbf3518351fbd6ad5d116b09216
  describe('DELETE /', () => {
    it('it should Delete Rating by Id', (done) => {
      const id = 3;
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
      const id = 1;
      const update = {
        user_id: 2,
        motel_id: 3,
        rating: 4,
        comment: 'phòng trọ ổn.',
      };
      chai
        .request(server)
        .put('/api/rating/' + id)
        .send(update)
        .end((err, res) => {
          res.should.have.status(200);
          ret = JSON.parse(res.text);
          ret[0]._id.should.be.eql(1);
          ret[0].user_id.should.be.eql("2");
          ret[0].motel_id.should.be.eql("1");
          ret[0].rating.should.be.eql(4);
          ret[0].comment.should.be.a('string');
          done();
        });
    });
  });

  describe('PUT /', () => {
    it('it should not Update Rating by Id (Wrong Id)', (done) => {
      const id = 25;
      const update = {
        user_id: 1,
        motel_id: 4,
        rating: 4,
        comment: 'phòng trọ ổn.',
      };
      chai
        .request(server)
        .put('/api/rating/' + id)
        .send(update)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });*/
});
