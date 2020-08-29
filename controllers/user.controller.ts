import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import Token from '../classes/token';
import environment from '../global/environment';

import { User } from '../models/user.model';
import { Skill } from '../models/skill.model';

// Google Login
var GOOGLE_CLIENT_ID = environment.GOOGLE_CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);


// ========================================================
// User Methods
// ========================================================

function createUser(req: any, res: Response) {

  var body = req.body;
  var user = new User({
    tx_name: body.user.tx_name,
    tx_email: body.user.tx_email,
    tx_password: bcrypt.hashSync(body.user.tx_password, 10),
    bl_google: false,
    fc_lastlogin: null,
    fc_createdat: new Date(),
    id_role: 'ADMIN_ROLE',
  });

  user.save().then((userSaved) => {

    res.status(201).json({
      ok: true,
      msg: "Usuario guardado correctamente.",
      user: userSaved
    });

  }).catch((err) => {

    return res.status(400).json({
      ok: false,
      msg: "Error al guardar el user.",
      errors: err
    });

  });


}

function attachCompany(req: Request, res: Response) {

  let company = req.body.company;
  let idUser = req.params.idUser;

  User.findByIdAndUpdate(idUser, { 'id_company': company._id }, { new: true })
    .populate('id_company')
    .populate('id_skills')
    .then(userUpdated => {

      return res.status(200).json({
        ok: true,
        msg: 'La empresa se asigno al user correctamente',
        user: userUpdated
      })
    }).catch(() => {
      return res.status(500).json({
        ok: true,
        msg: 'No se pudo asignar la empresa al user',
        user: null
      })
    })

}

function checkEmailExists(req: Request, res: Response) {

  let pattern = req.body.pattern;
  User.findOne({ tx_email: pattern }).then(userDB => {
    if (!userDB) {
      return res.status(200).json({
        ok: true,
        msg: 'No existe el email'
      })
    }
    return res.status(200).json({
      ok: false,
      msg: 'El email ya existe.'
    })
  }).catch(() => {
    return res.status(500).json({
      ok: false,
      msg: 'Error al consultar si existe el email'
    })
  })

}

function updateToken(req: any, res: Response) {

  let body = req.body;
  var token = Token.getJwtToken({ user: body.user })
  res.status(200).json({
    ok: true,
    user: req.user,
    newtoken: token
  });
}

async function verify(token: string) {
  const ticket = await oauthClient.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  return {
    name: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
    payload: payload
  };
}

async function loginGoogle(req: Request, res: Response) {
  var gtoken = req.body.gtoken;
  await verify(gtoken)
    .then((googleUser) => {

      User.findOne({ tx_email: googleUser.email })
        .populate('id_company')
        .populate('id_skills')
        .then(userDB => {

          if (userDB) {  // el user existe, intenta loguearse

            if (userDB.bl_google === false) {

              return res.status(400).json({
                ok: false,
                msg: "Para el email ingresado debe usar autenticación con clave.",
                user: null
              });

            } else {

              // Google SignIn -> new token
              var token = Token.getJwtToken({ user: userDB });

              userDB.updateOne({ fc_lastlogin: + new Date().getTime() })
                .then(userSaved => {

                  userSaved.tx_password = ":)";
                  res.status(200).json({
                    ok: true,
                    msg: 'Login exitoso',
                    token: token,
                    user: userDB,
                    menu: obtenerMenu(userDB.id_role),
                    home: '/admin/home'
                  });

                }).catch((err) => {

                  return res.status(400).json({
                    ok: false,
                    msg: 'Error al loguear el user de Google',
                    err
                  });

                });

            }

          } else { // el user no existe, hay que crearlo.

            var user = new User();
            user.tx_email = googleUser.email;
            user.tx_name = googleUser.name;
            user.tx_password = ':)';
            user.tx_img = googleUser.img;
            user.bl_google = true;
            user.fc_lastlogin = new Date();
            user.fc_createdat = new Date();
            user.id_role = 'ADMIN_ROLE';

            user.save().then(userSaved => {

              var token = Token.getJwtToken({ user: userDB });
              res.status(200).json({
                ok: true,
                msg: 'Usuario creado y logueado correctamente',
                token: token,
                user,
                menu: obtenerMenu(userSaved.id_role),
                home: '/admin/home'
              });

            }).catch((err) => {

              res.status(500).json({
                ok: false,
                msg: 'Error al guardar el user de Google',
                err
              });

            })
          }
        }).catch((err) => {

          res.status(500).json({
            ok: false,
            msg: "Error al buscar user",
            error: err
          });

        })
    })
    .catch(err => {
      res.status(403).json({
        ok: false,
        msg: "Token de Google no valido",
        err
      });
    });


}

