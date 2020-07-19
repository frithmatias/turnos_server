import { Request, Response } from 'express';
import { User } from '../models/user.model';
import Token from '../classes/token';
import bcrypt from 'bcrypt';
import environment from '../global/environment';
import { Desktop } from '../models/desktop.model';
import { Company } from '../models/company.model';

// Google Login
var GOOGLE_CLIENT_ID = environment.GOOGLE_CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);


// ========================================================
// User Methods
// ========================================================

function registerUser(req: any, res: Response) {

  var body = req.body;
  console.log(body)
  // Save Company

  var company = new Company({
    tx_company_name: body.company.tx_company_name,
    tx_address_street: body.company.tx_address_street,
    tx_address_number: body.company.tx_address_number,
    cd_city: body.company.cd_city,
    fc_att_start: null,
    fc_att_end: null
  });

  company.save().then((companySaved) => {
    console.log(companySaved);
    // Save User

    var user = new User({
      tx_name: body.user.tx_name,
      tx_email: body.user.tx_email,
      id_company: companySaved._id,
      tx_password: bcrypt.hashSync(body.user.tx_password, 10),
      bl_google: false,
      fc_createdat: new Date()
    });
  
    user.save().then((userSaved) => {
      
      res.status(201).json({
        ok: true,
        msg: "Usuario guardado correctamente.",
        user: userSaved, 
        company: companySaved 
      });

    }).catch((err) => {
      return res.status(400).json({
        ok: false,
        msg: "Error al guardar el usuario.",
        errors: err
      });
    });

  }).catch((err) => {
    console.log(err)
    return res.status(400).json({
      ok: false,
      msg: "Error al guardar la empresa.",
      errors: err
    });
  });


}

function readUser(req: Request, res: Response) {

  User.findById(req.params.id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        msg: "Error al buscar el usuario",
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un usuario con el id solicitado",
        errors: { message: "No existe usuario con el id solicitado" }
      });
    }

    res.status(200).json({
      ok: true,
      usuario
    });

  });
}

function updateUser(req: Request, res: Response) {
  var body = req.body;
  var id = req.params.id;

  // Verifico que el id existe
  User.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        msg: "Error al buscar un usuario",
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un usuario con el id " + id,
        errors: { message: "No existe usuario con el id solicitado" }
      });
    }

    usuario.tx_name = body.tx_name;
    usuario.tx_email = body.tx_email;
    usuario.id_role = body.id_role;

    usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          msg: "Error al actualizar el usuario",
          errors: err
        });
      }

      usuarioGuardado.tx_password = ":)";

      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
      });
    });
  });
}

function deleteUser(req: Request, res: Response) {
  var id = req.params.id;

  User.findByIdAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        msg: "Error borrando usuario",
        errors: err
      });
    }

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        msg: "Error borrando usuario, el usuario solicitado NO existe.",
        errors: { message: "No existe el usuario que intenta borrar." } // Este objeto con los errores viene de mongoose
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Usuario borrado correctamente.",
      usuario: usuarioBorrado
    });
  });
}

