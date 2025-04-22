import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot API
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from 'react-router-dom';

// Use createRoot for rendering
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router basename={process.env.REACT_APP_ROUTER_BASE || ""}>
        <App />
    </Router>
    
);


serviceWorker.unregister();
