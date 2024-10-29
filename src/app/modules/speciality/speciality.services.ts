import { Request } from "express";
import uploadImage from "../../utils/uploadImage";
import prisma from "../../utils/prisma";

const createSpecialityIntoDB = async (req: Request) => {
    const { body, file } = req;

    if (file) {
        const res = await uploadImage(file);
        body.icon = res?.secure_url;
    };

    const speciality = await prisma.speciality.create({
        data: body
    });

    return speciality;
};

const specialityServices = {
    createSpecialityIntoDB
};

export default specialityServices;
