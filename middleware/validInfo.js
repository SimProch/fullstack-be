module.exports = (req, res, next) => {
  const {email, name, password} = req.body;

  console.log (req.path);
  console.log (req.body);
  if (req.path === '/register') {
    if (![email, name, password].every (Boolean)) {
      return res.status (401).json ('Missing credentials!');
    } else if (!isEmailValid (email)) {
      return res.status (401).json ('Invalid email');
    }
  } else if (req.path === '/login') {
    if (![email, password].every (Boolean)) {
      return res.status (401).json ('Missing credentials!');
    } else if (!isEmailValid (email)) {
      return res.status (401).json ('Invalid email');
    }
  }

  next ();
};

function isEmailValid (mail) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test (mail);
}
