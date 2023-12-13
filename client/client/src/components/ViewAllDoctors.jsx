import React, { useState, useEffect } from 'react';

const ViewAllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/ethereum/getDoctors', {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.statusText}`);
        }

        const data = await res.json();
        console.log(data);

        if (data.status === 200) {
          setDoctors(data.doctorDetails); // Access the first array in the nested structure
        } else {
          setError(`Server error: ${data.message}`);
        }
      } catch (error) {
        console.error(error);
        setError(`Error fetching data: ${error.message}`);
      }
    };

    fetchDoctors();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {doctors.map((doctor, index) => (
        <div key={index}>
          <p>Doctor Name: {doctor[1]}</p>
          <p>Doctor Address: {doctor[0]}</p>
          <p>Is Available: {doctor[4].toString()}</p>
          <p>Specializations: {doctor[2].join(', ')}</p>
          <p>Timestamps: {doctor[3].join(', ')}</p>
        </div>
      ))}
    </>
  );
};

export default ViewAllDoctors;
