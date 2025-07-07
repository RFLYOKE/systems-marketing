import { apiSlice } from "../base-query";
import { TaskSchedule } from "@/types/taskactivity";

export const taskScheduleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all task schedules with pagination
    getTaskSchedules: builder.query<
      {
        data: TaskSchedule[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/coordinator/task-schedules?paginate=${paginate}&page=${page}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: TaskSchedule[];
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

    // ✅ Get task schedule by ID
    getTaskScheduleById: builder.query<TaskSchedule, number>({
      query: (id) => ({
        url: `/coordinator/task-schedules/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: TaskSchedule;
      }) => response.data,
    }),

    // ✅ Create task schedule
    createTaskSchedule: builder.mutation<TaskSchedule, Partial<TaskSchedule>>({
      query: (payload) => ({
        url: "/coordinator/task-schedules",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: TaskSchedule;
      }) => response.data,
    }),

    // ✅ Update task schedule
    updateTaskSchedule: builder.mutation<
      TaskSchedule,
      { id: number; payload: Partial<TaskSchedule> }
    >({
      query: ({ id, payload }) => ({
        url: `/coordinator/task-schedules/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: TaskSchedule;
      }) => response.data,
    }),

    // ✅ Delete task schedule
    deleteTaskSchedule: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/coordinator/task-schedules/${id}`,
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
  useGetTaskSchedulesQuery,
  useGetTaskScheduleByIdQuery,
  useCreateTaskScheduleMutation,
  useUpdateTaskScheduleMutation,
  useDeleteTaskScheduleMutation,
} = taskScheduleApi;
