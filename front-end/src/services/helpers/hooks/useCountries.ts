/**
 * Countries Hook
 * Hook for fetching countries data
 */

import { useQuery } from "@tanstack/react-query";
import { getCountries, getCountriesForSelect } from "@/lib/api/helpers/helperManagement";
import { helperKeys } from "../keys/helperKeys";
import type { CountryOption } from "../types/helperTypes";

/**
 * Hook to fetch all countries
 */
export const useCountries = () => {
    return useQuery({
        queryKey: helperKeys.countries(),
        queryFn: getCountries,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to fetch countries for select options
 */
export const useCountriesForSelect = () => {
    return useQuery({
        queryKey: helperKeys.countriesForSelect(),
        queryFn: async (): Promise<CountryOption[]> => {
            const response = await getCountriesForSelect();

            // Transform the data to use localized labels
            const transformedData = response.data.map((country: CountryOption): CountryOption => ({
                value: country.value, // Keep as number since Select supports both
                label: country.label,
                code: country.code,
                phone_code: country.phone_code,
            }));

            return transformedData;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};