const jwt = require('jsonwebtoken');
const model = require('../models/user.model');
// if (process.env.IS_TEST) {
//   module.exports = {
//     protect: function (req, res, next) {
//       next();
//     },

//     authorize: (...roles) =>
//       function (req, res, next) {
//         next();
//       },

//     sendTokenResponse: async function (req, res, next) {},
//   };
//   return;
// }
exports.protect = function (req, res, next) {
  let accessToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    accessToken = req.headers.authorization.split(' ')[1];
  }

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, 'BEST_SOLUTION');
      req.accessTokenPayload = decoded;
      next();
    } catch (err) {
      return res.status(401).json({
        message: 'Invalid access token.',
      });
    }
  } else {
    return res.status(400).json({
      message: 'Access token not found.',
    });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.accessTokenPayload.role)) {
    return res.status(403).json({
      err_msg: `User role ${req.accessTokenPayload.role} is not permitted to this route`,
    });
  }
  next();
};
exports.sendTokenResponse = async (user, statusCode, res) => {
  const token = await model.getSignedJwtToken(user._id);
  const options = {
    expires: new Date(Date.now() + 20 * 24 * 60 * 60000),
    httpOnly: true,
  };

  if (process.env.IS_BUILD) {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ user, token: token });
};
