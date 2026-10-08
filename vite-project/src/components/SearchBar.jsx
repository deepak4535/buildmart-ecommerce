import { Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { setSearchText } from "../redux/ProductSlice";

function SearchBar({ placeholder = "Search construction materials..." }) {
  const dispatch = useDispatch();

  const searchText = useSelector(
    (state) => state.products.searchText
  );

  const handleChange = (event) => {
    dispatch(setSearchText(event.target.value));
  };

  const handleClear = () => {
    dispatch(setSearchText(""));
  };

  return (
    <div className="search-bar">
      <Search
        className="search-bar-icon"
        size={20}
        aria-hidden="true"
      />

      <input
        type="text"
        value={searchText}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search construction materials"
      />

      {searchText && (
        <button
          type="button"
          className="search-bar-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;