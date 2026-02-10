import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getCategories, getSubCategories } from "../query/queryFn";
import {
  GetCategoriesResponse,
  GetSubCategoriesResponse,
} from "@/src/types/index.type";

export const useCategories = (): UseQueryResult<
  GetCategoriesResponse,
  Error
> => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

export const useSubCategories = (
  categoryId: string | null,
): UseQueryResult<GetSubCategoriesResponse, Error> => {
  return useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: () => getSubCategories(categoryId!),
    enabled: !!categoryId, // Only run query if categoryId exists
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
