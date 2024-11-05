export const doctorSearchableFields: string[] = ["name", "email", "contactNumber", "address", "registrationNumber", "experience", "appointmentFee", "qualification", "currentWorkingPlace", "designation"];
export const doctorFilterableFields: string[] = ["searchTerm", "specialty", ...doctorSearchableFields];

export type TSpecialty = {
    id: string,
    isDeleted: boolean
};
