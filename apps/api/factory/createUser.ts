import "dotenv/config";
import  prisma  from "../src/lib/prisma.js";
import bcrypt from "bcryptjs";
import { createUserService } from "../src/modules/login/login.services.js";

async function main() {
  const Password = "12345678";

  const user = await createUserService({
      email: "Kimadmin@example.com",
      name: "KIM ADMIN",
      username: "ADMIN_KIM",
      password: Password,
      roleIds: ["15265dfb-f29f-4bc1-8984-1e3b1f4506d0"],
  });

}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



  