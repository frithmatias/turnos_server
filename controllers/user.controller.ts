import { Request, Response } from 'express';
import { User } from '../models/user.model';
import Token from '../classes/token';
import bcrypt from 'bcrypt';
import environment from '../global/environment';
import { Desktop } from '../models/desktop.model';

// Google Login
var GOOGLE_CLIENT_ID = environment.GOOGLE_CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID);


// ========================================================
// User Methods
// ========================================================


function registerUser(req: any, res: Response) {

  var body = req.body;
  console.log('body', body);
  var user = new User({
    tx_name: body.tx_name,
    tx_email: body.tx_email,
    id_company: body.id_company,
    tx_password: bcrypt.hashSync(body.tx_password, 10),
    bl_google: false,
    fc_createdat: new Date()
  });
  console.log('user', user);

  //===================================
  // SAVE USER
  //===================================

  user.save().then((userSaved) => {
    res.status(201).json({
      ok: true,
      mensaje: "Usuario guardado correctamente.",
      usuario: userSaved, // USUARIO A GUARDAR
      usuariotoken: req.usuario // USUARIO QUE HIZO LA SOLICITUD
    });
  }).catch((err) => {
    return res.status(400).json({
      ok: false,
      mensaje: "Error al guardar el usuario.",
      errors: err
    });
  });
}


function readUser(req: Request, res: Response) {

  User.findById(req.params.id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar el usuario",
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe un usuario con el id solicitado",
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
        mensaje: "Error al buscar un usuario",
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe un usuario con el id " + id,
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
          mensaje: "Error al actualizar el usuario",
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
        mensaje: "Error borrando usuario",
        errors: err
      });
    }

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error borrando usuario, el usuario solicitado NO existe.",
        errors: { message: "No existe el usuario que intenta borrar." } // Este objeto con los errores viene de mongoose
      });
    }

    res.status(200).json({
      ok: true,
      mensaje: "Usuario borrado correctamente.",
      usuario: usuarioBorrado
    });
  });
}


// ========================================================
// Assistant Methods
// ========================================================

function createAssistant(req: Request, res: Response) {

  var body = req.body;

  var assistant = new User({
    tx_email: body.tx_email,
    tx_name: body.tx_name,
    id_company: body.id_company,
    tx_password: bcrypt.hashSync(body.tx_password, 10),
    tx_img: body.tx_img,
    id_role: 'ASSISTANT_ROLE',
    fc_createdat: new Date()
  });

  assistant.save().then((assistantSaved) => {
    res.status(200).json({
      ok: true,
      msg: 'Asistente guardado correctamente',
      assistant: assistantSaved
    })
  }).catch((err) => {
    res.status(400).json({
      ok: false,
      msg: err,
      assistant: null
    })
  })
}

function readAssistants(req: Request, res: Response) {
  let idCompany = req.params.idCompany;
  User.find({ id_company: idCompany }).then((assistants) => {
    res.status(200).json({
      ok: true,
      msg: 'Asistentes obtenidos correctamente',
      assistants
    })
  }).catch(() => {
    res.status(400).json({
      ok: false,
      msg: 'Error al consultar los asistentes',
      assistants: null
    })
  })
}

function deleteAssistant(req: Request, res: Response) {
  let idAssistant = req.params.idAssistant;
  User.findByIdAndDelete(idAssistant).then((assistantDeleted) => {
    res.status(200).json({
      ok: true,
      msg: 'Asistente eliminado correctamente',
      assistant: assistantDeleted
    })
  }).catch(() => {
    res.status(400).json({
      ok: false,
      msg: 'Error al eliminar al asistente',
      assistant: null
    })
  })
}


// ========================================================
// Desktop Methods
// ========================================================

function createDesktop(req: Request, res: Response) {

  var body = req.body;
  var desktop = new Desktop({
    id_company: body.id_company,
    id_desktop: body.id_desktop,
    id_type: body.id_type
  });

  desktop.save().then((desktopSaved) => {
    res.status(200).json({
      ok: true,
      msg: 'Escritorio guardado correctamente',
      desktop: desktopSaved
    })
  }).catch((err) => {
    res.status(400).json({
      ok: false,
      msg: err.message,
      desktop: null
    })
  })
}

function readDesktops(req: Request, res: Response) {
  let idCompany = req.params.idCompany;
  Desktop.find({ id_company: idCompany }).then((desktops) => {
    res.status(200).json({
      ok: true,
      msg: 'Escritorios obtenidos correctamente',
      desktops
    })
  }).catch(() => {
    res.status(400).json({
      ok: false,
      msg: 'Error al consultar los escritorios',
      desktops: null
    })
  })
}

function deleteDesktop(req: Request, res: Response) {
  let idDesktop = req.params.idDesktop;
  Desktop.findByIdAndDelete(idDesktop).then((desktopDeleted) => {
    res.status(200).json({
      ok: true,
      msg: 'Escritorio eliminado correctamente',
      desktop: desktopDeleted
    })
  }).catch(() => {
    res.status(400).json({
      ok: false,
      msg: 'Error al eliminar el escritorio',
      desktop: null
    })
  })
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
        mensaje: "Token no valido",
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
        mensaje: "Error al buscar usuario",
        error: err
      });
    }

    if (usuarioDB) {
      if (usuarioDB.bl_google === false) {
        return res.status(400).json({
          ok: false,
          mensaje: "Para el email ingresado debe usar autenticación con clave.",
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
              mensaje: "Error al actualizar la fecha de ultimo login del usuario",
              error: err
            });
          }

          usuarioDB.tx_password = ":)";

          res.status(200).json({
            ok: true,
            mensaje: "Login exitoso.",
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
        if (err) {
          console.log(err);
        }
        var token = Token.getJwtToken({ usuario: usuarioDB })

        console.log(usuarioDB);
        res.status(200).json({
          ok: true,
          token: token,
          mensaje: { message: "OK LOGUEADO " },
          usuario,
          // menu: obtenerMenu(usuarioDB.id_role)
        });
      });
    }
  });
}

function loginUser(req: Request, res: Response) {

  var body = req.body;
  console.log(body);
  User.findOne({ tx_email: body.tx_email }).then( usuarioDB => {

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas1"
      });
    }

    if (!bcrypt.compareSync(body.tx_password, usuarioDB.tx_password)) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas2"
      });
    }

    // Si llego hasta acá, el usuario y la contraseña son correctas, creo el token
    var token = Token.getJwtToken({ usuario: usuarioDB });
    usuarioDB.fc_lastlogin = new Date();

    usuarioDB.save().then(() => {

      usuarioDB.tx_password = ":)";
      res.status(200).json({
        ok: true,
        mensaje: "Login post recibido.",
        token: token,
        body: body,
        id: usuarioDB._id,
        usuario: usuarioDB,
        menu: obtenerMenu(usuarioDB.id_role)
      });

    }).catch((err) => {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al actualizar la fecha de login",
        errors: err
      });
    })

  }).catch ((err) => {
  return res.status(500).json({
    ok: false,
    mensaje: "Error al buscar un usuario",
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

  createAssistant,
  readAssistants,
  deleteAssistant,

  createDesktop,
  readDesktops,
  deleteDesktop,

  updateToken,
  loginGoogle,
  loginUser,
  obtenerMenu
}

