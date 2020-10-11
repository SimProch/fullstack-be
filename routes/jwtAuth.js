const router = require ('express').Router ();
const pool = require ('../database/db');
const bcrypt = require ('bcrypt');
const jwtGenerator = require ('../utils/jwtGenerator');
const validInfo = require ('../middleware/validInfo');
const authorization = require ('../middleware/authorization');

router.post ('/register', validInfo, async function (req, res, next) {
  try {
    const {name, email, password} = req.body;
    const user = await getUser (email);
    if (user.rows.length !== 0) {
      return errorMessage ('User already exists!');
    }
    const bcryptedPassword = await getBcryptedPassword (password);
    const newUser = await pool.query (
      'INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, bcryptedPassword]
    );
    sendToken (newUser, res);
  } catch (err) {
    onCatchError (err, res);
  }
});

router.post ('/login', validInfo, async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await getUser (email);
    if (user.rows.length === 0) {
      return errorMessage (res, "User doesn't exist!");
    }

    const validPassword = await bcrypt.compare (
      password,
      user.rows[0].user_password
    );
    if (!validPassword) {
      return errorMessage (res, 'Password is incorrect!');
    }

    sendToken (user, res);
  } catch (err) {
    onCatchError (err, res);
  }
});

router.get ('verify', authorization, async (req, res, next) => {
  try {
    res.json(true);
  } catch (err) {
    onCatchError (err, res);
  }
});

function onCatchError (err, res) {
  console.error (err.message);
  res.status (500).send ('Server error');
}

function sendToken (user, res) {
  const token = jwtGenerator (user.rows[0].user_id);
  res.json ({token});
}

async function getUser (email) {
  return await pool.query ('SELECT * FROM users WHERE user_email = $1', [
    email,
  ]);
}

function errorMessage (res, error) {
  return res.status (401).json (error);
}

async function getBcryptedPassword (password) {
  const saltRound = 10;
  const salt = await bcrypt.genSalt (saltRound);
  const bcryptedPassword = await bcrypt.hash (password, salt);
  return bcryptedPassword;
}

module.exports = router;
