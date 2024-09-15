import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import InfoIcon from "@mui/icons-material/Info";

import { InfoModalContent } from "./Info.jsx";
export const Header = () => {
  const [infoState, setInfoState] = useState(false);

  const handleModalClose = () => setInfoState(false);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Livestream Viewer App{" "}
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#fff",
              color: "black",
              textTransform: "none",
              mr: "10px",
            }}
            startIcon={<InfoIcon />}
            onClick={() => setInfoState(!infoState)}
          >
            Info
          </Button>
        </Toolbar>
      </AppBar>

      {/* Modal Component */}
      <Modal
        open={infoState}
        onClose={handleModalClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(5px)",
        }}
      >
        {/* Ensure you're using a div or Box directly */}
        <Box>
          <InfoModalContent onClose={handleModalClose} />
        </Box>
      </Modal>
    </>
  );
};
