window.onerror = function(message, source, lineno, colno, error) {
  const fileName = source ? source.split('/').pop() : "Unknown File";
  const div = document.createElement('div');
  div.style = "position:fixed;top:0;left:0;background:#222;color:#ff5555;z-index:9999;padding:15px;width:100%;font-family:monospace;border-bottom:3px solid #ff5555;";
  div.innerHTML = `
    <strong style="color:white">FILE:</strong> ${fileName}<br>
    <strong style="color:white">LINE:</strong> ${lineno}<br>
    <strong style="color:white">ERROR:</strong> ${message}
  `;
  document.body.appendChild(div);
};
import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
