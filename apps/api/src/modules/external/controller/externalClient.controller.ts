// src/modules/external/controllers/externalClient.controller.ts

import { Request, Response } from "express";
import { getExternalClientByAccountService, getExternalClientsService } from "../services/getExternalClients.service";

export const getExternalClientsController = async (
   req: Request,
   res: Response
) => {
   const result = await getExternalClientsService({
      search: req.query.search as string,
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 50),
   });

   return res.json(result);
};


export const getExternalClientByAccountController = async (
   req: Request,
   res: Response
) => {
try{
   const {accountNo} = req.params;

   if(!accountNo) {
      return res.status(400).json({
         message: "Account number is required",
      });
   }

   const result = await getExternalClientByAccountService(accountNo);


   return res.json({
      data: result
   });

}
catch(error){
   return res.status(404).json({
      message:
         error instanceof Error
            ? error.message
            : "Client not found",
   });
}

}