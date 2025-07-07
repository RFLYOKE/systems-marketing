import { apiSlice } from "../base-query";
import { Prospect } from "@/types/prospect";

export const prospectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all prospects with pagination
    getProspects: builder.query<
      {
        data: Prospect[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/coordinator/prospects?paginate=${paginate}&page=${page}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Prospect[];
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

    // ✅ Get prospect by ID
    getProspectById: builder.query<Prospect, number>({
      query: (id) => ({
        url: `/coordinator/prospects/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Prospect;
      }) => response.data,
    }),

    // ✅ Create prospect
    createProspect: builder.mutation<Prospect, Partial<Prospect>>({
      query: (payload) => ({
        url: "/coordinator/prospects",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Prospect;
      }) => response.data,
    }),

    // ✅ Update prospect
    updateProspect: builder.mutation<
      Prospect,
      { id: number; payload: Partial<Prospect> }
    >({
      query: ({ id, payload }) => ({
        url: `/coordinator/prospects/${id}?_method=PUT`,
        method: "POST", 
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Prospect;
      }) => response.data,
    }),

    // ✅ Approve prospect
    approveProspect: builder.mutation<Prospect, number>({
      query: (id) => ({
        url: `/coordinator/prospects/${id}/approve`,
        method: "PUT",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Prospect;
      }) => response.data,
    }),

    // ✅ Reject prospect
    rejectProspect: builder.mutation<Prospect, number>({
      query: (id) => ({
        url: `/coordinator/prospects/${id}/reject`,
        method: "PUT",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Prospect;
      }) => response.data,
    }),

    // ✅ Delete prospect
    deleteProspect: builder.mutation<{ code: number; message: string }, number>(
      {
        query: (id) => ({
          url: `/coordinator/prospects/${id}`,
          method: "DELETE",
        }),
        transformResponse: (response: {
          code: number;
          message: string;
          data: null;
        }) => response,
      }
    ),
  }),
  overrideExisting: false,
});

export const {
  useGetProspectsQuery,
  useGetProspectByIdQuery,
  useCreateProspectMutation,
  useUpdateProspectMutation,
  useApproveProspectMutation,
  useRejectProspectMutation,
  useDeleteProspectMutation,
} = prospectApi;
