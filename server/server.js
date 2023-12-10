//0xB5445afdd204e8EC78B745D7c5Ac08507703B9cD

const express = require('express');
const ABI = require('./ABI.json');
const { Web3 } = require("web3");
const cors = require('cors')

const app = express();
app.use(cors());
app.use(express.json())
const PORT = 3000;
const web3 = new Web3("https://neat-fluent-meme.ethereum-goerli.discover.quiknode.pro/478a9345b29f410832fef17ac2c226bf82085f4c/");
const contractAddress = "0x4FD83B714C9CF04E4AEdE980Ee05a796C4cDc51A";
const contract = new web3.eth.Contract(ABI,contractAddress);

// const getDoctors = async () => {
//     try {
//         const doctorsCount = await contract.methods.doctorCount().call();
//         const doctorsDetails = []

//         for (let i = 1; i <= doctorsCount; i++) { // Start from 1, not 0
//             const doctor = await contract.methods.doctors(i).call();
//             doctorsDetails.push(doctor);
//         }
//         console.log('Doctor Details:');
//         console.log(doctorsDetails);
//     } catch (err) {
//         console.log(err);
//     }
// }
// getDoctors()

// const dateClashCheck = async (datetime, doctorId) => {
//     try {
//         const doctorAppointments = await contract.methods.getAppointmentsForDoctor(doctorId).call();
//         const providedTimestamp = Date.parse(datetime) / 1000;
//         for (const appointmentId of doctorAppointments) {
//             const appointment = await contract.methods.appointments(appointmentId).call();
//             const appointmentTimestamp = appointment.timestamp;
//             if (Math.abs(appointmentTimestamp - providedTimestamp) < 3600) { 
//                 return true;
//             }
//         }
//         return false;
//     } catch (err) {
//         console.error(err);
//         return false;
//     }
// }


// app.post("/api/ethereum/get-appointment",async(req,res)=>{
//     const {doctorId,datetime,patientId,diseaseId} = req.body;
//     console.log(req.body);
//     console.log(patientId);
//     const checkClash = await dateClashCheck(datetime,doctorId);

//     if(checkClash){
//         return res.status(400).json({status:400,message:"Date and Time Clash chose another timing"});
//     }
//     try {
//         const appointment = await contract.methods.createAppointment(patientId,diseaseId,datetime).send({from:"0xE11d568F697eb189660C977E26Be9362e0a483Dc"})
//         console.log(appointment);
//     } catch (error) {
//         return res.status(500).json({status:500,message:"Error in creating appointment"})
//     }
//     return res.status(200).json({status:200,message:"Appointment Created Successfully"})
// })


app.post("/api/ethereum/fixAppointment", async (req, res) => {
    try {
        const { patientAddress, diseaseId, timestamp } = req.body;

        const isPatient = await contract.methods.patients(patientAddress).call();
        if (!isPatient) {
            return res.status(404).json({ status: 404, message: "Patient not found" });
        }
        const doctorAddress = await contract.methods.ṭ(patientAddress, diseaseId, timestamp).send({ from: patientAddress });

        // Check if the appointment was successful
        if (doctorAddress !== '0x0000000000000000000000000000000000000000') {
            res.status(200).json({ status: 200, doctorAddress, message: "Appointment fixed successfully" });
        } else {
            res.status(400).json({ status: 400, message: "Appointment failed. Please choose a different time" });
        }

    } catch (err) {
        res.status(500).json({ status: 500, message: "Error fixing appointment", error: err.message });
        console.error(err);
    }
});


app.get("/api/ethereum/getDoctors",async(req,res)=>{
    try{
        const doctorsCount = await contract.methods.doctorCount().call();
        const doctorsDetails = []
        if(doctorsCount < 0){
            res.status(404).json({status:404,message:"No Doctor details available"})
        }
        for (let i = 1; i <= doctorsCount; i++) { 
            const doctor = await contract.methods.doctors(i).call();
            doctorsDetails.push(doctor);
        }
        // const doctorList = doctorsDetails.map(({addr,name,avail})=>{
        //     return {addr,name,avail}
        // })
        // console.log(doctorList);
        // console.log('Doctor Details:');
        res.status(200).json({status:200,doctorsDetails,message:"Doctor's List"})
        console.log(doctorsDetails);
    } catch (err) {
        res.status(500).json({status:500,message:"No doctor details aavailable"});
        console.log(err);
    }
})


app.post("/api/ethereum/AddDoctor", async (req, res) => {
    try {
        const { DoctorAddress, DoctorName, Specialization, Appointments, isAvailable } = req.body;
        const isAvailableBool = isAvailable === 'True';
        const isDoctor = await contract.methods.doctors(DoctorAddress).call();
        if (isDoctor.doctor_name !== '') {
            return res.status(400).json({ status: 400, message: "Doctor already exists" });
        }
        await contract.methods.addDoctor(DoctorAddress, DoctorName, Specialization, Appointments, isAvailableBool).send({ from: "0xE11d568F697eb189660C977E26Be9362e0a483Dc" });

        res.status(200).json({ status: 200, message: "Doctor added successfully" });
    } catch (err) {
        res.status(500).json({ status: 500, message: "Error adding doctor", error: err.message });
        console.error(err);
    }
});



app.listen(PORT,()=>{
    console.log(`Server is running at port:${PORT}`);
})


