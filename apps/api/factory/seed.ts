import seedDomains from "./seeds/domain.seed";
import { generalDomain } from "./seeds/general.domain.seed";
import { seedPSGC } from "./seeds/psgc.seed";
import seedRoles from "./seeds/role.seed";

async function main() {

   // await seedDomains();

   // await seedRoles();

   await generalDomain();
   // await seedPSGC();


   console.log(
      "All seeds completed"
   );

}

main()
   .catch((error) => {

      console.error(error);

      process.exit(1);

   });