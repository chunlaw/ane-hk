import { Box, Link, Typography } from "@mui/material";
import reactLogo from "../../assets/react.svg";
import viteLogo from "/vite.svg";
import "../../App.css";

const Header = () => {
  return (
    <Box>
      <Box>
        <Link href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </Link>
        <Link href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </Link>
      </Box>
      <Typography variant="h1">Vite + React</Typography>
    </Box>
  );
};

export default Header;
