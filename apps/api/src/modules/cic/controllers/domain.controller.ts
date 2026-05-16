// controllers/domain.controller.ts

import { Request, Response }
from "express";

import {
   getGenderDomainService
}
from "../services/domain/getGenderDomain.service";
import { getCivilStatusDomainService } from "../services/domain/etCivilStatusDomain.service";
import { getIdentificationTypeDomainService } from "../services/domain/getIdentificationTypeDomain.service";

export const getGenderDomainController =
async (
   req: Request,
   res: Response
) => {

   const data =
      await getGenderDomainService();

   res.json(data);

};

export const getCivilStatusDomainController =
async (
   req: Request,
   res: Response
) => {

   const data =
      await getCivilStatusDomainService();

   res.json(data);

};

export const getIdentificationTypeDomainController =
async (
   req: Request,
   res: Response
) => {

   const data =
      await getIdentificationTypeDomainService();

   res.json(data);

};