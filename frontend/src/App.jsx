import React, { useState } from "react";
import RecordingsList from "./RecordingsList";
import Recorder from "./Recorder";

const App = () => {
  const [recordings, setRecordings] = useState([]);

  const addRecording = (recording) => {
    setRecordings([...recordings, recording]);
  };

  return (
    <div>
      <h1>Therapist Recordings</h1>
      <Recorder addRecording={addRecording} />
      <RecordingsList recordings={recordings} />
    </div>
  );
};

export default App;
