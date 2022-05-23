import axios from "axios";
import React, { useEffect, useState } from "react";

const Pagination = ({
  props,
  stationsPerPage,
  totalStations,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  for (let i = 1; i <= Math.ceil(totalStations / stationsPerPage); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      const res = await axios.get(
        "http://127.0.0.1:3000/stations?page=" + currentPage + "&limit=100"
      );
      setStations(res.data.results);
      setLoading(false);
    };

    fetchStations();
  }, [currentPage]);
  console.log("props", props);
  console.log("Page Numbers", pageNumbers);
  console.log("Current Page", currentPage);
  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((currentPage) => (
          <li key={currentPage} className="page-item">
            <a
              onClick={() => paginate(currentPage)}
              href="!#"
              className="page-link"
            >
              {currentPage}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
