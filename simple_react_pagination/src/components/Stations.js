import React from "react";

const Stations = ({ stations, loading }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <ul className="list-group mb-4">
      {stations.map((station) => (
        <li key={station.stationId} className="list-group-item">
          Id:{station.stationId} Station Name: {station.stationName}
        </li>
      ))}
    </ul>
  );
};

export default Stations;
