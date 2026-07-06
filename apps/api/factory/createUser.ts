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
      roleIds: ["a81e6815-5c49-4523-a9a7-aa1eb83cf48a"],
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



  