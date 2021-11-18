import jwt from 'jsonwebtoken';
import checkLastSession from '../utils/checkLastSession.js';

const authenticationJWT = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      const { newToken, sessionId } = await checkLastSession(token);
      if (newToken) {
        req.newToken = newToken;
        req.sessionId = sessionId;
        next();
      } else {
        return res.sendStatus(401);
      }
    } else {
      req.sessionId = decoded.sessionId;
      return next();
    }
  });
};

export default authenticationJWT;
