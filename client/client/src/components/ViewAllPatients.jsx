import React, { useEffect, useState } from 'react';

const ViewAllPatients = () => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/ethereum/getPatients', {
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
                    setPatients(data.patientdeatil);
                } else {
                    setError(`Server error: ${data.message}`);
                }
            } catch (error) {
                console.log(error);
                setError(`Error fetching data: ${error.message}`);
            }
        };
        fetchPatients();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {patients.map((patient, index) => (
                <div key={index}>
                    <p>
                        Patient Address: {patient.patient_address}<br />
                        Patient Name: {patient.patient_name}<br />
                        Patient Location: {patient.patient_location}<br />
                        Patient Age: {patient.patient_age}<br />
                        Gender: {patient.gender}<br />
                        Doctor Assigned: {patient.doctor_assigned ? 'Yes' : 'No'}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ViewAllPatients;
