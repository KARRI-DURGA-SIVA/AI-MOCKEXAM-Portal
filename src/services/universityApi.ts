export interface University {
    name: string;
    country: string;
    alpha_two_code: string;
    web_pages: string[];
}

/**
 * universities.hipolabs.com is a free, unmaintained, keyless API
 * that intermittently returns malformed JSON or hangs (see upstream
 * GitHub issue #31 on Hipo/university-domains-list-api). Rather than
 * depend on it live, we bundle the same underlying open dataset as a
 * static file (public/universities.min.json) and filter client-side.
 * This means zero network flakiness and works offline.
 *
 * Source: https://github.com/Hipo/university-domains-list
 */

let allUniversities: University[] | null = null;
let loadPromise: Promise<University[]> | null = null;

async function loadDataset(): Promise<University[]> {

    if (allUniversities) {
        return allUniversities;
    }

    if (loadPromise) {
        return loadPromise;
    }

    loadPromise = fetch("/universities.min.json")
        .then((response) => {

            if (!response.ok) {
                throw new Error(
                    `Failed to load university dataset: ${response.status}`
                );
            }

            return response.json();

        })
        .then((data: University[]) => {

            allUniversities = data;

            return data;

        })
        .catch((error) => {

            console.error(
                "Failed to load bundled university dataset:",
                error
            );

            loadPromise = null;

            return [];

        });

    return loadPromise;
}

export async function getUniversitiesByCountry(
    country: string
): Promise<University[]> {

    if (!country) {
        return [];
    }

    const dataset = await loadDataset();

    return dataset.filter(
        (university) => university.country === country
    );
}