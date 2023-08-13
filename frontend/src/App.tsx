import './App.css';
import image from './images/42Logo.png'

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

function Login() {
  let style = {
      width:50,
      height:20,
      background: `url(${image})`,
    };
  return (
    <button style={style}>LogIn</button>
  );
}

export default Login;
