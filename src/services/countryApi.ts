export interface Country {
    name: {
        common: string;
    };
    cca2: string;
}

/**
 * Used only if restcountries.com fails or times out, so the
 * dropdown never ends up empty. Covers the most commonly
 * selected countries.
 */
const fallbackCountries: Country[] = [
    { name: { common: "India" }, cca2: "IN" },
    { name: { common: "United States" }, cca2: "US" },
    { name: { common: "United Kingdom" }, cca2: "GB" },
    { name: { common: "Canada" }, cca2: "CA" },
    { name: { common: "Australia" }, cca2: "AU" },
    { name: { common: "Germany" }, cca2: "DE" },
    { name: { common: "France" }, cca2: "FR" },
    { name: { common: "Japan" }, cca2: "JP" },
    { name: { common: "South Korea" }, cca2: "KR" },
    { name: { common: "China" }, cca2: "CN" },
    { name: { common: "Singapore" }, cca2: "SG" },
    { name: { common: "United Arab Emirates" }, cca2: "AE" },
    { name: { common: "Brazil" }, cca2: "BR" },
    { name: { common: "South Africa" }, cca2: "ZA" },
    { name: { common: "New Zealand" }, cca2: "NZ" },
    { name: { common: "Netherlands" }, cca2: "NL" },
    { name: { common: "Ireland" }, cca2: "IE" },
    { name: { common: "Italy" }, cca2: "IT" },
    { name: { common: "Spain" }, cca2: "ES" },
    { name: { common: "Russia" }, cca2: "RU" },
].sort((a, b) => a.name.common.localeCompare(b.name.common));

let cachedCountries: Country[] | null = null;

const FETCH_TIMEOUT_MS = 8000;

export async function getCountries(): Promise<Country[]> {

    if (cachedCountries) {
        return cachedCountries;
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(
        () => controller.abort(),
        FETCH_TIMEOUT_MS
    );

    try {

        const response = await fetch(
            "https://restcountries.com/v3.1/all?fields=name,cca2",
            { signal: controller.signal }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to fetch countries: ${response.status}`
            );
        }

        const countries: Country[] = await response.json();

        const sorted = countries.sort((a, b) =>
            a.name.common.localeCompare(b.name.common)
        );

        cachedCountries = sorted;

        return sorted;

    } catch (error) {

        if (error instanceof DOMException && error.name === "AbortError") {
            console.error(
                `Country fetch timed out after ${FETCH_TIMEOUT_MS}ms — using fallback list`
            );
        } else {
            console.error(
                "Failed to fetch countries — using fallback list:",
                error
            );
        }

        // Don't cache the fallback as if it were the full API
        // result, so a later successful call can still replace it.
        return fallbackCountries;

    } finally {

        clearTimeout(timeoutId);

    }
}