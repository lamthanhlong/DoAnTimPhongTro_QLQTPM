const jwt = require('jsonwebtoken');
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
