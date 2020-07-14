import { Response, Request, NextFunction } from 'express';
import Token from '../classes/token';

let verificaToken = (req: any, res: Response, next: NextFunction) => {

    // Hay varias formas de recibir el token, puede ser por la URL como un argumento, en los HEADERS, que es lo tradicional
    // Vamos a recibirlo por una propiedad personalizada, o un header personalizado llamado x-token en los HEADERS.

    const userToken = req.get('turnos-token' || '');
    Token.checkToken(userToken)
        .then((decoded: any) => {
            console.log('Decoded:', decoded);
            req.usuario = decoded.usuario;
            next(); // Esta función le va a decir al programa que puede continuar después de llamar al middleware.
        })
        .catch((err) => {
            res.json({
                ok: false,
                err: 'Token incorrecto'
            });
        });
};

let canUpdate = (req: any, res: Response, next: NextFunction) => {
    console.log("VERIFICANDO SI ES ADMIN...");
    // Aca no vamos a usar el TOKEN porque yo ya se desde el middleware de verificaToken que el token ES valido.
  
    var user_request = req.usuario;
    var user_to_update = req.params.id; // -> app.put('/:id',
    // este metodo en el middle verifica que se un admin para permitirle hacer actualizaciones o inserciones 
    // determinadas en los routes. Pero que pasa si un usuario que es ROLE_USER quiere cambiarse a si mismo?
    // para eso verifico que el usuario a actualizar sea el mismo que el usuario del request.
    if (
      user_request.role === "ADMIN_ROLE" ||
      user_request._id === user_to_update
    ) {
      console.log(
        "Accion permitida, el usuario es role Admin, o apunta al mismo usuario."
      );
  
      next();
      return;
    } else {
      console.log("EL USUARIO ES ROLE USER...");
      return res.status(401).json({
        //401 UNAUTHORIZED
        ok: false,
        mensaje: "Token Incorrecto - el role no es ADMIN_ROLE",
        errors: {
          message:
            "No puede ejecutar la accion solicitada, no posee permisos."
        }
      });
    }
  };


export = {
    verificaToken,
    canUpdate
}