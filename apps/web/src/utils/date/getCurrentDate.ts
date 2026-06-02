// utils/getCurrentDate.ts

export const getCurrentDate = () => {

    return new Date().toLocaleDateString(
       "en-US",
       {
          year: "numeric",
          month: "long",
          day: "numeric"
       }
    );
 
 };