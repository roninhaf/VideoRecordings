import React from "react";

const RecordingsList = ({ recordings }) => {
  return (
    <div>
      <h2>Recordings List:</h2>
      <ul>
        {recordings.map((recording, index) => (
          <li key={index}>
            <div>
              {recording.audioUrl && (
                  <audio controls>
                  <source src={recording.audioUrl} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
            <div>
              {recording.videoUrl && (
                  <video controls>
                  <source src={recording.videoUrl} type="video/webm" />
                  Your browser does not support the video element.
                </video>
              )}
            </div>
              <strong>{recording.name}</strong> - recorded on {recording.timestamp}; 
              length is {recording.length}; status: {recording.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordingsList;
