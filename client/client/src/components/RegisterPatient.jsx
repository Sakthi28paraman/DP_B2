import React, { useState } from 'react';


const RegisterPatient = ({state}) => {

  const [result,setResult] = useState(null);


  const Register = async(e) =>{
    e.preventDefault();
    const {contract,account} = state;
    const PatientName = document.querySelector('#patientName').value;
    const PatientAge = document.querySelector('#patientAge').value;
    const PatientLocation = document.querySelector('#patientLocation').value;
    const PatientGender = document.querySelector('input[name="gender"]:checked').value === 'Male' ? 'Male' : 'Female';
    const DoctorAssgin = document.querySelector('input[name="Available"]:checked').value === 'True';

    try{
      const res = await fetch("http://localhost:3000/api/ethereum/RegisterPatient", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    PatientName,
    PatientAge,
    PatientGender,
    PatientLocation,
    DoctorAssgin,
  }),
});
console.log(res);
if (res.ok) {
  const data = await res.json();
  console.log(data);
  if (data.status === 200) {
    if (contract && contract.methods) {
      await contract.methods
        .addPatient(
          PatientName,
          PatientAge,
          PatientGender,
          PatientLocation,
          DoctorAssgin
        )
        .send({ from: account });
    }
  } else {
    alert("Patient Not Registered");
  }
  setResult(data.message);
  console.log(result);
} else {
  console.error(`Error: ${res.status} - ${res.statusText}`);
  setResult("Error Occurred1");
}
}  catch(err){
        console.log(err);
        setResult("Error Occured2");
    }
  }

  return (
    <div>
        <form onSubmit={Register}>
          Name : <input type="text" id='patientName' /><br />
          Age : <input type="number" id='patientAge' /><br />
          Gender<input type='radio' value='Male' name='gender' /> Male
        <input type='radio' value='Female' name='gender' /> Female<br />
        Location: <input type="text" id='patientLocation' /><br />
        Doctor Assigned:<input type='radio' value='True' name='Available' /> Assigned
        <input type='radio' value='false' name='Available' /> Not Assigned<br />
        <button style={{backgroundColor:"#1dc071"}} >Register</button>
        </form>

        {result && <div> {result} </div> }
    </div>
  )
}

export default RegisterPatient