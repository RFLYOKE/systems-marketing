import { apiSlice } from "./base-query";
import { Programmer } from "@/types/programmer";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface GetProgrammersParams {
  page: number;
  paginate: number;
  search?: string;
}

export const programmerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all programmers with optional search
    getProgrammers: builder.query<
      {
        data: Programmer[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      GetProgrammersParams
    >({
      query: ({ page, paginate, search = "" }) => ({
        url: `/programmers`,
        method: "GET",
        params: {
          page,
          paginate,
          search,
        },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Programmer[];
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

    getProgrammerById: builder.query<Programmer, number>({
      query: (id) => ({
        url: `/programmers/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Programmer;
      }) => response.data,
    }),

    createProgrammer: builder.mutation<Programmer, FormData>({
      query: (formData) => ({
        url: "/programmers",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Programmer;
      }) => response.data,
    }),

    updateProgrammer: builder.mutation<
      Programmer,
      { id: number; payload: FormData }
    >({
      query: ({ id, payload }) => ({
        url: `/programmers/${id}?_method=PUT`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Programmer;
      }) => response.data,
    }),

    deleteProgrammer: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/programmers/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: null;
      }) => response,
    }),

    importProgrammer: builder.mutation<{ message: string }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/programmers/import",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: { code: number; message: string }) =>
        response,
    }),

    exportProgrammer: builder.mutation<boolean, Partial<Programmer>>({
      async queryFn(payload, _queryApi, _extraOptions, baseQuery) {
        const response = await baseQuery({
          url: "/programmers/export",
          method: "POST",
          body: payload,
          responseHandler: (r) => r.blob(),
        });

        if (response.error) return { error: response.error };

        const blob = response.data as Blob;
        const contentType = blob.type;

        if (
          !contentType.includes("sheet") &&
          contentType !==
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          const text = await blob.text();

          const error: FetchBaseQueryError = {
            status: 500,
            data: {
              message: "INVALID_FILE",
              detail: text,
            },
          };

          return { error };
        }

        return { data: true };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProgrammersQuery,
  useGetProgrammerByIdQuery,
  useCreateProgrammerMutation,
  useUpdateProgrammerMutation,
  useDeleteProgrammerMutation,
  useImportProgrammerMutation,
  useExportProgrammerMutation,
} = programmerApi;
