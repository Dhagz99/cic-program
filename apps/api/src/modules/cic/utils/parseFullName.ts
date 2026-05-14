export const parseFullName = (
    fullName: string
 ) => {
 
    /*
    -----------------------------------
    EMPTY VALUE
    -----------------------------------
    */
 
    if (!fullName) {
 
       return {
 
          fullName: "",
          firstName: "",
          middleName: "",
          lastName: "",
          suffix: ""
 
       };
 
    }
 
    /*
    -----------------------------------
    CLEAN EXTRA SPACES
    -----------------------------------
    */
 
    const cleaned =
       fullName
       .replace(/\s+/g, " ")
       .trim();
 
    /*
    -----------------------------------
    SUFFIX LIST
    -----------------------------------
    */
 
    const suffixList = [
 
       "JR",
       "JR.",
       "SR",
       "SR.",
       "II",
       "III",
       "IV"
 
    ];
 
    /*
    -----------------------------------
    SPLIT:
 
    LASTNAME, FIRSTNAME MIDDLENAME
 
    Example:
    BUNCALAN,MARIA WELYNA C.
    -----------------------------------
    */
 
    const commaParts =
       cleaned.split(",");
 
    let lastName =
       commaParts[0]?.trim() || "";
 
    const remaining =
       commaParts[1]?.trim() || "";
 
    let suffix = "";
 
    /*
    -----------------------------------
    DETECT SUFFIX INSIDE LASTNAME
 
    Example:
    CABANSAG JR
    -----------------------------------
    */
 
    const lastNameTokens =
       lastName.split(" ");
 
    const possibleLastNameSuffix =
       lastNameTokens[
          lastNameTokens.length - 1
       ]?.toUpperCase();
 
    if (
       suffixList.includes(
          possibleLastNameSuffix
       )
    ) {
 
       suffix =
          lastNameTokens.pop() || "";
 
       lastName =
          lastNameTokens.join(" ");
 
    }
 
    /*
    -----------------------------------
    TOKENIZE REMAINING
    -----------------------------------
    */
 
    const tokens =
       remaining
       .split(" ")
       .filter(Boolean);
 
    /*
    -----------------------------------
    DETECT SUFFIX IN REMAINING
 
    Example:
    JUAN JR.
    -----------------------------------
    */
 
    const possibleRemainingSuffix =
       tokens[
          tokens.length - 1
       ]?.toUpperCase();
 
    if (
       suffixList.includes(
          possibleRemainingSuffix
       )
    ) {
 
       suffix =
          tokens.pop() || suffix;
 
    }
 
    /*
    -----------------------------------
    FIRSTNAME + MIDDLENAME
    -----------------------------------
    */
 
    let firstName = "";
 
    let middleName = "";
 
    /*
    -----------------------------------
    EXAMPLES:
 
    MARIA WELYNA C.
    JOHN PAUL D.
    MA. GLORIA V.
 
    RULE:
    IF LAST TOKEN IS MIDDLE INITIAL,
    EVERYTHING BEFORE IT = FIRSTNAME
    -----------------------------------
    */
 
    const lastToken =
       tokens[
          tokens.length - 1
       ];
 
    const isMiddleInitial =
       /^[A-Z]\.$/i.test(
          lastToken || ""
       );
 
    /*
    -----------------------------------
    PHILIPPINE "MA." SUPPORT
 
    Example:
    MA. GLORIA V.
    -----------------------------------
    */
 
    if (
 
       tokens[0]?.toUpperCase() === "MA."
       ||
 
       tokens[0]?.toUpperCase() === "MA"
 
    ) {
 
       /*
       MA. GLORIA
       */
 
       if (isMiddleInitial) {
 
          middleName =
             tokens.pop() || "";
 
          firstName =
             tokens.join(" ");
 
       } else {
 
          firstName =
             `${tokens[0]} ${tokens[1] || ""}`
             .trim();
 
          middleName =
             tokens
             .slice(2)
             .join(" ");
 
       }
 
    } else {
 
       /*
       -----------------------------------
       NORMAL PHILIPPINE NAME SUPPORT
 
       Example:
       MARIA WELYNA C.
 
       firstname:
       MARIA WELYNA
 
       middlename:
       C.
       -----------------------------------
       */
 
       if (isMiddleInitial) {
 
          middleName =
             tokens.pop() || "";
 
          firstName =
             tokens.join(" ");
 
       } else {
 
          /*
          FALLBACK
          */
 
          firstName =
             tokens.shift() || "";
 
          middleName =
             tokens.join(" ");
 
       }
 
    }
 
    /*
    -----------------------------------
    RETURN
    -----------------------------------
    */
 
    return {
 
       fullName: cleaned,
 
       firstName,
 
       middleName,
 
       lastName,
 
       suffix
 
    };
 
 };