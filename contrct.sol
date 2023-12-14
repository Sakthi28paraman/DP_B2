// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;
contract EHR{
    struct Doctor{
        address docter_id;
        string doctor_name;
        string[] specialization;
        string[] timest;
        bool isAvailable;
    }
    struct Disease{
        string icd_code;
        uint256 icd_version;
        string disease_name;
    }
    struct patient{
            address patient_address;
            string patient_name;
            string patient_location;
            uint256 patient_age;
            string gender;
            bool doctor_assigned;
    }
    struct patient_complaint{
        address patient_id;
        string chief_complaint;
        string allergies;
        string surgeries;
        string history_patient_illness;
        string past_medical_history;
        string family_history;
    }
    struct appointment{
        address patient_id;
        string disease_id;
        address docter_id;
        string timestamp;
    }
    uint256 patientCount = 0;
    uint256 doctorCount=0;
    uint256 diseaseCount=0;
    uint256 appointmentCount=0;
    uint256 length=0;

    mapping (uint256 => patient) public patients;
    mapping (uint256 => Doctor) public doctors;
    mapping (uint256 => Disease) public diseases;
    mapping (uint256 => appointment) public appointments;

function addPatient(
    string memory _name,
    uint256 _age,
    string memory _gender,
    string memory _location,
    bool _doctorAssigned
) public returns (uint256
) {
    patients[patientCount] = patient({
        patient_address: msg.sender,
        patient_name: _name,
        patient_age: _age,
        gender: _gender,
        patient_location: _location,
        doctor_assigned: _doctorAssigned
    });

    uint256 newPatientId = patientCount;
    patientCount++;
    // emit PatientRegistered(newPatientId);

    return newPatientId;
}


    function addDoctor(address _addr, string memory _name, string[] memory _specializations, string[] memory _time,bool _isAvailable) public {
        doctors[doctorCount] = Doctor({
            docter_id: _addr,
            doctor_name: _name,
            specialization: _specializations,
            timest: _time,
            isAvailable: _isAvailable
        });
        doctorCount++;
    }
    function addDisease(string memory _icd_c, uint256 _icd_v, string memory _disease_n) public {
        diseases[diseaseCount] = Disease({
            icd_code: _icd_c,
            icd_version: _icd_v,
            disease_name: _disease_n
        });
        diseaseCount++;
    }
    function clash_checking(string memory timestam,address _docter_id) public view returns(bool){
        for(uint i=0;i < length;i++){
            if(keccak256(abi.encodePacked(appointments[i].timestamp)) == keccak256(abi.encodePacked(timestam))&& appointments[i].docter_id==_docter_id){
                    return true;
            }
        }
        return false;
    }
    function doctors_specialization_check(string memory dis) public view returns(bool){
        for(uint i=0;i<doctorCount;i++){
            for(uint j=0;j<doctors[i].specialization.length;j++){
                if(keccak256(abi.encodePacked(doctors[i].specialization[j])) == keccak256(abi.encodePacked(dis)))
                {
                    return true;
                }
            }
        }
        return false;
    }
    event AppointmentFailed(address indexed patient, string disease, string timestamp);
    function scheduleAppointment(address _patient_address, string memory _disesase_id, string memory _timestamp) public returns (address) {
    require(msg.sender == _patient_address);

    address docter_ad;
    bool doctorFound = false;

    for (uint i = 0; i < doctorCount; i++) {
        if (doctors_specialization_check(_disesase_id)) {
            docter_ad = doctors[i].docter_id;
            for (uint j = 0; j < doctors[i].timest.length; j++) {
                if (keccak256(abi.encodePacked(_timestamp)) == keccak256(abi.encodePacked(doctors[i].timest[j]))) {
                    emit AppointmentFailed(_patient_address, _disesase_id, _timestamp);
                    return address(0);
                }
            }

            doctorFound = true;
            break;
        }
    }
    require(doctorFound, "No suitable doctor found for the given specialization");

    appointments[length] = appointment({
        patient_id: _patient_address,
        disease_id: _disesase_id,
        docter_id: docter_ad,
        timestamp: _timestamp
    });

    return docter_ad;
}


    function getAllDoctors() public view returns (Doctor[] memory) {
    Doctor[] memory allDoctors = new Doctor[](doctorCount);
    for (uint i = 0; i < doctorCount; i++) {
        allDoctors[i] = doctors[i];
    }
    return allDoctors;
}

function getAllDoctorAppointments(address _doctor_id) public view returns (appointment[] memory) {
    uint count = 0;
    for (uint i = 0; i < length; i++) {
        if (appointments[i].docter_id == _doctor_id) {
            count++;
        }
    }

    appointment[] memory doctorAppointments = new appointment[](count);
    count = 0;
    for (uint i = 0; i < length; i++) {
        if (appointments[i].docter_id == _doctor_id) {
            doctorAppointments[count] = appointments[i];
            count++;
        }
    }

    return doctorAppointments;
}

function getAllPatients() public view returns (patient[] memory) {
    patient[] memory allPatients = new patient[](patientCount);
    for (uint i = 0; i < patientCount; i++) {
        allPatients[i] = patients[i];
    }
    return allPatients;
}



}