// ========================================================
// Session methods
// ========================================================

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
        msg: "Token no valido",
        error: err
      });
    });


  if (!googleUser) {
    return res.status(500).json({
      ok: false,
      message: "No se pudo obtener el usuario de Google."
    });
  }

  User.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    if (err) {
      res.status(500).json({
        ok: false,
        msg: "Error al buscar usuario",
        error: err
      });
    }

    if (usuarioDB) {
      if (usuarioDB.bl_google === false) {
        return res.status(400).json({
          ok: false,
          msg: "Para el email ingresado debe usar autenticación con clave.",
          error: err
        });
      } else {
        // Google SignIn -> new token
        var token = Token.getJwtToken({ usuario: usuarioDB })

        usuarioDB.fc_lastlogin = new Date();
        usuarioDB.save((err, userLastLogin) => {

          if (err) {
            res.status(500).json({
              ok: false,
              msg: "Error al actualizar la fecha de ultimo login del usuario",
              error: err
            });
          }

          usuarioDB.tx_password = ":)";

          res.status(200).json({
            ok: true,
            msg: "Login exitoso.",
            token: token,
            id: usuarioDB.id,
            usuario: usuarioDB,
            menu: obtenerMenu(usuarioDB.id_role)
          });
        });

      }
    } else {

      // el usuario no existe, hay que crearlo.
      var usuario = new User();

      usuario.tx_email = googleUser.tx_email;
      usuario.tx_name = googleUser.tx_name;
      usuario.tx_password = ":)";
      usuario.id_company = googleUser.tx_email;
      usuario.tx_img = googleUser.tx_img;
      usuario.bl_google = true;
      usuario.fc_lastlogin = new Date();
      usuario.fc_createdat = new Date();
      usuario.id_role = 'USER_ROLE';


      usuario.save((err, usuarioDB) => {

        var token = Token.getJwtToken({ usuario: usuarioDB })

        res.status(200).json({
          ok: true,
          token: token,
          msg: { message: "OK LOGUEADO " },
          usuario,
          // menu: obtenerMenu(usuarioDB.id_role)
        });
      });
    }
  });
}

function loginUser(req: Request, res: Response) {

  var body = req.body;
  User.findOne({ tx_email: body.tx_email }).then( usuarioDB => {

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

  }).catch ((err) => {
  return res.status(500).json({
    ok: false,
    msg: "Error al buscar un usuario",
    errors: err
  });

})


}

function obtenerMenu(id_role: string) {
  var menu = [];


  if ((id_role === "ASSISTANT_ROLE") || (id_role === "CLIENT_ROLE")) {
    menu.push({
      titulo: "Asistente",
      icono: "mdi mdi-settings",
      submenu: [
        { titulo: "Home", url: "/asistente/home", icono: "mdi mdi-search-web" },
        { titulo: "Dashboard", url: "/asistente/dashboard", icono: "mdi mdi-face" },
        { titulo: "Escritorio", url: "/asistente/escritorio", icono: "mdi mdi-format-color-fill" },
      ]
    }); // unshift lo coloca al princio del array, push lo coloca al final.
  }


  if (id_role === "USER_ROLE") {
    menu.push({
      titulo: "Usuario",
      icono: "mdi mdi-settings",
      submenu: [
        { titulo: "Home", url: "/user/home", icono: "mdi mdi-search-web" },
        { titulo: "Mi Perfil", url: "/user/profile", icono: "mdi mdi-face" },
        { titulo: "Asistentes", url: "/user/assistants", icono: "mdi mdi-format-color-fill" },
        { titulo: "Ventanillas", url: "/user/desktops", icono: "mdi mdi-plus-circle-outline" },
        { titulo: "Skill", url: "/user/skills", icono: "mdi mdi-plus-circle-outline" },
        { titulo: "Turnos", url: "/user/tickets", icono: "mdi mdi-heart" },
        { titulo: "Dashboard", url: "/user/dashboard", icono: "mdi mdi-city" },
      ]
    }); // unshift lo coloca al princio del array, push lo coloca al final.
  }

  if (id_role === "ADMIN_ROLE") {
    menu.push({
      titulo: "Administrador",
      icono: "mdi mdi-settings",
      submenu: [
        { titulo: "Usuarios", url: "/admin/users", icono: "mdi mdi-account-multiple-plus" },
        { titulo: "Empresas", url: "/admin/company", icono: "mdi mdi-city" },
        { titulo: "Turnos", url: "/admin/tickets", icono: "mdi mdi-table-large" },
        { titulo: "Metricas", url: "/admin/metrics", icono: "mdi mdi-console" }
      ]
    }); // unshift lo coloca al princio del array, push lo coloca al final.
  }



  return menu;
}

export = {
  registerUser,
  readUser,
  updateUser,
  deleteUser,
  updateToken,
  loginGoogle,
  loginUser,
  obtenerMenu
}

