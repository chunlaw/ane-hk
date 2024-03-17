import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <Container fixed maxWidth="md">
      <Header />
      <Outlet />
      <Footer />
    </Container>
  );
};

export default Layout;
