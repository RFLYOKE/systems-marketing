import { apiSlice } from "./base-query";
import { Marketing } from "@/types/marketing";

interface GetMarketingsParams {
  page: number;
  paginate: number;
  search?: string;
}

export const marketingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET all marketings
    getMarketings: builder.query<
      {
        data: Marketing[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      GetMarketingsParams
    >({
      query: ({ page, paginate, search = "" }) => ({
        url: "/marketings",
        method: "GET",
        params: { page, paginate, search },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Marketing[];
          last_page: number;
          total: number;
          per_page: number;
        };
      }) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // ✅ GET by ID
    getMarketingById: builder.query<Marketing, number>({
      query: (id) => ({
        url: `/marketings/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Marketing;
      }) => response.data,
    }),

    // ✅ CREATE
    createMarketing: builder.mutation<Marketing, FormData>({
      query: (formData) => ({
        url: "/marketings",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Marketing;
      }) => response.data,
    }),

    // ✅ UPDATE (PUT via POST)
    updateMarketing: builder.mutation<
      Marketing,
      { id: number; payload: FormData }
    >({
      query: ({ id, payload }) => ({
        url: `/marketings/${id}?_method=PUT`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Marketing;
      }) => response.data,
    }),

    // ✅ DELETE
    deleteMarketing: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/marketings/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: null;
      }) => response,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMarketingsQuery,
  useGetMarketingByIdQuery,
  useCreateMarketingMutation,
  useUpdateMarketingMutation,
  useDeleteMarketingMutation,
} = marketingApi;
