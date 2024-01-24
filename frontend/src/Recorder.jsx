import React, { useState, useRef } from "react";
import axios from "axios";

const Recorder = ({ addRecording }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingName, setRecordingName] = useState("Session Name");
  const [count, setCount] = useState(1);
  const mediaRecorderRef = useRef(null);
  const startTimeRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstart = () => {
          startTimeRef.current = Date.now();
        };

        mediaRecorder.onstop = async () => {
          const endTime = Date.now();
          const durationInSeconds = Math.round((endTime - startTimeRef.current) / 1000);

          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          const formData = new FormData();
          formData.append("recording", blob, "recording.webm");

          try {
            const response = await axios.post(
              "http://localhost:3001/api/upload",
              formData
            );

            // Create a new recording object
            const newRecording = {
              name: recordingName + count.toLocaleString(),
              timestamp: new Date().toLocaleString(),
              length: formatRecordingLength(durationInSeconds),
              status: response.data.status, // Updated status from the server
              videoUrl: URL.createObjectURL(blob),
            };

            // Add the new recording to the list
            addRecording(newRecording);
            setCount(count + 1);
          } catch (error) {
            console.error("Error uploading recording:", error);
          }

          chunksRef.current = [];
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
      })
      .catch((error) => {
        console.error("Error accessing camera and microphone:", error);
      });
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const formatRecordingLength = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div>
      <div>
        <label>Recording Name:</label>
        <input
          type="text"
          value={recordingName}
          onChange={(e) => setRecordingName(e.target.value)}
        />
      </div>
      <div>
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
      <div>
        {isRecording && <video autoPlay muted style={{ maxWidth: "100%" }} />}
      </div>
    </div>
  );
};

export default Recorder;
