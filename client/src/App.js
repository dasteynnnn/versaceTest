import React, {useState, useEffect} from 'react';
import NavSec from './components/navSec'

function App() {

  const [apiData, setApiData] = useState('')
  useEffect(() => {
    fetch("http://localhost:9000/testAPI")
      .then(res => { return res.json() })
      .then(res => setApiData(res.message))
  })
  return (
    <NavSec/>
  );
}

export default App;
