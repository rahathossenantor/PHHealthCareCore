const patientSearchParams = ["searchTerm", "name", "email", "contactNumber", "address"] as const;
export type TPatientSearchParams = Partial<Record<typeof patientSearchParams[number], string>>;
