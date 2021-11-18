import checkLastSession from '../utils/checkLastSession.js';

const persistLogin = (req, res) => {
  const { token } = req.body;
  const { newToken } = checkLastSession(token);

  if (newToken) {
    return res.status(200).send(newToken);
  }

  return res.sendStatus(401);
};

export default persistLogin;
