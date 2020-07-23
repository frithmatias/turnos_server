import { Request, Response } from 'express';
import { Company } from '../models/company.model';
import { Contact } from '../models/contact.model';

function getClientData(req: Request, res: Response) {
  var company = String(req.params.company);

  Company.findOne({ tx_company_name: company }).then(companyDB => {

    if (!companyDB) {
      return res.status(400).json({
        ok: false,
        msg: "No existe la empresa",
        company: null
      });
    }

    res.status(200).json({
      ok: true,
      msg: 'Empresa obtenida correctamente',
      company: companyDB
    });

  }).catch(() => {
    return res.status(500).json({
      ok: false,
      msg: "Error al buscar el usuario",
      company: null
    });
  })
}

function postContact(req: Request, res: Response) {

  let contact = new Contact();
  contact.tx_type = req.body.tx_type;
  contact.tx_message = req.body.tx_message;
  contact.tx_name = req.body.tx_name;
  contact.tx_email = req.body.tx_email;
  contact.tx_phone = req.body.tx_phone;

  contact.save().then(contactSaved => {
    return res.status(200).json({
      ok: true,
      msg: 'Contacto guardado correctamente',
      contact: contactSaved._id
    })
  }).catch(() => {
    return res.status(400).json({
      ok: false,
      msg: 'Error al guardar el contacto',
      contact: null
    })
  })


}

export = {
  getClientData,
  postContact
}

