// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import BookCard from "./BookCard";
// import "./DisplayBook.css";
// import DetailsPage from "./DetailsPage";
// import FilterSideBar from "./FilterSideBar";
// import SearchBar from "./SearchBar";
// import Pagination from "../Admin/Pagination"; // Ensure you have a Pagination component

// // Configure axios defaults
// axios.defaults.baseURL = 'http://localhost:3000';
// axios.defaults.withCredentials = true;

// const DisplayBook = () => {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedBookId, setSelectedBookId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [filters, setFilters] = useState({
//     search: '',
//     category: 'all',
//     rating: '',
//     availability: 'all',
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const booksPerPage = 8;

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get("/api/books");
//         setBooks(data);
//         setError('');
//       } catch (error) {
//         console.error("Error fetching books:", error);
//         setError(error.response?.data?.message || 'Error loading books. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBooks();
//   }, []);

//   const handleViewDetailsClick = (bookId) => {
//     setSelectedBookId(bookId);
//   };

//   const handleSearch = (term) => {
//     setSearchTerm(term);
//     setCurrentPage(1); // Reset to the first page when searching
//   };

//   const handleFilterChange = (filterType, value) => {
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [filterType]: value,
//     }));
//     setCurrentPage(1); // Reset to the first page when filters change
//   };

//   const handleClearFilters = () => {
//     setFilters({
//       category: 'all',
//       rating: 0,
//       availability: 'all',
//     });
//     setCurrentPage(1); // Reset to the first page when filters are cleared
//   };

//   const handleFilterToggle = () => {
//     setShowSidebar((prev) => !prev);
//   };

//   const filteredBooks = books.filter((book) => {
//     const matchesSearch =
//       book.Book_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       book.Author.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       book.categories?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesCategory = filters.category !== 'all' ? book.categories?.toLowerCase() === filters.category.toLowerCase() : true;
//     const matchesRating = filters.rating ? Math.round(book.rating || 4) >= filters.rating : true;
//     const matchesAvailability = filters.availability === 'all' ? true : (filters.availability === 'available' ? book.Available_count > 0 : book.Available_count === 0);

//     return matchesSearch && matchesCategory && matchesRating && matchesAvailability;
//   });

//   const indexOfLastBook = currentPage * booksPerPage;
//   const indexOfFirstBook = indexOfLastBook - booksPerPage;
//   const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="error">{error}</div>;

//   if (selectedBookId) {
//     return <DetailsPage bookId={selectedBookId} setSelectedBookId={setSelectedBookId} />;
//   }

//   return (
//     <div>
//       <SearchBar
//         searchTerm={searchTerm}
//         onSearch={handleSearch}
//         onFilterToggle={() => setShowSidebar((prev) => !prev)}
//         books={books.map((book) => ({
//           id: book._id,
//           title: book.Book_Name,
//           author: book.Author,
//           categories: book.categories || '',
//         }))}
//       />

//       <div className="filter-container">
//         <FilterSideBar
//           show={showSidebar}
//           onClose={() => setShowSidebar(false)}
//           filters={filters}
//           onFilterChange={handleFilterChange}
//           onClearFilters={handleClearFilters}
//         />
//       </div>

//       {filteredBooks.length === 0 ? (
//         <p>No books match your search or filters.</p>
//       ) : (
//         <div>
//           <div className="books-grid">
//             {currentBooks.map((book) => (
//               <BookCard
//                 key={book._id}
//                 book={{
//                   id: book._id,
//                   title: book.Book_Name,
//                   author: book.Author,
//                   image: `http://localhost:3000${book.Image}`,
//                   rating: book.rating || 4,
//                   reviewCount: book.reviewCount || 10,
//                   available: book.Available_count,
//                 }}
//                 onClick={handleViewDetailsClick}
//               />
//             ))}
//           </div>
//           <Pagination
//             currentPage={currentPage}
//             totalPages={Math.ceil(filteredBooks.length / booksPerPage)}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default DisplayBook;

//working
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import BookCard from "./BookCard";
// import "./DisplayBook.css";
// import DetailsPage from "./DetailsPage";
// import FilterSideBar from "./FilterSideBar";
// import SearchBar from "./SearchBar";
// import Pagination from "../Admin/Pagination"; // Ensure you have this

// // Configure axios
// axios.defaults.baseURL = 'http://localhost:3000';
// axios.defaults.withCredentials = true;

// const DisplayBook = () => {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedBookId, setSelectedBookId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [filters, setFilters] = useState({
//     search: '',
//     category: 'all',
//     rating: '',
//     availability: 'all',
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const booksPerPage = 8;

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(`/api/books?page=${currentPage}&limit=${booksPerPage}`);
//         setBooks(data.books);
//         setTotalPages(data.totalPages);
//         setError('');
//       } catch (error) {
//         console.error("Error fetching books:", error);
//         setError(error.response?.data?.message || 'Error loading books. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBooks();
//   }, [currentPage]);

//   const handleViewDetailsClick = (bookId) => {
//     setSelectedBookId(bookId);
//   };

