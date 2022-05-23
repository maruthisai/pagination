import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";
import Pagination from "./components/Pagination";
import Stations from "./components/Stations";

const App = () => {
  const [state, setState] = useState();
  const [stations, setStations] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [stationsPerPage] = useState(100);

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      const res = await axios.get(
        "http://127.0.0.1:3000/stations?page=" + currentPage + "&limit=100"
      );
      try {
        setStations(res.data.results);
        setLoading(false);
      } catch (error) {
        if (currentPage === 5 && res.statusCode === 404 && 500 && 503) {
          alert("Error: " + error.message);
          console.log("fetchPages", error);
        }
        setState({ error });
        console.log("fetchStations", error);
      }
    };

    fetchStations();
  }, [currentPage]);

  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://127.0.0.1:3000/stations");
        setPages(res.data.results);
        setLoading(false);
      } catch (error) {
        setState({ error });
        console.log("fetchPages", error);
      }
    };

    fetchPages();
  }, []);

  // Get current stations
  const indexOfLastStation = currentPage * stationsPerPage;
  const indexOfFirstStation = indexOfLastStation - stationsPerPage;
  const currentStations = stations.slice(
    indexOfFirstStation,
    indexOfLastStation
  );
  console.log(indexOfFirstStation);
  console.log("currentStations", currentStations);
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <h1 className="text-primary mb-3">Server-side Pagination</h1>
      <Pagination
        currentPage={currentPage}
        props={stations}
        stationsPerPage={stationsPerPage}
        totalStations={pages.length}
        paginate={paginate}
      />
      <Stations stations={currentStations && stations} loading={loading} />
      {console.log("stations", stations)}
      {console.log("pages", pages)}
    </div>
  );
};

export default App;
