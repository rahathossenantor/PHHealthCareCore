const pick = <T extends Record<string, unknown>, K extends keyof T>(query: T, fields: K[]): Partial<T> => {
    const picked: Partial<T> = {};
    for (const field of fields) {
        if (query && Object.hasOwnProperty.call(query, field)) {
            picked[field] = query[field];
        };
    };
    console.log(picked);
    return picked;
};

export default pick;
