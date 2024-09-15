from flask import Flask, request, jsonify, Response ,send_from_directory, render_template
import os
import cv2
import logging
import json
from flask_cors import CORS

logging.basicConfig(level=logging.INFO)

app = Flask(__name__, static_folder="../frontend/dist", template_folder="../frontend/dist")
CORS(app)

# In-memory storage for overlays
overlays_storage = []
overlays_file = "overlays.txt"  # File to save overlay data
rtsp_stream = None
video_capture = None
is_paused = False


# Serve React app
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

# Serve static files (CSS, JS, etc.)
@app.route('/<path:path>')
def static_proxy(path):
    # serve other static files from dist folder
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
    
# Load overlays from the text file when the server starts
def load_overlays():
    global overlays_storage
    try:
        with open(overlays_file, 'r') as f:
            overlays_storage = json.load(f)
    except FileNotFoundError:
        overlays_storage = []
    except json.JSONDecodeError:
        overlays_storage = []

# Save overlays to the text file
def save_overlays():
    with open(overlays_file, 'w') as f:
        json.dump(overlays_storage, f, indent=4)

# Route to serve the RTSP video feed
@app.route('/video_feed')
def video_feed():
    global video_capture, is_paused
    rtsp_url = request.args.get("rtsp_url", None)
    
    # Check if video_capture is None or not opened, then initialize it
    if rtsp_url and (video_capture is None or not video_capture.isOpened()):
        video_capture = cv2.VideoCapture(rtsp_url)
    
    def generate():
        global video_capture, is_paused
        while True:
            if is_paused:
                continue  # Skip frames when paused
            success, frame = video_capture.read()
            if not success:
                break
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Route to pause the stream (Stop temporarily)
@app.route('/pause_stream', methods=['POST'])
def pause_stream():
    global is_paused
    is_paused = True  # Set the paused state to True
    return jsonify({"message": "Stream paused"}), 200

# Route to resume the stream
@app.route('/resume_stream', methods=['POST'])
def resume_stream():
    global is_paused
    is_paused = False  # Set the paused state to False
    return jsonify({"message": "Stream resumed"}), 200

# Route to stop the stream and release resources
@app.route('/stop_stream', methods=['POST'])
def stop_stream():
    global video_capture, is_paused
    if video_capture:
        video_capture.release()  # Release the video capture object
        video_capture = None  # Reset the global object
    is_paused = False  # Reset the paused state
    return jsonify({"message": "Stream stopped"}), 200

# CRUD for Overlays using in-memory storage
@app.route('/overlay', methods=['POST'])
def add_overlay():
    overlay_data = request.get_json()
    overlay_id = len(overlays_storage) + 1  # Simple ID generation
    overlay_data["_id"] = overlay_id
    overlays_storage.append(overlay_data)
    save_overlays()  # Save data to file after adding a new overlay
    return jsonify({"message": "Overlay added successfully!", "overlay_id": overlay_id}), 201

# Read all overlays
@app.route('/overlay', methods=['GET'])
def get_overlays():
    load_overlays()  # Load data from file when reading overlays
    return jsonify(overlays_storage), 200

# Update overlay position/size/content
@app.route('/overlay/<int:overlay_id>', methods=['PUT'])
def update_overlay(overlay_id):
    update_data = request.get_json()
    for overlay in overlays_storage:
        if overlay["_id"] == overlay_id:
            overlay.update(update_data)
            save_overlays()  # Save the new overlay position to the file
            return jsonify({"message": "Overlay updated successfully!"}), 200
    return jsonify({"message": "Overlay not found"}), 404


# Delete an overlay
@app.route('/overlay/<int:overlay_id>', methods=['DELETE'])
def delete_overlay(overlay_id):
    global overlays_storage
    overlays_storage = [overlay for overlay in overlays_storage if overlay["_id"] != overlay_id]
    save_overlays()  # Save data to file after deleting
    return jsonify({"message": "Overlay deleted successfully!"}), 200

if __name__ == '__main__':
    load_overlays()  # Load overlays when the app starts
    app.run(host='0.0.0.0', port=5000, debug=True)
