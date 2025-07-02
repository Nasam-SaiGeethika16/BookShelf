import React from 'react'
import { useDeleteBookMutation, useFetchAllBooksQuery } from '../../../redux/features/books/booksApi';
import { Link, useNavigate } from 'react-router-dom';

const ManageBooks = () => {
    const navigate = useNavigate();

    const {data: books, refetch} = useFetchAllBooksQuery()

    const [deleteBook] = useDeleteBookMutation()

    // Handle deleting a book
    const handleDeleteBook = async (id) => {
        try {
            await deleteBook(id).unwrap();
            alert('Book deleted successfully!');
            refetch();

        } catch (error) {
            console.error('Failed to delete book:', error.message);
            alert('Failed to delete book. Please try again.');
        }
    };

    // Handle navigating to Edit Book page
    const handleEditClick = (id) => {
        navigate(`dashboard/edit-book/${id}`);
    };

    // Utility function for capitalization
    function capitalizeWords(str) {
        if (!str) return '';
        return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }

  return (
    <section className="py-1 bg-gray-50 dark:bg-gray-900 ml-64">
    <div className="w-full mb-12 xl:mb-0 mt-24">
        <div className="relative flex flex-col min-w-0 break-words bg-white dark:bg-gray-800 w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="w-full">
                        <h3 className="font-semibold text-2xl text-green-800 dark:text-green-400">Manage Books</h3>
                    </div>
                </div>
            </div>

            <div className="block w-full overflow-x-auto">
                <table className="items-center bg-transparent w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="px-6 bg-gray-50 dark:bg-gray-700 text-green-800 dark:text-green-400 align-middle border border-solid border-gray-200 dark:border-gray-600 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                #
                            </th>
                            <th className="px-6 bg-gray-50 dark:bg-gray-700 text-green-800 dark:text-green-400 align-middle border border-solid border-gray-200 dark:border-gray-600 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Book Title
                            </th>
                            <th className="px-6 bg-gray-50 dark:bg-gray-700 text-green-800 dark:text-green-400 align-middle border border-solid border-gray-200 dark:border-gray-600 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Category
                            </th>
                            <th className="px-6 bg-gray-50 dark:bg-gray-700 text-green-800 dark:text-green-400 align-middle border border-solid border-gray-200 dark:border-gray-600 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Price
                            </th>
                            <th className="px-6 bg-gray-50 dark:bg-gray-700 text-green-800 dark:text-green-400 align-middle border border-solid border-gray-200 dark:border-gray-600 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Author
                            </th>
                            <th className="px-6 bg-gray-50 dark:bg-gray-700 text-green-800 dark:text-green-400 align-middle border border-solid border-gray-200 dark:border-gray-600 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Published Year
                            </th>
                            <th className="px-6 bg-gray-50 dark:bg-gray-700 text-green-800 dark:text-green-400 align-middle border border-solid border-gray-200 dark:border-gray-600 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="dark:text-gray-200">
                        {
                            books && books.map((book, index) => (
                                <tr key={index} className="dark:border-gray-600">
                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-green-800 dark:text-green-400">
                                   {index + 1}
                                </th>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 dark:text-gray-200">
                                    {capitalizeWords(book.title)}
                                </td>
                                <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 dark:text-gray-200">
                                  {capitalizeWords(book.category)}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 dark:text-gray-200">
                                    ₹{book.newPrice}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 dark:text-gray-200">
                                    {capitalizeWords(book.author)}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 dark:text-gray-200">
                                    {book.publishedDate ? new Date(book.publishedDate).getFullYear() : 'N/A'}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 space-x-4">
                                    <Link to={`/dashboard/edit-book/${book._id}`} className="font-medium text-green-800 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-2 hover:underline underline-offset-2">
                                        Edit
                                    </Link>
                                    <button 
                                    onClick={() => handleDeleteBook(book._id)}
                                    className="font-medium bg-red-500 hover:bg-red-600 py-1 px-4 rounded-full text-white mr-2">Delete</button>
                                </td>
                            </tr> 
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>
  )
}

export default ManageBooks