export type SchoolMetadata = {
    nom_etablissement: string;
    type_etablissement: string;
    mail: string;
    web: string;
    position: {
        lon: number,
        lat: number;
    };
};

export type SchoolsApiResult = {
    total_count: number;
    results: SchoolMetadata[];
};

export type SchoolType = "Lycée" | "Collège" | "Ecole" | "ALL";

export type SchoolApiFilters = {
    polygon: number[][][];
    type: SchoolType;
};