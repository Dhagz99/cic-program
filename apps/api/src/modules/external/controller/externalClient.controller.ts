// src/modules/external/controllers/externalClient.controller.ts

import { Request, Response } from "express";
import { getExternalClientsService } from "../services/getExternalClients.service";

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