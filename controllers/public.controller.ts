import { Request, Response } from 'express';
import { User } from '../models/user.model';

function getClientData(req: Request, res: Response) {
  var company = String(req.params.company);
  
  User.findOne({id_company: company}, 'id_company tx_email', (err, user) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar el usuario",
          errors: err
        });
      }
  
      if (!user) {
        return res.status(400).json({
          ok: false,
          mensaje: "No existe un usuario con el id solicitado"
        });
      }
      
      user.tx_password = ':)';
      res.status(200).json({
        ok: true,
        user
      });
  
    });
  }


  export = {   
    getClientData
  }
  
  