export const validateClient = (
    client: any
 ) => {
 
    const errors = [];
 
    /*
    --------------------------------
    REQUIRED FIELDS
    --------------------------------
    */
 
    if (!client.firstName) {

        errors.push({
           fieldName: "firstName",
           errorMessage:
              "Name required"
        });
  
     }
 
    /*
    --------------------------------
    BIRTHDATE
    --------------------------------
    */
 
    if (!client.birthDate) {
 
       errors.push({
          fieldName: "birthDate",
          errorMessage:
             "Birthdate required"
       });
 
    }
 
    /*
    --------------------------------
    ADDRESS
    --------------------------------
    */
 
    if (!client.address) {
 
       errors.push({
          fieldName: "address",
          errorMessage:
             "Address required"
       });
 
    }
 
    return errors;
 };