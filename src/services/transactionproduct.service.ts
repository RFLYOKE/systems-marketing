import { apiSlice } from "./base-query";
import { ProductTransaction } from "@/types/product-transaction";

export const productTransactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all product transactions with pagination + search
    getProductTransactions: builder.query<
      {
        data: ProductTransaction[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; search?: string }
    >({
      query: ({ page, paginate, search = "" }) => ({
        url: `/transactions/products`,
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
          data: ProductTransaction[];
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

    // ✅ Get product transaction by ID
    getProductTransactionById: builder.query<ProductTransaction, number>({
      query: (id) => ({
        url: `/transactions/products/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: ProductTransaction;
      }) => response.data,
    }),

    // ✅ Create product transaction
    createProductTransaction: builder.mutation<
      ProductTransaction,
      Partial<ProductTransaction>
    >({
      query: (payload) => ({
        url: `/transactions/products`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: ProductTransaction;
      }) => response.data,
    }),

    // ✅ Update product transaction
    updateProductTransaction: builder.mutation<
      ProductTransaction,
      { id: number; payload: Partial<ProductTransaction> }
    >({
      query: ({ id, payload }) => ({
        url: `/transactions/products/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: ProductTransaction;
      }) => response.data,
    }),

    // ✅ Delete product transaction
    deleteProductTransaction: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/transactions/products/${id}`,
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
  useGetProductTransactionsQuery,
  useGetProductTransactionByIdQuery,
  useCreateProductTransactionMutation,
  useUpdateProductTransactionMutation,
  useDeleteProductTransactionMutation,
} = productTransactionApi;
