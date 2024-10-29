import { Request } from "express";
import uploadImage from "../../utils/uploadImage";
import prisma from "../../utils/prisma";

const createSpecialityIntoDB = async (req: Request) => {
    const { body, file } = req;

    if (file) {
        const res = await uploadImage(file);
        body.icon = res?.secure_url;
    };

    const specialty = await prisma.specialty.create({
        data: body
    });

    return specialty;
};

const specialtyServices = {
    createSpecialityIntoDB
};

export default specialtyServices;
