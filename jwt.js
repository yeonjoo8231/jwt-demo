var jwt = require("jsonwebtoken"); // jwt 모듈 소환
var dotenv = require("dotenv");
dotenv.config();

// 토큰 생성
var token = jwt.sign({ foo: "bar" }, process.env.PRIVATE_KEY);
console.log(token);

var decoded = jwt.verify(token, process.env.PRIVATE_KEY);
console.log(decoded);

// 로그인 API 코드
router.post(
  "/login",
  [
    body("email").notEmpty().isEmail().withMessage("이메일 입력 플리즈"),
    body("password").notEmpty().isString().withMessage("비밀번호 입력 플리즈"),
    validate,
  ],
  (req, res) => {
    const { email, password } = req.body;

    let sql = `SELECT * FROM users WHERE email = ?`;
    conn.query(sql, email, (err, results) => {
      if (err) {
        return res.status(400).end();
      }
      var loginUser = results[0];

      if (loginUser && loginUser.password == password) {
        // token 발급
        const token = jwt.sign(
          {
            email: loginUser.email,
            name: loginUser.name,
          },
          process.env.PRIVATE_KEY,
          {
            expiresIn: "5m",
            issuer: "itsme",
          }
        );

        res.cookie("token", token, {
          httpOnly: true,
        });

        res.status(200).json({
          message: `${loginUser.name}님 로그인 성공했습니다.`,
        });
      } else {
        res.status(403).json({
          message: "이메일 또는 비밀번호가 틀렸습니다.",
        });
      }
    });
  }
);
