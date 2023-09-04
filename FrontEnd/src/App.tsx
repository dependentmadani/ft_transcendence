import { useState } from "react"
import NavBar from "./components/navBar"
import Section from "./components/Section"
import "./css/App.css"

function App() {

  // const [selectedSection, setSelectedSection] = useState("Home")

  // const handleSectionChange = (section:string) => {
  //   setSelectedSection(section);
  // }

  return (
    <>
      <NavBar />
      <Section  />
    </>
  )
}

export default App;
