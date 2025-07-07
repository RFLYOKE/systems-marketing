// src/services/product.service.ts
import { apiSlice } from "./base-query";
import { Product } from "@/types/product";

interface GetProductsParams {
  page: number;
  paginate: number;
  search?: string;
}

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET all products
    getProducts: builder.query<
      {
        data: Product[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      GetProductsParams
    >({
      query: ({ page, paginate, search = "" }) => ({
        url: "/products",
        method: "GET",
        params: { page, paginate, search },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Product[];
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
    getProductById: builder.query<Product, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Product;
      }) => response.data,
    }),

    // ✅ CREATE
    createProduct: builder.mutation<Product, FormData>({
      query: (formData) => ({
        url: "/products",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Product;
      }) => response.data,
    }),

    // ✅ UPDATE (PUT via POST)
    updateProduct: builder.mutation<Product, { id: number; payload: FormData }>(
      {
        query: ({ id, payload }) => ({
          url: `/products/${id}?_method=PUT`,
          method: "POST",
          body: payload,
        }),
        transformResponse: (response: {
          code: number;
          message: string;
          data: Product;
        }) => response.data,
      }
    ),

    // ✅ DELETE
    deleteProduct: builder.mutation<{ code: number; message: string }, number>({
      query: (id) => ({
        url: `/products/${id}`,
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
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
