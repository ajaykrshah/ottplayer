import React, { useEffect, useState } from 'react';
import { genreMap, langMap } from './utils/playlistGenerator';
import './StreamFilter.css'; 

const StreamFilter = ({ streams, setFilteredStreams }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    // Show all streams initially
    setFilteredStreams(streams);
  }, [streams, setFilteredStreams]);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    filterStreams(searchTerm, selectedLanguage, selectedGenre);
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setSelectedLanguage(selectedLang);

    filterStreams(searchTerm, selectedLang, selectedGenre);
  };

  const handleGenreChange = (e) => {
    const selectedGen = e.target.value;
    setSelectedGenre(selectedGen);

    filterStreams(searchTerm, selectedLanguage, selectedGen);
  };

  const filterStreams = (search, lang, gen) => {
    let filtered = streams;

    if (search.trim()) {
      filtered = filtered.filter((stream) => {
        const nameLower = stream.name.toLowerCase();
        const groupLower = stream.group.toLowerCase();
        const languageLower = stream.language.toLowerCase();

        return (
          nameLower.includes(search) ||
          groupLower.includes(search) ||
          languageLower.includes(search)
        );
      });
    }

    if (lang !== '') {
      filtered = filtered.filter((stream) => stream.language === lang);
    }

    if (gen !== '') {
      filtered = filtered.filter((stream) => stream.group === gen);
    }

    setFilteredStreams(filtered);
  };

  const filteredLanguages = {
    1: langMap[1], // Hindi
    6: langMap[6], // English
    12: langMap[12], // Bhojpuri
  };

  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Language filter dropdown */}
      <select
        value={selectedLanguage}
        onChange={handleLanguageChange}
      >
        <option value="">Select Language</option>
        {Object.entries(filteredLanguages).map(([key, value]) => (
          <option key={key} value={value}>{value}</option>
        ))}
      </select>

      {/* Genre filter dropdown */}
      <select
        value={selectedGenre}
        onChange={handleGenreChange}
      >
        <option value="">Select Genre</option>
        {Object.entries(genreMap).map(([key, value]) => (
          <option key={key} value={value}>{value}</option>
        ))}
      </select>
    </div>
  );
};

export default StreamFilter;
