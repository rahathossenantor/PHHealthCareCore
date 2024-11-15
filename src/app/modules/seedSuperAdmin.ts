import config from "../config";
import hashPassword from "../utils/hashPassword";
import prisma from "../utils/prisma";

const seedSuperAdmin = async () => {
    try {
        const superAdmin = await prisma.user.findFirst({
            where: {
                role: "SUPER_ADMIN"
            }
        });

        if (superAdmin) {
            console.log("Super admin already exists!");
            return;
        };

        await prisma.user.create({
            data: {
                email: "rahathossen.dev@gmail.com",
                password: await hashPassword(config.default_pass as string),
                role: "SUPER_ADMIN",
                admin: {
                    create: {
                        name: "Super Admin",
                        contactNumber: "1234567890"
                    }
                }
            }
        });

        console.log("Super admin created successfully!");
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect();
    };
};

(async () => {
    await seedSuperAdmin();
})();
