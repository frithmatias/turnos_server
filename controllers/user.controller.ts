import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import Token from '../classes/token';
import environment from '../global/environment';

import { User } from '../models/user.model';

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
    fc_createdat: new Date()
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
      msg: "Error al guardar el usuario.",
      errors: err
    });

  });


}

function attachCompany(req: Request, res: Response) {

  let company  = req.body.company;
  let idUser = req.params.idUser;

  User.findByIdAndUpdate(idUser, {'id_company': company._id}, {new: true})
  .populate('id_company')
  .then(userUpdated => {
    console.log(userUpdated)
    return res.status(200).json({
      ok: true,
      msg: 'La empresa se asigno al usuario correctamente',
      user: userUpdated
    })
  }).catch(()=>{
    return res.status(500).json({
      ok: true,
      msg: 'No se pudo asignar la empresa al usuario',
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
  var token = Token.getJwtToken({ usuario: req.usuario })
  res.status(200).json({
    ok: true,
    usuario: req.usuario,
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
  var token = req.body.token;
  var googleUser: any = await verify(token) // devuelve una promesa
    .catch(err => {
      res.status(403).json({
        ok: false,
        msg: "Token de Google no valido",
        err
      });
    });


  if (!googleUser) {
    return res.status(500).json({
      ok: false,
      message: "No se pudo obtener el usuario de Google.",
      err: null
    });
  }

  User.findOne({ tx_email: googleUser.email }).then(userDB => {

    if (userDB) {  // el usuario existe, intenta loguearse

      if (userDB.bl_google === false) {

        return res.status(400).json({
          ok: false,
          msg: "Para el email ingresado debe usar autenticación con clave.",
          user: null
        });

      } else {

        // Google SignIn -> new token
        var token = Token.getJwtToken({ usuario: userDB });

        userDB.updateOne({fc_lastlogin: + new Date().getTime()}).then(userSaved => {

          userSaved.tx_password = ":)";
          res.status(200).json({
            ok: true,
            msg: 'Login exitoso',
            token: token,
            usuario: userDB,
            menu: obtenerMenu(userDB.id_role)
          });

        }).catch((err) => {

          return res.status(400).json({
            ok: false,
            msg: 'Error al loguear el usuario de Google',
            err
          });

        });

      }

    } else { // el usuario no existe, hay que crearlo.

      var usuario = new User();

      usuario.tx_email = googleUser.email;
      usuario.tx_name = googleUser.name;
      usuario.tx_password = ':)';
      usuario.tx_img = googleUser.img;
      usuario.bl_google = true;
      usuario.fc_lastlogin = new Date();
      usuario.fc_createdat = new Date();
      usuario.id_role = 'USER_ROLE';

      usuario.save().then(userSaved => {

        var token = Token.getJwtToken({ usuario: userDB })

        res.status(200).json({
          ok: true,
          msg: 'Usuario creado y logueado correctamente',
          token: token,
          usuario,
          menu: obtenerMenu(userSaved.id_role)
        });

      }).catch((err) => {

        res.status(500).json({
          ok: false,
          msg: 'Error al guardar el usuario de Google',
          err
        });
      })
    }
  }).catch((err)=> {

      res.status(500).json({
        ok: false,
        msg: "Error al buscar usuario",
        error: err
      });

    })
}

function loginUser(req: Request, res: Response) {

  var body = req.body;
  User.findOne({ tx_email: body.tx_email })
    .populate('id_company')
    .populate({ path: 'id_skills', select: 'cd_skill tx_skill' })
    .then(usuarioDB => {

      if (!usuarioDB) {
        return res.status(400).json({
          ok: false,
          msg: "Credenciales incorrectas1"
        });
      }

      if (!bcrypt.compareSync(body.tx_password, usuarioDB.tx_password)) {
        return res.status(400).json({
          ok: false,
          msg: "Credenciales incorrectas2"
        });
      }

      // Si llego hasta acá, el usuario y la contraseña son correctas, creo el token
      var token = Token.getJwtToken({ usuario: usuarioDB });
      usuarioDB.fc_lastlogin = new Date();

      usuarioDB.save().then(() => {

        usuarioDB.tx_password = ":)";

        res.status(200).json({
          ok: true,
          msg: "Login post recibido.",
          token: token,
          body: body,
          id: usuarioDB._id,
          usuario: usuarioDB,
          menu: obtenerMenu(usuarioDB.id_role)
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
        msg: "Error al buscar un usuario",
        errors: err
      });

    })


}

function obtenerMenu(id_role: string) {
  var menu = [];

  if ((id_role === "ASSISTANT_ROLE") || (id_role === "USER_ROLE")) {
    menu.push({
      titulo: "Asistente",
      icon: "headset_mic",
      submenu: [
        { titulo: "Home", url: "/assistant/home", icon: "home" },
        { titulo: "Dashboard", url: "/assistant/dashboard", icon: "dashboard" },
        { titulo: "Escritorio", url: "/assistant/desktop", icon: "desktop_windows" },
      ]
    }); // unshift lo coloca al princio del array, push lo coloca al final.
  }

  if (id_role === "USER_ROLE") {
    menu.push({
      titulo: "Usuario",
      icon: "verified_user",
      submenu: [
        { titulo: "Home", url: "/user/home", icon: "home" },
        { titulo: "Mi Perfil", url: "/user/profile", icon: "face" },
        { titulo: "Empresas", url: "/user/companies", icon: "store" },
        { titulo: "Asistentes", url: "/user/assistants", icon: "supervised_user_circle" },
        { titulo: "Escritorios", url: "/user/desktops", icon: "exit_to_app" },
        { titulo: "Skills", url: "/user/skills", icon: "playlist_add_check" },
        { titulo: "Turnos", url: "/user/tickets", icon: "bookmark" },
        { titulo: "Dashboard", url: "/user/dashboard", icon: "dashboard" },

      ]
    }); // unshift lo coloca al princio del array, push lo coloca al final.
  }

  if (id_role === "ADMIN_ROLE") {
    menu.push({
      titulo: "Administrador",
      icon: "face",
      submenu: [
        { titulo: "Usuarios", url: "/admin/users", icon: "mdi mdi-account-multiple-plus" },
        { titulo: "Empresas", url: "/admin/company", icon: "mdi mdi-city" },
        { titulo: "Turnos", url: "/admin/tickets", icon: "mdi mdi-table-large" },
        { titulo: "Metricas", url: "/admin/metrics", icon: "mdi mdi-console" }
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

