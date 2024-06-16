const config = require("../../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function utilizadorCreate(utilizadorModel) {
  let service = {
    create,
    createToken,
    verifyToken,
    findUtilizador,
    recoverPassword,
    authorize,
    save,
    update,
  };

  function update(id, userData) {
    return utilizadorModel.findByIdAndUpdate(id, userData, { new: true }).exec();
  }


  function createPassword(utilizador) {
    return bcrypt.hash(utilizador.password, config.saltRounds);
  }

  function create(utilizador) {
    return createPassword(utilizador)
    .then((hashPassword, err) => {
      if (err) {
        return Promise.reject("Não salvo");
      }

      let newUtilizadorWithPassword = {
        ...utilizador,
        password: hashPassword,
      };
      let newUtilizador = utilizadorModel(newUtilizadorWithPassword);
      return save(newUtilizador);
    });
  }

  function save(model) {
    return new Promise(function (resolve, reject) {
      model
        .save()
        .then(() => resolve("Utilizador criado!"))
        .catch((err) =>
          reject(`Ocorreu um erro com a criação de utilizadores ${err}`)
        );
    });
  }

  // Função para verificar a validade de um token
  function verifyToken(token) {
    return new Promise((resolve, reject) => {
      // Verifica o token com base na chave secreta
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          reject(err); // Rejeita a promessa se houver erro na verificação do token
        }
        return resolve(decoded); // Resolve a promessa com os dados decodificados do token
      });
    });
  }

  // Função para autorizar acesso com base nas permissões do utilizador
  function authorize(scopes) {
    return (request, response, next) => {
      const { roleUtilizador } = request;
      console.log("route scopes:", scopes);
      console.log("user scopes:", roleUtilizador);

      // Verifica se o utilizador tem autorização para aceder à rota com base nas permissões
      const hasAuthoritization = scopes.some((scope) =>
        roleUtilizador.includes(scopes)
      );

      if (roleUtilizador && hasAuthoritization) {
        next(); // Permite o acesso à próxima função middleware
      } else {
        response.status(403).json({ message: "Forbidden" }); // Responde com um código de acesso proibido
      }
    };
  }

  // Função para criar um token de autenticação
  function createToken(utilizador) {
    let tokenPayload = {
      id: utilizador._id,
      name: utilizador.name,
    };

    if (utilizador.role && utilizador.role.scopes) {
      tokenPayload.role = utilizador.role.scopes;
    }

    let token = jwt.sign(tokenPayload, config.secret, {
      expiresIn: config.expiresPassword,
    });

    return { auth: true, token };
  }

  function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  function findUtilizador({ name, password }) {
    return new Promise(function (resolve, reject) {
      utilizadorModel
        .findOne({ name })
        .then((utilizador) => {
          if (!utilizador) {
            console.log("Utilizador não encontrado");
            return reject("Utilizador não encontrado");
          }
          console.log("Utilizador encontrado:", utilizador);
          return comparePassword(password, utilizador.password).then(
            (match) => {
              if (!match) {
                console.log("Senha não confere");
                return reject("O Utilizador não é valido");
              }
              console.log("Senha correta");
              return resolve(utilizador);
            }
          );
        })
        .catch((err) => {
          console.log("Erro ao procurar utilizador:", err);
          reject(`Ocorreu um problema com o login ${err}`);
        });
    });
  }

  function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  function verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          reject(err);
        }
        return resolve(decoded);
      });
    });
  }

  function createPassword(utilizador) {
    return bcrypt.hash(utilizador.password, config.saltRounds);
  }

  function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
  function recoverPassword(email) {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ email })
        .then((user) => {
          if (!user) {
            return reject("User not found");
          }

          // Gera o token de reset de password
          const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: "1h",
          });

          // Cria o URL para o reset da password
          const resetUrl = `http://127.0.0.1:3000/reset-password?token=${token}`;

          // Carrega o HTML template para o reset
          fs.readFile(
            path.resolve(__dirname, "../templates/resetPassword.html"),
            "utf8",
            (err, data) => {
              if (err) {
                console.log(err);
                return reject("Error loading email template");
              }

              // Compila o Handlebars template
              const template = handlebars.compile(data);

              // Gera o HTML para o email
              const html = template({ resetUrl });

              // Cria Nodemailer transporter
              const transporter = nodemailer.createTransport({
                service: "outlook",
                auth: {
                  user: smtpUser,
                  pass: smtpPass,
                },
              });

              // Define opções de email
              const mailOptions = {
                from: smtpUser,
                to: email,
                subject: "Password Reset",
                html: html,
              };

              // Envia o email
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                  return reject("Error sending email");
                }
                resolve("Email sent successfully");
                console.log(`Email sent successfully`);
              });
            }
          );
        })
        .catch((err) => {
          reject(`There was a problem with password recovery ${err}`);
          console.log(`Error sending email`);
        });
    });
  }
  return service;
}

module.exports = utilizadorCreate;
