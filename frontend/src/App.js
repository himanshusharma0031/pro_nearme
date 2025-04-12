import logo from './logo.svg';
import './App.css';
import Signup from './components/Signup';
import { BrowserRouter,Router,Routes,Route } from 'react-router-dom';
import ProviderSignup from './components/ProviderSignup';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
      <Route path='/'  element={<Signup/>} ></Route>  
      <Route path='/provider/signup'  element={<ProviderSignup></ProviderSignup>} ></Route>  


</Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
