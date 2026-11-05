import React, { Suspense, useState } from 'react'

const MyComp = React.lazy(() => {
  return import(/*webpackChunkName:"Section"*/'../components/Section');
})
function Settings() {
  const [state, setState] = useState(false)
  return (
    <div>
      <div>Settings</div>
      {state && (<Suspense fallback={<div>Loading...</div>}> <MyComp /> </Suspense>)}

      <button onClick={() => {
        setState(true)
      }} >Click</button>
    </div>
  )
}

export default Settings