import { Request, Response } from 'express';
import { Company } from '../models/company.model';

// ========================================================
// Company Methods
// ========================================================

function updateCompany(req: Request, res: Response) {
  var body = req.body;
  var id = req.params.id;

  // Verifico que el id existe
  Company.findById(id, (err, company) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        msg: "Error al buscar un company",
        company: null
      });
    }

    if (!company) {
      return res.status(400).json({
        ok: false,
        msg: "No existe la empresa",
        company: null
      });
    }

    company.tx_company_name = body.tx_company_name;
    company.tx_address_street = body.tx_address_street;
    company.tx_address_number = body.tx_address_number;

    company.save((err, companySaved) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          msg: "Error al actualizar la empresa",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        msg: "Empresa guardada correctamente",
        company: companySaved
      });
    });
  });
}

export = {
  updateCompany,
}

