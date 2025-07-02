import { api } from '../../api';

const booksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchAllBooks: builder.query({
      query: () => '/books',
      providesTags: ['Books'],
    }),
    fetchBookById: builder.query({
      query: (id) => `/books/${id}`,
      providesTags: (result, error, id) => [{ type: 'Books', id }],
    }),
    addBook: builder.mutation({
      query: (newBook) => ({
        url: `/books/create-book`,
        method: 'POST',
        body: newBook,
      }),
      invalidatesTags: ['Books'],
    }),
    updateBook: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/books/edit/${id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: ['Books'],
    }),
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Books'],
    }),
    fetchTopSellingBooks: builder.query({
      query: () => '/books/top-sellers',
      providesTags: ['Books'],
    }),
    fetchRecommendedBooks: builder.query({
      query: () => '/books/recommended',
      providesTags: ['Books'],
    }),
    fetchLatestNews: builder.query({
      query: () => '/books/latest-news',
      providesTags: ['Books'],
    }),
    searchBooks: builder.query({
      query: (searchQuery) => `/books/search?query=${searchQuery}`,
    }),
    fetchBooksByGenre: builder.query({
      query: (genre) => `/books/genre/${genre}`,
      providesTags: (result, error, genre) => [{ type: 'Books', genre }],
    }),
  }),
});

export const {
  useFetchAllBooksQuery,
  useFetchBookByIdQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useFetchTopSellingBooksQuery,
  useFetchRecommendedBooksQuery,
  useFetchLatestNewsQuery,
  useLazySearchBooksQuery,
  useFetchBooksByGenreQuery,
} = booksApi;