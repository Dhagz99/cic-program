import prisma from "../../src/lib/prisma";

export default async function seedRoles() {

   const permissions = [

      {
         code: "USER_MANAGE",
         name: "Manage Users"
      },

      {
         code: "ADMIN_MANAGE",
         name: "Manage Admin"
      },
       // USERS
       {
         code: "USER_VIEW",
         name: "View Users"
      },
      {
         code: "USER_CREATE",
         name: "Create Users"
      },
      {
         code: "USER_UPDATE",
         name: "Update Users"
      },
      {
         code: "USER_DELETE",
         name: "Delete Users"
      },

      // BRANCHES
      {
         code: "BRANCH_VIEW",
         name: "View Branches"
      },
      {
         code: "BRANCH_CREATE",
         name: "Create Branches"
      },
      {
         code: "BRANCH_UPDATE",
         name: "Update Branches"
      },
      {
         code: "BRANCH_DELETE",
         name: "Delete Branches"
      },

      // CLIENTS
      {
         code: "CLIENT_VIEW",
         name: "View Clients"
      },
      {
         code: "CLIENT_CREATE",
         name: "Create Clients"
      },
      {
         code: "CLIENT_UPDATE",
         name: "Update Clients"
      },
      {
         code: "CLIENT_DELETE",
         name: "Delete Clients"
      },

      // CONTRACTS
      {
         code: "CONTRACT_VIEW",
         name: "View Contracts"
      },
      {
         code: "CONTRACT_CREATE",
         name: "Create Contracts"
      },
      {
         code: "CONTRACT_UPDATE",
         name: "Update Contracts"
      },
      {
         code: "CONTRACT_DELETE",
         name: "Delete Contracts"
      },

      // STAGING
      {
         code: "STAGING_VIEW",
         name: "View Staging"
      },
      {
         code: "STAGING_UPLOAD",
         name: "Upload Staging"
      },
      {
         code: "STAGING_VALIDATE",
         name: "Validate Staging"
      },

      // CIC
      {
         code: "CIC_GENERATE",
         name: "Generate CIC"
      },
      {
         code: "CIC_EXPORT",
         name: "Export CIC"
      },
      {
         code: "APPROVE_CIC",
         name: "Approve CIC"
      },
      {
         code: "REJECT_CIC",
         name: "Reject CIC"
      },

      // REPORTS
      {
         code: "REPORT_VIEW",
         name: "View Reports"
      },
      {
         code: "REPORT_EXPORT",
         name: "Export Reports"
      }
   ];

   for (const p of permissions) {

      await prisma.permission.upsert({

         where: {
            code: p.code
         },

         update: {},

         create: p

      });

   }

   const roles = [

      {
         name: "ADMIN",
         permissions:
            permissions.map(
               (p) => p.code
            )
      },

      {
         name: "BRANCH_MANAGER",
         permissions: [
            "CLIENT_VIEW",
            "CLIENT_CREATE",
            "CLIENT_UPDATE",
      
            "CONTRACT_VIEW",
            "CONTRACT_CREATE",
            "CONTRACT_UPDATE",
      
            "STAGING_VIEW",
            "STAGING_UPLOAD",
            "STAGING_VALIDATE",
      
            "CIC_GENERATE",
            "CIC_EXPORT",
      
            "REPORT_VIEW",
            "REPORT_EXPORT"
         ]
      },

      {
         name: "GRCD_MANAGER",
         permissions: [ 
            "APPROVE_CIC",
            "REJECT_CIC",
            "REPORT_VIEW",
            "REPORT_EXPORT",
            "CIC_GENERATE",
            "CIC_EXPORT",
         ]
      }

   ];

   for (const role of roles) {

      const createdRole =
         await prisma.role.upsert({

            where: {
               name: role.name
            },

            update: {},

            create: {
               name: role.name
            }

         });

      for (const code of role.permissions) {

         const permission =
            await prisma.permission.findUnique({

               where: {
                  code
               }

            });

         if (permission) {

            await prisma.rolePermission.upsert({

               where: {

                  roleId_permissionId: {

                     roleId:
                        createdRole.id,

                     permissionId:
                        permission.id

                  }

               },

               update: {},

               create: {

                  roleId:
                     createdRole.id,

                  permissionId:
                     permission.id

               }

            });

         }

      }

   }

   console.log(
      "Roles & permissions seeded"
   );

}