//   const handleSearch = (term) => {
//     setSearchTerm(term);
//     setCurrentPage(1); // Reset to the first page when searching
//   };

//   const handleFilterChange = (filterType, value) => {
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [filterType]: value,
//     }));
//     setCurrentPage(1);
//   };

//   const handleClearFilters = () => {
//     setFilters({
//       category: 'all',
//       rating: 0,
//       availability: 'all',
//     });
//     setCurrentPage(1);
//   };

//   const handleFilterToggle = () => {
//     setShowSidebar((prev) => !prev);
//   };

//   // Local filter logic (optional unless you implement filtering on backend)
//   const filteredBooks = books.filter((book) => {
//     const matchesSearch =
//       book.Book_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       book.Author.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       book.categories?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesCategory = filters.category !== 'all' ? book.categories?.toLowerCase() === filters.category.toLowerCase() : true;
//     const matchesRating = filters.rating ? Math.round(book.rating || 4) >= filters.rating : true;
//     const matchesAvailability = filters.availability === 'all' ? true : (filters.availability === 'available' ? book.Available_count > 0 : book.Available_count === 0);

//     return matchesSearch && matchesCategory && matchesRating && matchesAvailability;
//   });

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="error">{error}</div>;
//   if (selectedBookId) {
//     return <DetailsPage bookId={selectedBookId} setSelectedBookId={setSelectedBookId} />;
//   }

//   return (
//     <div>
//       <SearchBar
//         searchTerm={searchTerm}
//         onSearch={handleSearch}
//         onFilterToggle={handleFilterToggle}
//         books={books.map((book) => ({
//           id: book._id,
//           title: book.Book_Name,
//           author: book.Author,
//           categories: book.categories || '',
//         }))}
//       />

//       <div className="filter-container">
//         <FilterSideBar
//           show={showSidebar}
//           onClose={() => setShowSidebar(false)}
//           filters={filters}
//           onFilterChange={handleFilterChange}
//           onClearFilters={handleClearFilters}
//         />
//       </div>

//       {filteredBooks.length === 0 ? (
//         <p>No books match your search or filters.</p>
//       ) : (
//         <div>
//           <div className="books-grid">
//             {filteredBooks.map((book) => (
//               <BookCard
//                 key={book._id}
//                 book={{
//                   id: book._id,
//                   title: book.Book_Name,
//                   author: book.Author,
//                   image: `http://localhost:3000${book.Image}`,
//                   rating: book.rating || 4,
//                   reviewCount: book.reviewCount || 10,
//                   available: book.Available_count,
//                 }}
//                 onClick={handleViewDetailsClick}
//               />
//             ))}
//           </div>
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default DisplayBook;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import BookCard from "./BookCard";
// import "./DisplayBook.css";
// import DetailsPage from "./DetailsPage";
// import FilterSideBar from "./FilterSideBar";
// import SearchBar from "./SearchBar";
// import Pagination from "../Admin/Pagination"; // Ensure you have this

// // Configure axios
// axios.defaults.baseURL = 'http://localhost:3000';
// axios.defaults.withCredentials = true;

// const DisplayBook = () => {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedBookId, setSelectedBookId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [filters, setFilters] = useState({
//     search: '',
//     category: 'all',
//     rating: '',
//     availability: 'all',
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const booksPerPage = 8;

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(`/api/books?page=${currentPage}&limit=${booksPerPage}`);
//         const booksWithReservedCount = await Promise.all(
//           data.books.map(async (book) => {
//             const reservedCount = await axios.get(`/api/reservations/count/${book._id}`);
//             return { ...book, reservedCount: reservedCount.data.count };
//           })
//         );
//         setBooks(booksWithReservedCount);
//         setTotalPages(data.totalPages);
//         setError('');
//       } catch (error) {
//         console.error("Error fetching books:", error);
//         setError(error.response?.data?.message || 'Error loading books. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBooks();
//   }, [currentPage]);

//   const handleViewDetailsClick = (bookId) => {
//     setSelectedBookId(bookId);
//   };

//   const handleSearch = (term) => {
//     setSearchTerm(term);
//     setCurrentPage(1); // Reset to the first page when searching
//   };

//   const handleFilterChange = (filterType, value) => {
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [filterType]: value,
//     }));
//     setCurrentPage(1);
//   };

//   const handleClearFilters = () => {
//     setFilters({
//       category: 'all',
//       rating: 0,
//       availability: 'all',
//     });
//     setCurrentPage(1);
//   };

//   const handleFilterToggle = () => {
//     setShowSidebar((prev) => !prev);
//   };

//   // Local filter logic (optional unless you implement filtering on backend)
//   const filteredBooks = books.filter((book) => {
//     const matchesSearch =
//       book.Book_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       book.Author.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       book.categories?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesCategory = filters.category !== 'all' ? book.categories?.toLowerCase() === filters.category.toLowerCase() : true;
//     const matchesRating = filters.rating ? Math.round(book.rating || 4) >= filters.rating : true;
//     const matchesAvailability = filters.availability === 'all' ? true : (filters.availability === 'available' ? book.Available_count > 0 : book.Available_count === 0);

