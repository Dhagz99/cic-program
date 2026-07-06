-- AddForeignKey
ALTER TABLE "StagingClient" ADD CONSTRAINT "StagingClient_secondaryIdentificationTypeCode_fkey" FOREIGN KEY ("secondaryIdentificationTypeCode") REFERENCES "identification_type_domain"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_secondaryIdentificationTypeCode_fkey" FOREIGN KEY ("secondaryIdentificationTypeCode") REFERENCES "identification_type_domain"("code") ON DELETE SET NULL ON UPDATE CASCADE;
