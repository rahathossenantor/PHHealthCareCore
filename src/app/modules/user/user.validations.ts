import { z } from "zod";

const doctorCreateSchema = z.object({
    body: z.object({
        password: z.string().optional(),
        doctor: z.object({
            name: z.string(),
            email: z.string().email(),
            contactNumber: z.string(),
            address: z.string().optional(),
            registrationNumber: z.string(),
            experience: z.number().optional(),
            appointmentFee: z.number(),
            qualification: z.string(),
            currentWorkingPlace: z.string(),
            designation: z.string(),
        })
    })
});

const patientCreateSchema = z.object({
    body: z.object({
        password: z.string().optional(),
        patient: z.object({
            name: z.string(),
            email: z.string().email(),
            contactNumber: z.string(),
            address: z.string().optional()
        })
    })
});

const userStatusUpdateSchema = z.object({
    body: z.object({
        status: z.enum(["ACTIVE", "BLOCKED", "DELETED"])
    })
});

export const userValidations = {
    doctorCreateSchema,
    patientCreateSchema,
    userStatusUpdateSchema
};
