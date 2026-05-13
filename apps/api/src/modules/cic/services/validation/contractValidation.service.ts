export const validateContract = (
    contract: any
 ) => {
 
    const errors = [];
 
    /*
    --------------------------------
    CONTRACT NUMBER
    --------------------------------
    */
 
    if (!contract.contractNo) {
 
       errors.push({
          fieldName: "contractNo",
          errorMessage:
             "Contract number required"
       });
 
    }
 
    /*
    --------------------------------
    FINANCED AMOUNT
    --------------------------------
    */
 
    if (
       !contract.financedAmount ||
       contract.financedAmount <= 0
    ) {
 
       errors.push({
          fieldName: "financedAmount",
          errorMessage:
             "Invalid financed amount"
       });
 
    }
 
    return errors;
 };