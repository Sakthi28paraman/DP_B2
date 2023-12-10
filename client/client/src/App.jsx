import React,{useState} from 'react'
import {BrowserRouter as Router,Routes,Route}  from 'react-router-dom'
import WalletConnection from './components/WalletConnection'
import ViewAllDoctors from './components/ViewAllDoctors'
import GetAppointment from './components/GetAppointment'
import AddDoctor from './components/AddDoctor'

const App = () => {

    const [state,setState] = useState({web3:null,contract:null,account:null})

    const saveState =({web3,contract,account})=>{
        setState({web3:web3,contract:contract,account:account})
    } 
  return (
      <Router>
          <Routes>
              <Route path='/' element={<WalletConnection saveState={saveState}/>} />
              <Route path='/view-all-doctors' element={<ViewAllDoctors/>}></Route>
              <Route path = '/get-appointment' element={<GetAppointment state={state}/>} />
              <Route path='/AddDoctor' element={<AddDoctor/>}/>
          </Routes>
      </Router>
  )
}

export default App
