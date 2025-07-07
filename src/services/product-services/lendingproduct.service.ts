import { apiSlice } from "../base-query";
import { LendingProduct } from "@/types/sales-manage";

export const lendingProductApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all lending products
    getLendingProducts: builder.query<
      {
        data: LendingProduct[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/product/lending?paginate=${paginate}&page=${page}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          data: LendingProduct[];
          current_page: number;
          last_page: number;
          total: number;
          per_page: number;
        };
      }) => ({
        data: response.data.data,
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // ✅ Get lending product by ID
    getLendingProductById: builder.query<LendingProduct, number>({
      query: (id) => ({
        url: `/product/lending/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: LendingProduct;
      }) => response.data,
    }),

    // ✅ Create new lending product
    createLendingProduct: builder.mutation<
      LendingProduct,
      Partial<LendingProduct>
    >({
      query: (payload) => ({
        url: "/product/lending",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: LendingProduct;
      }) => response.data,
    }),

    // ✅ Update existing lending product
    updateLendingProduct: builder.mutation<
      LendingProduct,
      { id: number; payload: Partial<LendingProduct> }
    >({
      query: ({ id, payload }) => ({
        url: `/product/lending/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: LendingProduct;
      }) => response.data,
    }),

    // ✅ Delete lending product
    deleteLendingProduct: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/product/lending/${id}`,
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
  useGetLendingProductsQuery,
  useGetLendingProductByIdQuery,
  useCreateLendingProductMutation,
  useUpdateLendingProductMutation,
  useDeleteLendingProductMutation,
} = lendingProductApi;
