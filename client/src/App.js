import './App.css';
import Messager from './Messaging/Messaging';

import {React, useEffect} from 'react';

function App() {
  useEffect(() => {
    Messager();
  }, [])

  return (
    <div>get me out</div>
  );
}

export default App;
