import React,{useState,useEffect} from 'react'

const ViewAllDoctors = () => {
  const [doctors,setDoctors] = useState([]);

  useEffect(()=>{
    const fetchDoctors = async()=>{
        try {
          const res = await fetch("http://localhost:3000/api/ethereum/getDoctors",{
            method:"GET",
            headers:{
              "content-type" : "application/json"
            }
          })
          const data = await res.json();
          if(data.status === 200){
            setDoctors(data.doctorsDetails);
          }
        } catch (error) {
          console.log(error);
        }
    }
    fetchDoctors()
  },[])
  
  
  return (
    <>
    {doctors.map((doctor, index) => (
        <div key={index}>
          <p>Doctor Name: {doctor.doctor_name}</p>
          <p>Doctor Address: {doctor.doctor_address}</p>
          <p>Is Available: {doctor.isAvailable}</p>
        </div>
      ))}

    </>
  )
}

export default ViewAllDoctors