import { api } from '../../api';

const subscriptionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    subscribe: builder.mutation({
      query: (email) => ({
        url: '/subscribe',
        method: 'POST',
        body: { email },
      }),
    }),
  }),
});

export const { useSubscribeMutation } = subscriptionsApi;