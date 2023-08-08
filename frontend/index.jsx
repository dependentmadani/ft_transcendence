// TODO: need to install react and react-dom in your machine
//npm install react react-dom --save 

// import React from 'react';
// import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(<h1>This is an example.</h1>);