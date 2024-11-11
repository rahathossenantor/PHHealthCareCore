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
            console.log("Super Admin already exists!");
            return;
        };

        await prisma.user.create({
            data: {
                email: "superadmin@email.com",
                password: await hashPassword("superadmin"),
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
