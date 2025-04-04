import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '../Librarian/SearchBar';
import FilterDropdown from '../Librarian/FilterDropdown';
import './WishlistDetails.css';

const WishlistDetails = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWishlists, setFilteredWishlists] = useState([]);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'unavailable', label: 'Unavailable' }
  ];

  useEffect(() => {
    fetchWishlists();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [wishlists, searchTerm, filter]);

  const fetchWishlists = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/wishlist', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const wishlistData = response.data?.data?.wishlists || [];
      setWishlists(wishlistData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching wishlists:', err);
      setError('Failed to load wishlist data. Please try again later.');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...wishlists];

    if (filter !== 'all') {
      filtered = filtered.filter(wishlist => wishlist.status === filter);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(wishlist =>
        wishlist.book_name?.toLowerCase().includes(query) ||
        wishlist.student_name?.toLowerCase().includes(query)
      );
    }

    setFilteredWishlists(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="wishlist-loading">Loading wishlist data...</div>;
  if (error) return <div className="wishlist-error">{error}</div>;

  return (
    <div className="wishlist-details-container">
      <h2>Student Wishlists</h2>

      <div className="controls">
        {/* <SearchBar searchQuery={searchTerm} setSearchQuery={setSearchTerm} /> */}
        <SearchBar searchQuery={searchTerm} setSearchQuery={setSearchTerm} placeholder="Search by student name or book title..."/>
        <div className="filter-section">
          <h2>Filter by status:</h2>
          <FilterDropdown statusFilter={filter} setStatusFilter={setFilter} options={statusOptions} />
        </div>
      </div>

      {filteredWishlists.length === 0 ? (
        <div className="no-wishlists">
          <p>No wishlist items match your filters.</p>
        </div>
      ) : (
        <div className="wishlist-table-container">
          <table className="wishlist-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student Email</th>
                <th>Book Name</th>
                <th>Date Added</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredWishlists.map(wishlist => (
                <tr key={wishlist._id} className={wishlist.status === 'available' ? 'available-row' : ''}>
                  <td>{wishlist.student_name}</td>
                  <td>{wishlist.student_email}</td>
                  <td>{wishlist.book_name}</td>
                  <td>{formatDate(wishlist.wishlist_date)}</td>
                  <td>
                    <span className={`status-badge ${wishlist.status}`}>
                      {wishlist.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WishlistDetails;
