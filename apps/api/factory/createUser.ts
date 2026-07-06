import "dotenv/config";
import  prisma  from "../src/lib/prisma.js";
import bcrypt from "bcryptjs";
import { createUserService } from "../src/modules/login/login.services.js";

async function main() {
  const Password = "12345678";

  const user = await createUserService({
      email: "admindhagz@example.com",
      name: "ADMIN DHAZG",
      username: "ADMIN-DHAGZ",
      password: Password,
      roleIds: ["39aeb242-4e4e-41c0-956f-58210aeb1c41"],
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



  