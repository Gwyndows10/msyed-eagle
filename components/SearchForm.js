import React from "react";

const SearchForm = ({ searchParams, handleSearchChange, handleSearchSubmit }) => {
  return (
    <form onSubmit={handleSearchSubmit} className="mb-6 flex flex-wrap gap-4">
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={searchParams.fullName}
        onChange={handleSearchChange}
        className="flex-1 min-w-[200px] p-2 bg-gray-800 text-white rounded"
      />
      <input
        type="email"
        name="emailAddress"
        placeholder="Email"
        value={searchParams.emailAddress}
        onChange={handleSearchChange}
        className="flex-1 min-w-[200px] p-2 bg-gray-800 text-white rounded"
      />
      <input
        type="text"
        name="contactPhone"
        placeholder="Phone"
        value={searchParams.contactPhone}
        onChange={handleSearchChange}
        className="flex-1 min-w-[200px] p-2 bg-gray-800 text-white rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchForm;
