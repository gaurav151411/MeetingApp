import { useContext, useEffect, useRef, useState } from "react";
import { ConferenceContext } from "src/context/ConferenceContext";
import { World } from "src/three/World";
import StreamMerger from "src/utils/StreamMerger";
import { Object3D } from "three";
import { useWebcam } from "./useWebcam";

const useAR = (
  canvas: {
    height: number;
    width: number;
    frameRate: number;
  },
  createControls?: (object: Object3D) => void
) => {
  const arCanvasEl = useRef<HTMLCanvasElement>(
    document.createElement("canvas")
  );
  const arWorld = useRef<World>();
  const [arVideoTrack, setARVideoTrack] = useState<MediaStreamTrack>();

  const {
    usingAR,
    modelName,
    setWebcam,
    setStream,
    setShowCORSInfo,
  } = useContext(ConferenceContext);

  const { webcamVideoTracks } = useWebcam({
    ...canvas,
  });

  // State to control formal shirt overlay
  const [isFormalOverlay, setIsFormalOverlay] = useState(false);

  useEffect(() => {
    arCanvasEl.current.height = canvas.height;
    arCanvasEl.current.width = canvas.width;
    arCanvasEl.current.style.height = `${canvas.height}px`;
    arCanvasEl.current.style.width = `${canvas.width}px`;

    arWorld.current = new World(
      arCanvasEl.current,
      true,
      createControls ? createControls : undefined
    );

    arWorld.current?.init().then(() => {
      // Optionally load initial models if required
    });
  }, []);

  useEffect(() => {
    const streamMerger = new StreamMerger({
      height: canvas.height,
      width: canvas.width,
      frameRate: canvas.frameRate,
    });

    if (webcamVideoTracks) {
      const webcamStream = new MediaStream(webcamVideoTracks);
      arWorld.current?.stop();
      if (!usingAR) {
        streamMerger?.addStream(webcamStream);
      } else {
        arWorld.current?.setWebcamStream(webcamStream);
        arWorld.current?.start();
        streamMerger?.addStream(webcamStream);
        streamMerger?.addCanvas(arCanvasEl.current);
      }
    } else {
      setWebcam(false);
    }
    streamMerger.cleanupAudioTracks();
    streamMerger?.start();

    if (streamMerger.result?.getVideoTracks()) {
      setARVideoTrack(streamMerger?.result?.getVideoTracks()[0]);
    }

    return () => {
      streamMerger.stop();
      arWorld.current?.stop();
    };
  }, [canvas.height, canvas.width, setStream, usingAR, webcamVideoTracks]);

  // Effect to load/unload the shirt model based on overlay state
  useEffect(() => {
    if (isFormalOverlay) {
      arWorld.current
        ?.loadGithubGLBModels("formal_shirt_model") // Load the shirt model here
        .then(() => {
          setShowCORSInfo(false);
        })
        .catch((err) => {
          setShowCORSInfo(true);
        });
    } else {
      arWorld.current?.removeModel("formal_shirt_model"); // Unload model if overlay is off
    }
  }, [isFormalOverlay]);

  return { arVideoTrack, setIsFormalOverlay }; // Expose setIsFormalOverlay for button interaction
};

export default useAR;