function loginUser(req: Request, res: Response) {

  var body = req.body;
  User.findOne({ tx_email: body.tx_email })
    .populate('id_company')
    .populate({ path: 'id_skills', select: 'cd_skill tx_skill' })
    .then(userDB => {

      if (!userDB) {
        return res.status(400).json({
          ok: false,
          msg: "Usuaro o Contraseña incorrecta."
        });
      }

      if (!bcrypt.compareSync(body.tx_password, userDB.tx_password)) {
        return res.status(400).json({
          ok: false,
          msg: "Contraseña o usuario incorrecto."
        });
      }

      // Si llego hasta acá, el user y la contraseña son correctas, creo el token
      var token = Token.getJwtToken({ user: userDB });
      userDB.fc_lastlogin = new Date();

      userDB.save().then(() => {

        userDB.tx_password = ":)";
        let home = userDB.id_role === 'ADMIN_ROLE' ? '/admin/home' : '/assistant/home';
        res.status(200).json({
          ok: true,
          msg: "Login post recibido.",
          token: token,
          body: body,
          id: userDB._id,
          user: userDB,
          menu: obtenerMenu(userDB.id_role),
          home
        });

      }).catch((err) => {
        return res.status(500).json({
          ok: false,
          msg: "Error al actualizar la fecha de login",
          errors: err
        });
      })

    }).catch((err) => {
      return res.status(500).json({
        ok: false,
        msg: "Error al buscar un user",
        errors: err
      });

    })


}

function obtenerMenu(id_role: string) {
  var menu = [];

  if ((id_role === "ASSISTANT_ROLE") || (id_role === "ADMIN_ROLE")) {
    menu.push({
      titulo: "Asistente",
      icon: "headset_mic",
      submenu: [
        { titulo: "Home", url: "/assistant/home", icon: "home" },
        { titulo: "Dashboard", url: "/assistant/dashboard", icon: "insights" },
        { titulo: "Escritorio", url: "/assistant/desktop", icon: "desktop_windows" },
      ]
    }); // unshift lo coloca al princio del array, push lo coloca al final.
  }

  if (id_role === "ADMIN_ROLE") {
    menu.push({
      titulo: "Administrador",
      icon: "local_police",
      submenu: [
        { titulo: "Home", url: "/admin/home", icon: "home" },
        { titulo: "Mi Perfil", url: "/admin/profile", icon: "face" },
        { titulo: "Comercios", url: "/admin/companies", icon: "add_business" },
        { titulo: "Asistentes", url: "/admin/assistants", icon: "headset_mic" },
        { titulo: "Escritorios", url: "/admin/desktops", icon: "important_devices" },
        { titulo: "Skills", url: "/admin/skills", icon: "playlist_add_check" },
        { titulo: "Turnos", url: "/admin/tickets", icon: "bookmark" },
        { titulo: "Dashboard", url: "/admin/dashboard", icon: "insights" },

      ]
    }); // unshift lo coloca al princio del array, push lo coloca al final.
  }

  if (id_role === "SUPERUSER_ROLE") {
    menu.push({
      titulo: "Super Usuario",
      icon: "face",
      submenu: [
        { titulo: "Usuarios", url: "/superuser/users", icon: "mdi mdi-account-multiple-plus" },
        { titulo: "Empresas", url: "/superuser/company", icon: "mdi mdi-city" },
        { titulo: "Turnos", url: "/superuser/tickets", icon: "mdi mdi-table-large" },
        { titulo: "Metricas", url: "/superuser/metrics", icon: "mdi mdi-console" }
      ]
    }); // unshift lo coloca al princio del array, push lo coloca al final.
  }



  return menu;
}


export = {
  createUser,
  attachCompany,
  checkEmailExists,
  updateToken,
  loginGoogle,
  loginUser,
  obtenerMenu
}

