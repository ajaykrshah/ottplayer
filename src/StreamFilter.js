import React, { useEffect, useState } from 'react';

const StreamFilter = ({ streams, setFilteredStreams }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Show all streams initially
    setFilteredStreams(streams);
  }, [streams, setFilteredStreams]);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    if (!searchTerm.trim()) {
      // If search term is empty, show all streams
      setFilteredStreams(streams);
    } else {
      const filtered = streams.filter((stream) => {
        const nameLower = stream.name.toLowerCase();
        const groupLower = stream.group.toLowerCase();
        const languageLower = stream.language.toLowerCase();

        return (
          nameLower.includes(searchTerm) ||
          groupLower.includes(searchTerm) ||
          languageLower.includes(searchTerm)
        );
      });
      setFilteredStreams(filtered);
    }
  };

  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />
      {/* Add other filter options if needed */}
    </div>
  );
};

export default StreamFilter;

