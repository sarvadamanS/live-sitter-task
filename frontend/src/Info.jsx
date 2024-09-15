import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export const InfoModalContent = ({ onClose }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: {
          xs: 300, // Extra small screens
          sm: 400, // Small screens and up
          md: 500, // Medium screens and up
        },
        height: {
          xs: "80%",
          lg: "75%",
        },
        bgcolor: "background.paper",
        boxShadow: 24,
        p: {
          xs: 2, // Padding for extra small screens
          sm: 4, // Padding for small screens and up
        },
        borderRadius: 2,
        overflow: "auto",
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: "bold",
          color: "#1976d2",
          fontSize: {
            xs: "1.2rem", // Font size for extra small screens
            sm: "1.5rem", // Font size for small screens and up
          },
        }}
      >
        📹 Live Stream App Documentation
      </Typography>
      <Typography
        sx={{
          mt: 2,
          fontSize: {
            xs: "0.9rem", // Font size for extra small screens
            sm: "1rem", // Font size for small screens and up
          },
          color: "#555",
        }}
      >
        Welcome to the Live Stream Viewer App! Below are the key functionalities
        and current limitations:
      </Typography>

      <Typography
        sx={{
          mt: 2,
          fontSize: {
            xs: "1rem", // Font size for extra small screens
            sm: "1.2rem", // Font size for small screens and up
          },
          fontWeight: "bold",
          color: "#333",
        }}
      >
        🔴 Starting and Stopping Stream
      </Typography>
      <ul
        style={{
          marginTop: "10px",
          marginLeft: "20px",
          color: "#444",
          fontSize: "1rem",
        }}
      >
        <li>
          <b>Start Stream:</b> Use the "Start Live Stream" button to begin the
          video stream. Note that this button only works once due to current
          limitations.
        </li>
        <li>
          <b>Stop Stream:</b> Use the "Stop Stream" button to stop the video
          stream. This button is also limited to working once for now.
        </li>
      </ul>

      <Typography
        sx={{
          mt: 2,
          fontSize: {
            xs: "1rem", // Font size for extra small screens
            sm: "1.2rem", // Font size for small screens and up
          },
          fontWeight: "bold",
          color: "#333",
        }}
      >
        ⏯️ Play, Pause, and Volume Control
      </Typography>
      <ul
        style={{
          marginTop: "10px",
          marginLeft: "20px",
          color: "#444",
          fontSize: "1rem",
        }}
      >
        <li>
          <b>Play/Pause:</b> Use the play and pause buttons to control the video
          stream.
        </li>
        <li>
          <b>Volume Control:</b>Not working as we are using img frames for
          video.
        </li>
      </ul>

      <Typography
        sx={{
          mt: 2,
          fontSize: {
            xs: "1rem", // Font size for extra small screens
            sm: "1.2rem", // Font size for small screens and up
          },
          fontWeight: "bold",
          color: "#333",
        }}
      >
        🖼️ Adding and Managing Overlays
      </Typography>
      <ul
        style={{
          marginTop: "10px",
          marginLeft: "20px",
          color: "#444",
          fontSize: "1rem",
        }}
      >
        <li>
          <b>Adding Overlays:</b> You can add text or image(only img urls)
          overlays to the video stream using the "Add Overlay" form. Note that
          the size of all overlays is currently fixed, but this may change in
          the future.
        </li>
        <li>
          <b>Deleting Overlays:</b> Use the delete button on each overlay to
          remove it from the stream. Currently, this functionality is limited to
          deleting existing overlays.
        </li>
        <li>
          <b>Persisting Overlays:</b>Overlays are saved , on page reload we wont
          lose our progress ,only problem is the positioning of overlays need
          more fine tuning.
        </li>
      </ul>

      <Typography
        sx={{
          mt: 2,
          fontSize: {
            xs: "0.9rem", // Font size for extra small screens
            sm: "1rem", // Font size for small screens and up
          },
          color: "#555",
        }}
      ></Typography>

      <Typography
        sx={{
          mt: 3,
          fontSize: {
            xs: "1rem", // Font size for extra small screens
            sm: "1.2rem", // Font size for small screens and up
          },
          fontWeight: "bold",
          color: "#333",
        }}
      >
        🚀 Created by Sarvadaman Singh
      </Typography>

      <Typography
        sx={{
          mt: 1,
          fontSize: {
            xs: "0.9rem", // Font size for extra small screens
            sm: "1rem", // Font size for small screens and up
          },
          color: "#1976d2",
        }}
      >
        GitHub:{" "}
        <a
          href="https://github.com/sarvadamanS"
          style={{ color: "#1976d2", textDecoration: "none" }}
        >
          github.com/sarvadamanS
        </a>
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            mt: 3,
            backgroundColor: "#333",
            color: "#fff",
          }}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};
