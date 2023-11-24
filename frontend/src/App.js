import './App.css';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import Home from './components/Home';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'
import ProductDetail from './components/product/ProductDetail';
import 'react-toastify/dist/ReactToastify.css';
import ProductSearch from './components/product/ProductSearch';


function App() {
  return (
    <Router>
      <div className="App">
        <HelmetProvider>
          <Header />
          <div className='container container-fluid'>
            <ToastContainer theme='dark' />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path='/search/:keyword' element={<ProductSearch />} />
            </Routes>
          </div>
          <Footer />
        </HelmetProvider>
      </div>
    </Router>
  );
}

export default App;
