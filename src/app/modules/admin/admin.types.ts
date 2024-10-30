const adminSearchParams = ["searchTerm", "name", "email", "contactNumber"] as const;
export type TAdminSearchParams = Partial<Record<typeof adminSearchParams[number], string>>;
