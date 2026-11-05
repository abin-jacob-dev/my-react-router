
import React, { Suspense } from 'react'


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

const MyUsers = React.lazy(() => {
  return import('./Pages/Users');
})

function App() {
  return (
    <BrowserRouter basename='my-react-router'>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<Header />}>
            <Route index element={<Home />} />
            <Route path="usage" element={<Usage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users">
              <Route index element={<MyUsers />} />
              <Route path=":userId" element={<Details />}>
                <Route index element={<Marks />} />
                <Route path="sports" element={<Sports />} />
                <Route path="remarks" element={<Remarks />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App