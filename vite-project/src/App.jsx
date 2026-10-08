import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
}

export default App;