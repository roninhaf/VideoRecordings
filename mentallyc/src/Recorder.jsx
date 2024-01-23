import React, { useState, useRef } from "react";
import axios from "axios";

const Recorder = ({ addRecording }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingName, setRecordingName] = useState("Session Name");
  const [count, setCount] = useState(1);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const videoRef = useRef(null);
  const newRecording = {};

  const startRecording = () => {
    const recordingStartTime = new Date().getTime();

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const lengthInSeconds = Math.round(
            (new Date().getTime() - recordingStartTime) / 1000
          );

          newRecording = {
            name: recordingName + count.toLocaleString(),
            timestamp: new Date().toLocaleString(),
            length: formatRecordingLength(lengthInSeconds),
            status: "",
            videoUrl: url,
          };

          addRecording(newRecording);
          chunksRef.current = [];
          setCount(count + 1);
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
      })
      .catch((error) => {
        console.error("Error accessing camera and microphone:", error);
      });
  };

  const stopRecording = async () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);

    const blob = new Blob(chunksRef.current, { type: "video/webm" });
    const formData = new FormData();
    formData.append("recording", blob, "recording.webm");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/upload",
        formData
      );
        console.log(newRecording);
      // Simulate updating the recording status after processing
      const updatedRecording = {
        ...newRecording,
        status: response.data.status,
      };
      addRecording(updatedRecording);
    } catch (error) {
      console.error("Error uploading recording:", error);
    }

    chunksRef.current = [];
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
          onChange={(e) => setRecordingName(e.target.value + 1)}
        />
      </div>
      <div>
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
      <div>
        {isRecording && (
          <video ref={videoRef} autoPlay muted style={{ maxWidth: "100%" }} />
        )}
      </div>
    </div>
  );
};

export default Recorder;
