import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../css/navigation.css'
const NavigationPage = () => {
    const navigate = useNavigate();
    const getAllDoctors = ()=>{
        navigate('/view-all-doctors')
    }
    const navigateAppointment =() =>{
        navigate('/get-appointment')
    }
    const RegisterPatient =()=>{
        navigate('/registerPatient')
    }
    const GetPatient = () =>{
      navigate('/getPatient')
    }
  return (
    <div>
      <button onClick={navigateAppointment} className='AppoButton'>Get Appointment page</button><br />
      <br />
      <button onClick={RegisterPatient} className='RegButton'>Register</button><br />
      <br />
      <button onClick={GetPatient} className='PatButton'>Patient List</button><br />
      <br />
      <button onClick={getAllDoctors} className='DocButton'>Doctors List</button>
    </div>
  )
}

export default NavigationPage;