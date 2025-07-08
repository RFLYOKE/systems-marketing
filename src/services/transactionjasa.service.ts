// services/transactionservice.service.ts
import { apiSlice } from "./base-query";
import { ServiceTransaction } from "@/types/jasa-transaction";

export const serviceTransactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all service transactions with pagination + optional search
    getServiceTransactions: builder.query<
      {
        data: ServiceTransaction[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; search?: string }
    >({
      query: ({ page, paginate, search = "" }) => ({
        url: `/transactions/projects`,
        method: "GET",
        params: { page, paginate, search },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: ServiceTransaction[];
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

    // ✅ Get service transaction by ID
    getServiceTransactionById: builder.query<ServiceTransaction, number>({
      query: (id) => ({
        url: `/transactions/projects/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: ServiceTransaction;
      }) => response.data,
    }),

    // ✅ Create service transaction
    createServiceTransaction: builder.mutation<
      ServiceTransaction,
      Partial<ServiceTransaction>
    >({
      query: (payload) => ({
        url: `/transactions/projects`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: ServiceTransaction;
      }) => response.data,
    }),

    // ✅ Update service transaction
    updateServiceTransaction: builder.mutation<
      ServiceTransaction,
      { id: number; payload: Partial<ServiceTransaction> }
    >({
      query: ({ id, payload }) => ({
        url: `/transactions/projects/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: ServiceTransaction;
      }) => response.data,
    }),

    // ✅ Delete service transaction
    deleteServiceTransaction: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/transactions/projects/${id}`,
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
  useGetServiceTransactionsQuery,
  useGetServiceTransactionByIdQuery,
  useCreateServiceTransactionMutation,
  useUpdateServiceTransactionMutation,
  useDeleteServiceTransactionMutation,
} = serviceTransactionApi;