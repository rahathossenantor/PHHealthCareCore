const doctorSearchParams = ["searchTerm", "name", "email", "contactNumber", "address", "registrationNumber", "experience", "appointmentFee", "qualification", "currentWorkingPlace", "designation"] as const;
export type TDoctorSearchParams = Partial<Record<typeof doctorSearchParams[number], string>>;
