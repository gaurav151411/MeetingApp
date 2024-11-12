import React from "react";
import useAR from "../hooks/useAR";

const ARComponent = () => {
  const { arVideoTrack, setIsFormalOverlay } = useAR({
    height: 720,
    width: 1280,
    frameRate: 30,
  });

  return (
    <div>
      <video
        autoPlay
        muted
        playsInline
        ref={(video) => {
          if (video && arVideoTrack) {
            video.srcObject = new MediaStream([arVideoTrack]);
          }
        }}
        style={{
          width: "100%",
          height: "auto",
          background: "black",
        }}
      ></video>
      
      <button
        onClick={() => setIsFormalOverlay((prev) => !prev)}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Try on Formal
      </button>
    </div>
  );
};

export default ARComponent;