//     return matchesSearch && matchesCategory && matchesRating && matchesAvailability;
//   });

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="error">{error}</div>;
//   if (selectedBookId) {
//     return <DetailsPage bookId={selectedBookId} setSelectedBookId={setSelectedBookId} />;
//   }

//   return (
//     <div>
//       <SearchBar
//         searchTerm={searchTerm}
//         onSearch={handleSearch}
//         onFilterToggle={handleFilterToggle}
//         books={books.map((book) => ({
//           id: book._id,
//           title: book.Book_Name,
//           author: book.Author,
//           categories: book.categories || '',
//         }))}
//       />

//       <div className="filter-container">
//         <FilterSideBar
//           show={showSidebar}
//           onClose={() => setShowSidebar(false)}
//           filters={filters}
//           onFilterChange={handleFilterChange}
//           onClearFilters={handleClearFilters}
//         />
//       </div>

//       {filteredBooks.length === 0 ? (
//         <p>No books match your search or filters.</p>
//       ) : (
//         <div>
//           <div className="books-grid">
//             {filteredBooks.map((book) => (
//               <BookCard
//                 key={book._id}
//                 book={{
//                   id: book._id,
//                   title: book.Book_Name,
//                   author: book.Author,
//                   image: `http://localhost:3000${book.Image}`,
//                   rating: book.rating || 4,
//                   reviewCount: book.reviewCount || 10,
//                   available: book.Available_count,
//                   reserved: book.reservedCount
//                 }}
//                 onClick={handleViewDetailsClick}
//               />
//             ))}
//           </div>
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default DisplayBook;


import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "./BookCard";
import "./DisplayBook.css";
import DetailsPage from "./DetailsPage";
import FilterSideBar from "./FilterSideBar";
import SearchBar from "./SearchBar";
import Pagination from "../Admin/Pagination";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configure axios
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

const DisplayBook = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    rating: '',
    availability: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const booksPerPage = 8;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/books?page=${currentPage}&limit=${booksPerPage}`);

        // Fetch reserved count for each book
        const booksWithReservedCount = await Promise.all(
          data.books.map(async (book) => {
            const reservedCount = await axios.get(`/api/reservations/count/${book._id}`);
            return {
              ...book,
              reservedCount: reservedCount.data.count,
              availableCount: book.Available_count - reservedCount.data.count // Calculate available count
            };
          })
        );

        setBooks(booksWithReservedCount);
        setTotalPages(data.totalPages);
        setError('');
      } catch (error) {
        console.error("Error fetching books:", error);
        setError(error.response?.data?.message || 'Error loading books. Please try again.');
        toast.error(error.response?.data?.message || 'Error loading books. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage]);

  const handleViewDetailsClick = (bookId) => {
    setSelectedBookId(bookId);
    toast.success('Viewing book details...');
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to the first page when searching
    toast.info(`Searching for "${term}"...`);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
    setCurrentPage(1);
    toast.info(`Filtering books by ${filterType}: ${value}...`);
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      rating: 0,
      availability: 'all',
    });
    setCurrentPage(1);
    toast.info('Clearing filters...');
  };

  const handleFilterToggle = () => {
    setShowSidebar((prev) => !prev);
  };

  // Local filter logic (optional unless you implement filtering on backend)
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.Book_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.Author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.categories?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filters.category !== 'all' ? book.categories?.toLowerCase() === filters.category.toLowerCase() : true;
    const matchesRating = filters.rating ? Math.round(book.rating || 4) >= filters.rating : true;
    const matchesAvailability = filters.availability === 'all' ? true : (filters.availability === 'available' ? book.availableCount > 0 : book.availableCount === 0);

    return matchesSearch && matchesCategory && matchesRating && matchesAvailability;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (selectedBookId) {
    return <DetailsPage bookId={selectedBookId} setSelectedBookId={setSelectedBookId} />;
  }

  return (
    <div>
      <ToastContainer /> {/* Add ToastContainer here */}
      <SearchBar
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onFilterToggle={handleFilterToggle}
        books={books.map((book) => ({
          id: book._id,
          title: book.Book_Name,
          author: book.Author,
          categories: book.categories || '',
        }))}
      />

      <div className="filter-container">
        <FilterSideBar
          show={showSidebar}
          onClose={() => setShowSidebar(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {filteredBooks.length === 0 ? (
        <p>No books match your search or filters.</p>
      ) : (
        <div>
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <BookCard
                key={book._id}
                book={{
                  id: book._id,
                  title: book.Book_Name,
                  author: book.Author,
                  image: `http://localhost:3000${book.Image}`,
                  rating: book.rating || 4,
                  reviewCount: book.reviewCount || 10,
                  availableCount: book.availableCount,
                  reservedCount: book.reservedCount
                }}
                onClick={handleViewDetailsClick}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default DisplayBook;
