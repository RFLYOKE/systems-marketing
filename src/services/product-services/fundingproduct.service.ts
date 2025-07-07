import { apiSlice } from "../base-query";
import { FundingProduct } from "@/types/sales-manage";

export const fundingProductApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all funding products
    getFundingProducts: builder.query<
      {
        data: FundingProduct[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/product/funding?paginate=${paginate}&page=${page}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          data: FundingProduct[];
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

    // ✅ Get product by ID
    getFundingProductById: builder.query<FundingProduct, number>({
      query: (id) => ({
        url: `/product/funding/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: FundingProduct;
      }) => response.data,
    }),

    // ✅ Create new product
    createFundingProduct: builder.mutation<
      FundingProduct,
      Partial<FundingProduct>
    >({
      query: (payload) => ({
        url: "/product/funding",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: FundingProduct;
      }) => response.data,
    }),

    // ✅ Update existing product
    updateFundingProduct: builder.mutation<
      FundingProduct,
      { id: number; payload: Partial<FundingProduct> }
    >({
      query: ({ id, payload }) => ({
        url: `/product/funding/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: FundingProduct;
      }) => response.data,
    }),

    // ✅ Delete product
    deleteFundingProduct: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/product/funding/${id}`,
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
  useGetFundingProductsQuery,
  useGetFundingProductByIdQuery,
  useCreateFundingProductMutation,
  useUpdateFundingProductMutation,
  useDeleteFundingProductMutation,
} = fundingProductApi;
