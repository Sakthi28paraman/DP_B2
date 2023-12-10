import React, { useState } from 'react'

const GetAppointment = ({state}) => {

    const [result,setResult] = useState(null);

    const getAppointment = async(e)=>{
        e.preventDefault();
        const patientId = document.querySelector('#patientId').value;
        const diseaseId = document.querySelector('#diseaseId').value;
        const dateTime =  document.querySelector('#appointmentDateTime').value;

        const doctorId = 1;

        try {
            const res = await fetch("http://localhost:3000/api/ethereum/fixAppointment",{
                method:"POST",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({dateTime:dateTime,doctorId,patientId,diseaseId})

            })
            const data = await res.json()
            setResult(data.message);
        } catch (error) {
            console.log(error);
            setResult("Error Occured");
        }
    }
  return (
    <>
    <div>
        <form onSubmit={getAppointment}>
            Patient ID: <input type="text" id="patientId" /><br />
            Disease ID : <input type="text" id='diseaseId' /><br />
            Appointment Date:<input type="datetime-local" id="appointmentDateTime" name="appointmentDateTime" />
            <button type='submit'>Get Appointment</button>
        </form>
    </div>
    {result && <p>{result}</p> }
    </>
  )
}

export default GetAppointment