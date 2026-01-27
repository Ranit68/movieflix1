import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import SearchResults from "./pages/SearchResults";
import MovieDetails from "./pages/MovieDetails";
import Watch from "./pages/Watch";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:query" element={<SearchResults />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/category/:category" element={<Movies />} />
        <Route path="/series" element={<Series />} />
        <Route path="/series/category/:category" element={<Series />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv/:id" element={<MovieDetails />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
