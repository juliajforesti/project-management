const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const User = require("../models/User.model");

// Receber os dados do formulario de cadastro de usuario
router.post("/signup", async (req, res) => {
  console.log(req.body);

  // Extrair informacoes recebidas da requisicao http que veio do navegador
  const { name, email, password } = req.body;

  const errors = {};
  // Validacao de nome de usuario: é obrigatório, tem que ser do tipo string e não pode ter mais de 50 caracteres
  if (!name || typeof name !== "string" || name.length > 50) {
    errors.name = "Username is required and should be 50 characters max.";
  }

  // Tem que ser um email valido, é obrigatório
  if (!email || !email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/)) {
    errors.email = "Email is required and should be a valid email address";
  }

  // Senha é obrigatória, precisa ter no mínimo 8 caracteres, precisa ter letras maiúsculas, minúsculas, números e caracteres especiais
  if (
    !password ||
    !password.match(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
    )
  ) {
    errors.password =
      "Password is required, should be at least 8 characters long, should contain an uppercase letter, lowercase letter, a number and a special character";
  }

  // Se o objeto errors tiver propriedades (chaves), retorne as mensagens de erro
  if (Object.keys(errors).length) {
    return res.status(400).json({ errors });
  }

  try {
    // Gerar o salt
    const salt = await bcrypt.genSalt(saltRounds);
    // Gerar o hash utilizando o salt criado anteriormente e o que o usuario escreveu no campo senha no navegador
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Hashed password => ", hashedPassword);

    // Cria o usuario no banco, passando a senha criptografada
    const result = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
    });
    console.log('result from user create:', result)
    // Retorna objeto de usuario criado
    res.status(201).json({ user: result });

  } catch (err) {
    console.error(err);
    // Mensagem de erro para exibir erros de validacao do Schema do Mongoose
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(500).json({ error: err.message });
    } else if (err.code === 11000) {
      res.status(500).json({
        error:
          "Username and email need to be unique. Either username or email is already used.",
      });
    }
  }
});

// POST Login
router.post("/login", async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    try {
      console.log("PASSPORT AUTHENTICATE INFO => ", info);
      // Caso exista erro, encerre a execuçāo desta funçāo
      if (err || !user) {
        return next(info.message);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) {
          console.error("LOGIN ERROR", error);
          return next(error);
        }

        const body = { _id: user._id, email: user.email, name: user.name };
        const token = jwt.sign({ user: body }, process.env.TOKEN_SIGN_SECRET);

        return res.json({ token, user: body });
      });
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
});

// Rota privada de dados do usuário
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({
      message: "You made it to the secure route",
      user: req.user,
      token: req.query.secret_token,
    });
  }
);

module.exports = router;
