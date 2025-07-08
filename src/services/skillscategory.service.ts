import { apiSlice } from "./base-query";
import { Skill } from "@/types/skill";

export const skillApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all skills with pagination
    getSkills: builder.query<
      {
        data: Skill[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; search?: string }
    >({
      query: ({ page, paginate, search }) => ({
        url: `/master/skills?page=${page}&paginate=${paginate}${
          search ? `&search=${search}` : ""
        }`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Skill[];
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

    // ✅ Get skill by ID
    getSkillById: builder.query<Skill, number>({
      query: (id) => ({
        url: `/master/skills/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Skill;
      }) => response.data,
    }),

    // ✅ Create skill
    createSkill: builder.mutation<Skill, Partial<Skill>>({
      query: (payload) => ({
        url: `/master/skills`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Skill;
      }) => response.data,
    }),

    // ✅ Update skill
    updateSkill: builder.mutation<
      Skill,
      { id: number; payload: Partial<Skill> }
    >({
      query: ({ id, payload }) => ({
        url: `/master/skills/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Skill;
      }) => response.data,
    }),

    // ✅ Delete skill
    deleteSkill: builder.mutation<{ code: number; message: string }, number>({
      query: (id) => ({
        url: `/master/skills/${id}`,
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
  useGetSkillsQuery,
  useGetSkillByIdQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} = skillApi;
