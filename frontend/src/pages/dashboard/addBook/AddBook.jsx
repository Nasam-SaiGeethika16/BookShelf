import React, { useState } from 'react'
import InputField from './InputField'
import SelectField from './SelectField'
import { useForm } from 'react-hook-form';
import { useAddBookMutation } from '../../../redux/features/books/booksApi';
import Swal from 'sweetalert2';

const AddBook = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [addBook, {isLoading, isError}] = useAddBookMutation()
    const onSubmit = async (data) => {
 
        const newBookData = {
            ...data,
        }
        try {
            await addBook(newBookData).unwrap();
            Swal.fire({
                title: "Book added",
                text: "Your book is uploaded successfully!",
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, It's Okay!"
              });
              reset();
        } catch (error) {
            console.error(error);
            alert("Failed to add book. Please try again.")
        }
      
    }
  return (
    <div className="flex justify-center w-full">
      <div className="max-w-lg w-full md:p-6 p-3 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">Add Book</h2>

        {/* Form starts here */}
        <form onSubmit={handleSubmit(onSubmit)} className=''>
          {/* Reusable Input Field for Title */}
          <InputField
            label="Title"
            name="title"
            placeholder="Enter book title"
            register={register}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />

          {/* Reusable Textarea for Description */}
          <InputField
            label="Description"
            name="description"
            placeholder="Enter book description"
            type="textarea"
            register={register}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />

          {/* Reusable Input Field for Author */}
          <InputField
            label="Author"
            name="author"
            placeholder="Enter author name"
            register={register}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />

          {/* Reusable Input Field for Published Year */}
          <InputField
            label="Published Year"
            name="publishedDate"
            type="number"
            placeholder="Enter published year"
            register={register}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />

          {/* Reusable Select Field for Category */}
          <SelectField
            label="Category"
            name="category"
            options={[
              { value: '', label: 'Choose A Category' },
              { value: 'bestsellers', label: 'Bestsellers' },
              { value: 'new_releases', label: 'New Releases' },
              { value: 'award_winning', label: 'Award-Winning Books' },
              { value: 'holiday_seasonal', label: 'Holiday & Seasonal Reads' },
              { value: 'cookbooks', label: 'Cookbooks & Culinary Arts' },
              { value: 'travel_adventure', label: 'Travel & Adventure' },
              { value: 'art_photography', label: 'Art & Photography' },
              { value: 'religion_spirituality', label: 'Religion & Spirituality' },
              { value: 'hobby_crafting', label: 'Hobby & Crafting Guides' },
              { value: 'picture_books', label: 'Picture Books' },
              { value: 'middle_grade', label: 'Middle Grade Fiction' },
              { value: 'ya_fantasy_scifi', label: 'Young Adult Fantasy & Sci-Fi' },
              { value: 'educational', label: 'Educational Books' },
              { value: 'comics_graphic', label: 'Comics & Graphic Novels' },
              { value: 'textbooks', label: 'Textbooks' },
              { value: 'research_journals', label: 'Research Journals' },
              { value: 'dictionaries_encyclopedias', label: 'Dictionaries & Encyclopedias' },
              { value: 'law_legal', label: 'Law & Legal Studies' },
              { value: 'medical_healthcare', label: 'Medical & Healthcare Books' },
              { value: 'biography_memoir', label: 'Biography & Memoir' },
              { value: 'self_help', label: 'Self-Help & Personal Development' },
              { value: 'business_finance', label: 'Business & Finance' },
              { value: 'science_technology', label: 'Science & Technology' },
              { value: 'health_wellness', label: 'Health & Wellness' },
              { value: 'literary_fiction', label: 'Literary Fiction' },
              { value: 'mystery_thriller', label: 'Mystery & Thriller' },
              { value: 'science_fiction_fantasy', label: 'Science Fiction & Fantasy' },
              { value: 'historical_fiction', label: 'Historical Fiction' },
              { value: 'romance', label: 'Romance' },
            ]}
            register={register}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />

          {/* Trending Checkbox */}
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register('trending')}
                className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-semibold text-gray-700">Trending</span>
            </label>
          </div>

          {/* Old Price */}
          <InputField
            label="Old Price"
            name="oldPrice"
            type="number"
            placeholder="Old Price"
            register={register}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />

          {/* New Price */}
          <InputField
            label="New Price"
            name="newPrice"
            type="number"
            placeholder="New Price"
            register={register}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />

          {/* Quantity */}
          <InputField
            label="Quantity"
            name="quantity"
            type="number"
            placeholder="Enter quantity"
            register={register}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />

          {/* Cover Image URL */}
          <InputField
            label="Cover Image URL"
            name="coverImage"
            placeholder="Enter cover image URL"
            register={register}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />

          {/* Submit Button */}
          <button type="submit" className="w-full py-2 bg-green-800 hover:bg-green-900 text-white font-bold rounded-md">
           {
              isLoading ? <span className="">Adding.. </span> : <span>Add Book</span>
            }
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddBook