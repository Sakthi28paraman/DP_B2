// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

contract EHR {

    struct Patient {
        address patient_address;
        string patient_name;
        uint256 patient_age;
        string gender;
        string patient_location;
        string[] symptoms;
        string disease_id;
        uint256 doctor_id;
        bool doctor_assigned;
    }

    struct Disease {
        uint256 disease_id;
        string disease_name;
        string[] specializations_required;
    }

    struct Doctor {
        address doctor_address;
        string doctor_name;
        string[] specializations;
        bool isAvailable;
    }

    struct Appointment {
        uint256 appointment_id;
        uint256 patient_id;
        string disease_id;
        uint256 doctor_id;
        string appointmentTimestamp;
    }

    uint256 public patientCount = 0;
    uint256 public diseaseCount = 0;
    uint256 public doctorCount = 0;
    uint256 public appointmentCount = 0;

    mapping (uint256 => Patient) public patients;
    mapping (uint256 => Disease) public diseases;
    mapping (uint256 => Doctor) public doctors;
    mapping (uint256 => Appointment) public appointments;
    mapping (address => uint256) public doctorAddressToId;
    mapping (string => uint256) public diseaseIdByCode; // New mapping for disease codes

    constructor() {
        // Initialize static doctor details
        string[] memory generalSpecializations = new string[](1);
        generalSpecializations[0] = "ICD-10-A00";
        addDoctor(address(0x8e17a7DAcf0c7ED9adc066a21e7BB30e0465931f), "Dr. John", generalSpecializations);

        string[] memory entSpecializations = new string[](1);
        entSpecializations[0] = "ICD-10-H00";
        addDoctor(address(0x57Ec413998E5B69D939B6BAF1B7259693797a966), "Dr. Future", entSpecializations);

        string[] memory heartSpecializations = new string[](1);
        heartSpecializations[0] = "ICD-10-I00";
        addDoctor(address(0x34478EB384FDaBd6f805b96E79d2D0ffc4e5f76E), "Dr. Present", heartSpecializations);

        // Initialize static disease details
        string[] memory generalDiseaseSpecializations = new string[](1);
        generalDiseaseSpecializations[0] = "ICD-10-A00";
        addDisease("Common Cold", generalDiseaseSpecializations);

        string[] memory entDiseaseSpecializations = new string[](1);
        entDiseaseSpecializations[0] = "ICD-10-H00";
        addDisease("Ear Infection", entDiseaseSpecializations);

        string[] memory heartDiseaseSpecializations = new string[](1);
        heartDiseaseSpecializations[0] = "ICD-10-I00";
        addDisease("Heart Disease", heartDiseaseSpecializations);
    }

    function addPatient(
        string memory _name,
        uint256 _age,
        string memory _gender,
        string memory _location,
        string[] memory _symptoms,
        string memory _diseaseId,
        uint256 _doctorId,
        bool _doctorAssigned
    ) public returns (uint256) {
        patients[patientCount] = Patient({
            patient_address: msg.sender,
            patient_name: _name,
            patient_age: _age,
            gender: _gender,
            patient_location: _location,
            symptoms: _symptoms,
            disease_id: _diseaseId,
            doctor_id: _doctorId,
            doctor_assigned: _doctorAssigned
        });

        patientCount++;
        return patientCount - 1;
    }

    function addDisease(string memory _name, string[] memory _specializationsRequired) private {
        diseases[diseaseCount] = Disease({
            disease_id: diseaseCount,
            disease_name: _name,
            specializations_required: _specializationsRequired
        });

        // Map disease code to disease ID
        diseaseIdByCode[_name] = diseaseCount;

        diseaseCount++;
    }

    function addDoctor(address _addr, string memory _name, string[] memory _specializations) private {
        doctors[doctorCount] = Doctor({
            doctor_address: _addr,
            doctor_name: _name,
            specializations: _specializations,
            isAvailable: true
        });

        doctorAddressToId[_addr] = doctorCount;
        doctorCount++;
    }

    function createAppointment(uint256 _patientId, string memory _diseaseCode, string memory _appointmentTimestamp) public returns (address) {
        require(_patientId < patientCount, "Invalid patient ID");
        require(bytes(_diseaseCode).length > 0, "Invalid disease code");

        uint256 diseaseId = diseaseIdByCode[_diseaseCode];
        require(diseaseId > 0, "Invalid disease code");

        Disease memory disease = diseases[diseaseId];

        Patient storage patient = patients[_patientId];
        uint256 doctorId = findAvailableDoctor(disease.specializations_required);
        require(doctorId != 0, "No available doctor for the required specialization");
        doctors[doctorId].isAvailable = false;

        appointments[appointmentCount] = Appointment({
            appointment_id: appointmentCount,
            patient_id: _patientId,
            disease_id: _diseaseCode, // Use disease code as the identifier
            doctor_id: doctorId,
            appointmentTimestamp: _appointmentTimestamp
        });

        appointmentCount++;

        return doctors[doctorId].doctor_address;
    }

    function findAvailableDoctor(string[] memory _specializationsRequired) private view returns (uint256) {
        for (uint256 i = 1; i < doctorCount; i++) {
            if (arrayContains(doctors[i].specializations, _specializationsRequired) && doctors[i].isAvailable) {
                return i;
            }
        }
        return 0;
    }

    function arrayContains(string[] memory _arr, string[] memory _values) private pure returns (bool) {
        for (uint256 i = 0; i < _values.length; i++) {
            bool found = false;
            for (uint256 j = 0; j < _arr.length; j++) {
                if (keccak256(bytes(_arr[j])) == keccak256(bytes(_values[i]))) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }

    modifier onlyDoctor() {
        require(doctorAddressToId[msg.sender] > 0, "Only doctors can access this function.");
        _;
    }

    function getPatientDetails(uint256 _patientId) public view onlyDoctor returns (Patient memory) {
        require(_patientId < patientCount, "Invalid patient ID");
        return patients[_patientId];
    }

    function updateDoctorAvailability(bool _isAvailable) public onlyDoctor {
        uint256 doctorId = doctorAddressToId[msg.sender];
        require(doctorId > 0, "Only registered doctors can update availability.");
        doctors[doctorId].isAvailable = _isAvailable;
    }

    function getAllDoctorDetails() public view returns (Doctor[] memory) {
        Doctor[] memory doctorDetails = new Doctor[](doctorCount);

        for (uint256 i = 1; i < doctorCount; i++) {
            doctorDetails[i] = doctors[i];
        }

        return doctorDetails;
    }

    function getAppointmentsForDoctor(uint256 _doctorId) public view returns (uint256[] memory) {
        require(_doctorId < doctorCount, "Invalid doctor ID");

        uint256[] memory doctorAppointments = new uint256[](appointmentCount);
        uint256 appointmentCountForDoctor = 0;

        for (uint256 i = 0; i < appointmentCount; i++) {
            if (appointments[i].doctor_id == _doctorId) {
                doctorAppointments[appointmentCountForDoctor] = i;
                appointmentCountForDoctor++;
            }
        }

        // Resize the array to fit the actual number of appointments
        assembly {
            mstore(doctorAppointments, appointmentCountForDoctor)
        }

        return doctorAppointments;
    }

    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}
