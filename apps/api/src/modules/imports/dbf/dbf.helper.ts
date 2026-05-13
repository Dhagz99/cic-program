export function parseFullName(name: string) {
    if (!name) {
      return {
        firstName: "",
        lastName: "",
        middleName: "",
      };
    }
  
    const cleaned = name
      .trim()
      .replace(/\s+/g, " ");
  
    if (cleaned.includes(",")) {
      const commaIndex = cleaned.indexOf(",");
  
      const lastName = cleaned
        .slice(0, commaIndex)
        .trim();
  
      const remaining = cleaned
        .slice(commaIndex + 1)
        .trim();
  
      const parts = remaining.split(" ");
  
      /**
       * ONLY 1 WORD
       */
      if (parts.length === 1) {
        return {
          firstName: parts[0],
          lastName,
          middleName: "",
        };
      }
  
      /**
       * 2 WORDS
       * Example:
       * MARIA DELIA
       */
      if (parts.length === 2) {
        return {
          firstName: parts[0],
          lastName,
          middleName: parts[1],
        };
      }
  
      /**
       * 3+ WORDS
       * Example:
       * JOSE EDGARDO E.
       */
  
      return {
        firstName: parts
          .slice(0, -1)
          .join(" "),
        lastName,
        middleName:
          parts[parts.length - 1],
      };
    }
  
    return {
      firstName: "",
      lastName: cleaned,
      middleName: "",
    };
  }