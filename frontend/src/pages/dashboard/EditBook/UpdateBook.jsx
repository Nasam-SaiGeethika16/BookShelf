import React, { useEffect, useState } from 'react'
import InputField from '../addBook/InputField'
import SelectField from '../addBook/SelectField'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useFetchBookByIdQuery, useUpdateBookMutation } from '../../../redux/features/books/booksApi';
import Loading from '../../../components/Loading';
import Swal from 'sweetalert2';
import axios from 'axios';
import getBaseUrl from '../../../utils/baseURL';
import { getImgUrl } from '../../../utils/getImgUrl';

const UpdateBook = () => {
  const { id } = useParams();
  const { data: bookData, isLoading, isError, refetch } = useFetchBookByIdQuery(id);
  const [updateBook] = useUpdateBookMutation();
  const { register, handleSubmit, setValue, reset } = useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFileName, setImageFileName] = useState('');

  useEffect(() => {
    if (bookData) {
      setValue('title', bookData.title);
      setValue('description', bookData.description);
      setValue('category', bookData?.category);
      setValue('trending', bookData.trending);
      setValue('oldPrice', bookData.oldPrice);
      setValue('newPrice', bookData.newPrice);
      setValue('coverImage', bookData.coverImage);
      setImagePreview(getImgUrl(bookData.coverImage));
    }
  }, [bookData, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('trending', data.trending);
    formData.append('oldPrice', data.oldPrice);
    formData.append('newPrice', data.newPrice);
    
    if (imageFile) {
      formData.append('coverImage', imageFile);
    } else if (data.coverImage) {
      formData.append('coverImage', data.coverImage);
    }

    try {
      await axios.put(`${getBaseUrl()}/api/books/edit/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      Swal.fire({
        title: "Book Updated",
        text: "Your book is updated successfully!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, It's Okay!"
      });
      await refetch();
    } catch (error) {
      console.log("Failed to update book.");
      alert("Failed to update book.");
    }
  };

  if (isLoading) return <Loading />
  if (isError) return <div>Error fetching book data</div>

  return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Book</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Title"
          name="title"
          placeholder="Enter book title"
          type="text"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          register={register}
        />

        <InputField
          label="Description"
          name="description"
          placeholder="Enter book description"
          type="textarea"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          rows="4"
          register={register}
        />

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
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          register={register}
        />

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

        <InputField
          label="Old Price"
          name="oldPrice"
          type="number"
          placeholder="Old Price"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          register={register}
        />

        <InputField
          label="New Price"
          name="newPrice"
          type="number"
          placeholder="New Price"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          register={register}
        />

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Book cover preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <button type="submit" className="w-full py-2 bg-blue-500 text-white font-bold rounded-md">
          Update Book
        </button>
      </form>
    </div>
  )
}

export default UpdateBook