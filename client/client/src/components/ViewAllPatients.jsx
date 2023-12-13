import React, { useEffect, useState } from 'react'

const ViewAllPatients = () => {

    const [patient,setPatient] = useState([]);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchPatient = async ()=>{
            try {
                const res = await fetch('http://localhost:3000/api/ethereum/getPatients',{
                    method:'GET',
                    headers:{
                        'content-type': 'application/json',
                    }
                });
                if (!res.ok) {
                    throw new Error(`Failed to fetch data: ${res.statusText}`);
                  }
          
                  const data = await res.json();
                  console.log(data);
          
                  if (data.status === 200) {
                    setPatient(data.patientdeatil); // Access the first array in the nested structure
                  } else {
                    setError(`Server error: ${data.message}`);
                  }
            } catch (error) {
                console.log(error);
                setError(`Error fetching data: ${error.message}`);
            }
        }
    fetchPatient();
    },[]);

    if (error) {
        return <div>Error: {error}</div>;
      }
    
  return (
    <div>
            {patient.map((patient,index)=>{
                <div key={index}>
                    <p>{patient}</p>
                </div>
            })

            }
    </div>
  )
}

export default ViewAllPatients