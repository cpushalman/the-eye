import { useState } from "react";
import Gallery from "./components/gallery";
import Contact from "./components/Contact";

import "./App.css";
import IntroLogo from "./components/introsvg";
import "./components/HomePage";
import Events from "./components/events";
import HomePage from "./components/HomePage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <IntroLogo></IntroLogo>
      <HomePage></HomePage>
      <Events></Events>
      <Gallery></Gallery>
      <Contact></Contact>
    </>
  );
}

export default App;
