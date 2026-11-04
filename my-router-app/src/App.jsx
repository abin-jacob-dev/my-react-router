import Users from './Pages/Users'
import Home from './Pages/Home'
import Settings from './Pages/Settings'
import Usage from './Pages/Usage'
import Details from './Pages/Details'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from './components/Header';
import NotFound from './Pages/NotFound'
import Marks from './Pages/Marks'
import Remarks from './Pages/Remarks'
import Sports from './Pages/Sports'

import './App.css'


function App() {

  return (
    <div >
      <BrowserRouter >
        <div>
          <Header />
        </div>
        <div className='page'>
          <Routes >
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/usage" element={<Usage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/details/:userId" element={<Details />} >
              <Route index element={<Marks />} />
              <Route path="sports" element={<Sports />} />
              <Route path="remarks" element={<Remarks />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter >
    </div >

  )
}

export default App
