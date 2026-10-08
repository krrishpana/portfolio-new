import React from "react";
import Nav from "./components/Nav.jsx";
import Hero from "./sections/Hero.jsx";
import About from "./sections/About.jsx";
import Projects from "./sections/Projects.jsx";
import Journey from "./sections/Journey.jsx";
import Lab from "./sections/Lab.jsx";
import Contact from "./sections/Contact.jsx";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Journey />
        <Lab />
        <Contact />
      </main>
    </>
  );
}
