import React, { useState } from 'react';

const AddDoctor = () => {
  const [result, setResult] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const handleAddAppointment = () => {
    const datetimeInput = document.querySelector('#appointmentDatetime');
    
    // Check if the datetime input has a value
    if (datetimeInput.value) {
      setAppointments([...appointments, datetimeInput.value.trim()]);
      datetimeInput.value = ''; // Clear the input after adding the appointment
    }
  };

  const getAppointment = async (e) => {
    e.preventDefault();
    const DoctorAddress = document.querySelector('#doctorid').value;
    const DoctorName = document.querySelector('#doctorname').value;
    const Specialization = document.querySelector('#Specialization').value.split(',').map(s => s.trim());

    const Appointments = appointments;

    const isAvailable = document.querySelector('input[name="Available"]:checked').value === 'True';

    try {
      const res = await fetch("http://localhost:3000/api/ethereum/AddDoctor", {
        method: "POST", // Change to POST method
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ DoctorAddress, DoctorName, Specialization, Appointments, isAvailable })
      });

      const data = await res.json();
      setResult(data.message);
    } catch (error) {
      console.log(error);
      setResult("Error Occurred");
    }
  };

  return (
    <div>
      <form onSubmit={getAppointment}>
        Doctor address:<input type='text' id="doctorid" /><br />
        Doctor Name:<input type='text' id='doctorname' /><br />
        Specialization:<input type='text' id='Specialization' /><br />
        {appointments.map((appointment, index) => (
          <div key={index}>{`Appointment ${index + 1}: ${appointment}`}</div>
        ))}
      
        <label htmlFor="appointmentDatetime">Appointment Datetime:</label>
        <input type="datetime-local" id="appointmentDatetime" /><br />
        <button type="button" onClick={handleAddAppointment}>Add Appointment</button><br />

        isAvailable:<input type='radio' value='True' name='Available' /> True
        <input type='radio' value='false' name='Available' /> False<br />
        <button type="submit">Submit</button>
      </form>
      {result && <div>{result}</div>}
    </div>
  );
};

export default AddDoctor;
