import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  TextField,
  Slider,
  IconButton,
  Card,
  Typography,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Delete,
  Edit,
} from "@mui/icons-material";
import Draggable from "react-draggable";
import "./App.css";
import { Header } from "./Header.jsx";

const DraggableOverlay = React.forwardRef((props, ref) => (
  <Draggable {...props} nodeRef={ref}>
    <div ref={ref} style={props.style}>
      {props.children}
    </div>
  </Draggable>
));
let url = window.location.origin.includes("localhost")
  ? "http://localhost:5000"
  : window.location.origin;

const App = () => {
  const [playIsDisabled, setPlayIsDisabled] = useState(false);
  const [stopIsDisabled, setStopIsDisabled] = useState(false);

  const [rtspUrl, setRtspUrl] = useState(
    // ""
    "rtsp://rtspstream:35b2d3fa16c0d87cfb0712f8b59889bd@zephyr.rtsp.stream/movie"
  );
  const [videoSrc, setVideoSrc] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [overlays, setOverlays] = useState([]);
  const [newOverlay, setNewOverlay] = useState({
    content: {
      type: "text",
      value: "",
      textColor: "#000000",
      bgColor: "#ffffff",
    },
    position: { x: 0, y: 0 },
    size: { width: 100, height: 100 },
  });
  const [overlayType, setOverlayType] = useState("text");
  const videoRef = useRef(null);

  // Fetch overlays from the server
  const fetchOverlays = async (load = false) => {
    try {
      const res = await fetch(`${url}/overlay`);
      const data = await res.json();
      setOverlays(data); // Load overlays into state
      if (load) {
        data.forEach((el) => {
          setNewOverlay(el);
        });
      }
      console.log(data);
    } catch (error) {
      console.error("Error fetching overlays", error);
    }
  };

  useEffect(() => {
    fetchOverlays(true);
  }, []);

  // Add Overlay
  const handleOverlaySubmit = async () => {
    try {
      const overlayToSubmit = {
        ...newOverlay,
        content: { ...newOverlay.content, type: overlayType },
      };
      const res = await fetch(`${url}/overlay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(overlayToSubmit),
      });
      if (res.ok) {
        fetchOverlays();
        setNewOverlay({
          content: {
            type: "text",
            value: "",
            textColor: "#000000",
            bgColor: "#ffffff",
          },
          position: { x: 0, y: 0 },
          size: { width: 100, height: 100 },
        });
        setOverlayType("text"); // Reset overlay type
      }
    } catch (error) {
      console.error("Error adding overlay", error);
    }
  };
  //Stop video
  // Play Video
  const handleStop = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      try {
        await fetch(`${url}/stop_stream`, { method: "POST" }); // Stop the stream on the backend
      } catch (error) {
        console.error("Error resuming the stream", error);
      }
    }
  };

  // Play Video
  const handlePlay = async () => {
    if (!isPlaying) {
      setIsPlaying(true);
      try {
        await fetch(`${url}/resume_stream`, { method: "POST" }); // Stop the stream on the backend
      } catch (error) {
        console.error("Error resuming the stream", error);
      }
    }
  };

  // Pause Video and Stop Stream
  const handlePause = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      try {
        await fetch(`${url}/pause_stream`, { method: "POST" }); // Stop the stream on the backend
      } catch (error) {
        console.error("Error stopping the stream", error);
      }
    }
  };

  // Volume change
  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    videoRef.current.volume = newValue / 100;
  };

  // Delete Overlay
  const handleDeleteOverlay = async (id) => {
    try {
      await fetch(`${url}/overlay/${id}`, {
        method: "DELETE",
      });
      fetchOverlays(); // Refresh the overlays list after deletion
    } catch (error) {
      console.error("Error deleting overlay", error);
    }
  };

  return (
    <div
      className="App"
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <Header />

      {/* RTSP URL Input */}
      <TextField
        label="RTSP URL"
        fullWidth
        value={rtspUrl}
        onChange={(e) => setRtspUrl(e.target.value)}
        sx={{ maxWidth: "600px", marginTop: "30px" }}
      />
      <span>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setRtspUrl(rtspUrl);
            setVideoSrc(
              `${url}/video_feed?rtsp_url=${encodeURIComponent(rtspUrl)}`
            );
            setIsPlaying(true);
            setPlayIsDisabled(true);
          }}
          disabled={playIsDisabled}
          style={{ marginTop: "10px" }}
        >
          Start Live Stream
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleStop();
            setStopIsDisabled(true);
          }}
          disabled={stopIsDisabled}
          style={{ marginTop: "10px", marginLeft: "10px" }}
        >
          Stop Stream
        </Button>
      </span>

      {/* Video Container */}
      <Card className="video-container" style={{ position: "relative" }}>
        <img
          ref={videoRef}
          src={videoSrc}
          alt="Live Stream"
          width="640"
          height="480"
        />
        {/* Overlay rendering */}
        {overlays.map((overlay, index) => (
          <DraggableOverlay
            key={index}
            position={{ x: overlay.position.x, y: overlay.position.y }}
            style={{
              position: "absolute",
              left: `${overlay.position.x}px`,
              top: `${overlay.position.y}px`,
              width: `${overlay.size.width}px`,
              height: `${overlay.size.height}px`,
              border: "1px solid black",
              backgroundColor:
                overlay.content.bgColor || "rgba(255, 255, 255, 0.5)",
            }}
            onStop={(e, data) => {
              const updatedOverlay = {
                ...overlay,
                position: { x: data.x, y: data.y },
              };

              const updatedOverlays = [...overlays];
              updatedOverlays[index] = updatedOverlay;
              setOverlays(updatedOverlays);

              // Persist new position to the server
              fetch(`${url}/overlay/${overlay._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedOverlay),
              });
            }}
          >
            {overlay.content.type === "text" ? (
              <Typography
                style={{
                  backgroundColor: overlay.content.bgColor || "transparent",
                  color: overlay.content.textColor || "black",
                }}
              >
                {overlay.content.value}
              </Typography>
            ) : (
              <img
                src={overlay.content.value}
                alt="Overlay"
                width="100%"
                height="100%"
              />
            )}
          </DraggableOverlay>
        ))}
      </Card>

      {/* Video Controls */}
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <IconButton onClick={handlePlay}>
          <PlayArrow />
        </IconButton>
        <IconButton onClick={handlePause}>
          <Pause />
        </IconButton>
        <VolumeUp />
        <Slider
          value={volume}
          onChange={handleVolumeChange}
          aria-labelledby="continuous-slider"
          style={{ width: "200px" }}
        />
      </div>

      {/* Add Overlay Form */}
      <Card
        className="overlay-form"
        style={{ marginTop: "20px", padding: "10px", maxWidth: "600px" }}
      >
        <Typography variant="h6">Add Overlay</Typography>
        <TextField
          label="Overlay Type"
          select
          value={overlayType}
          onChange={(e) => setOverlayType(e.target.value)}
          SelectProps={{ native: true }}
          style={{ marginBottom: "10px", marginTop: "10px", width: "200px" }}
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </TextField>
        {overlayType === "text" ? (
          <>
            <TextField
              label="Overlay Text"
              fullWidth
              value={newOverlay.content.value}
              onChange={(e) =>
                setNewOverlay({
                  ...newOverlay,
                  content: { ...newOverlay.content, value: e.target.value },
                })
              }
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="Background Color"
              type="color"
              value={newOverlay.content.bgColor || "#ffffff"}
              onChange={(e) =>
                setNewOverlay({
                  ...newOverlay,
                  content: { ...newOverlay.content, bgColor: e.target.value },
                })
              }
              style={{
                marginBottom: "10px",
                width: "150px",
                paddingLeft: "10px",
              }}
            />
            <TextField
              label="Text Color"
              type="color"
              value={newOverlay.content.textColor || "#000000"}
              onChange={(e) =>
                setNewOverlay({
                  ...newOverlay,
                  content: { ...newOverlay.content, textColor: e.target.value },
                })
              }
              style={{
                marginBottom: "10px",
                width: "150px",
                paddingLeft: "10px",
              }}
            />
          </>
        ) : (
          <TextField
            label="Image URL"
            fullWidth
            value={newOverlay.content.value}
            onChange={(e) =>
              setNewOverlay({
                ...newOverlay,
                content: { ...newOverlay.content, value: e.target.value },
              })
            }
            style={{ marginBottom: "10px" }}
          />
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleOverlaySubmit}
          sx={{ marginLeft: "10px" }}
        >
          Add Overlay
        </Button>
      </Card>

      {/* Display current overlays */}
      <Card
        className="overlay-list"
        style={{
          marginTop: "20px",
          padding: "10px",
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
        fullWidth
      >
        <Typography variant="h6">Current Overlays</Typography>
        {overlays.length === 0 && (
          <Typography>No overlays available</Typography>
        )}
        {overlays.map((overlay) => (
          <Card
            key={overlay._id}
            className="overlay-item"
            fullWidth
            style={{
              marginTop: "20px",
              padding: "10px",
              width: "100%",
              maxWidth: "200px",
            }}
          >
            <Typography>
              {overlay.content.type === "text"
                ? overlay.content.value
                : "Image Overlay"}
            </Typography>
            <IconButton onClick={() => handleDeleteOverlay(overlay._id)}>
              <Delete />
            </IconButton>
          </Card>
        ))}
      </Card>
      <Typography
        variant="h6"
        sx={{
          marginBottom: "20px",
          marginTop: "40px",
          textDecoration: "underline",
        }}
      >
        Created By: Sarvadaman Singh
      </Typography>
    </div>
  );
};

export default App;
