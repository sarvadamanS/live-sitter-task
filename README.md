# Live Stream App

This project is a live stream app that combines a React front end with a Flask back end. The app allows users to manage RTSP video streams and overlay content on top of the video.

## Features

- Start and stop live streams using RTSP URLs.
- Add text or image overlays to the live stream.
- Drag and resize overlays to customize the appearance.
- Play, pause, and control the stream volume.
- Manage overlays through a simple interface.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [Python](https://www.python.org/) (version 3.9 or higher)
- [Flask](https://flask.palletsprojects.com/) (installed via `requirements.txt`)
- [Vite](https://vitejs.dev/) (for the React front end)

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-repository/live-stream-app.git
   cd live-stream-app
   ```

2. Install the required dependencies for both the front end (React) and the back end (Flask).

   For the front end (React):

   ```bash
   cd frontend
   npm install
   ```

   For the back end (Flask):

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Running the Application

You can start both the front end and back end simultaneously with the following command:

```bash
npm run start
```
