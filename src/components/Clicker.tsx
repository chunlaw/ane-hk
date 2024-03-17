import { Box, Button, Typography } from "@mui/material";
import { useContext } from "react";
import AppContext from "../AppContext";
import { useParams } from "react-router-dom";

type ClickerParams = {
  path?: string;
};

const Clicker = () => {
  const { count, addCount } = useContext(AppContext);
  const { path } = useParams<ClickerParams>();

  return (
    <Box>
      <Box className="card">
        <Button onClick={addCount}>
          {path ?? "count"} is {count}
        </Button>
        <Typography variant="body1">
          Edit <code>src/App.tsx</code> and save to test HMR
        </Typography>
      </Box>
      <Typography variant="body2" className="read-the-docs">
        Click on the Vite and React logos to learn more
      </Typography>
    </Box>
  );
};

export default Clicker;
