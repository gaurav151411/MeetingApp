import { VolumeOffRounded, VolumeUpRounded } from "@mui/icons-material";
import { Grid, Icon, Paper, Typography, useTheme } from "@mui/material";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { UIContext } from "src/context/UIContext";

interface VideoPlayerProps {
  isSelfStream: boolean; // Add this to the props interface
  stream: MediaStream | undefined;
  muted: boolean;
  displayName: string;
  style?: React.CSSProperties;
  controls?: boolean;
}

const VideoPlayer: FC<VideoPlayerProps> = ({
  stream,
  muted,
  isSelfStream = false,  // Add default value here
  style,
  displayName = "Unknown",
  controls = true,
}) => {
  const theme = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { themeMode } = useContext(UIContext);

  const audioTimeout = useRef<NodeJS.Timeout>();
  const audioTime = useRef<number>();
  const videoTime = useRef<number>();
  const videoTimeout = useRef<NodeJS.Timeout>();
  const [hideAudio, setHideAudio] = useState(false);
  const [hideVideo, setHideVideo] = useState(true);

  useEffect(() => {
    if (!stream) return;
    const videoTracks = stream.getVideoTracks();
    const audioTracks = stream.getAudioTracks();

    if (videoTracks && videoTracks.length > 0) {
      if (videoRef.current)
        videoRef.current.srcObject = new MediaStream([videoTracks[0]]);
    } else {
      setHideVideo(true);
    }

    if (audioTracks && audioTracks.length > 0) {
      if (audioRef.current)
        audioRef.current.srcObject = new MediaStream([audioTracks[0]]);
    } else {
      setHideAudio(true);
    }
  }, [stream]);

  return (
    <div style={{display: "flex", justifyContent:"space-evenly"}}>
       <Paper
      sx={{
        padding: "10px",
        border: `2px solid ${theme.palette.background.default}`,
        width:"10000px",
      }}
      elevation={8}
      
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          display: !hideVideo ? "block" : "none",
        }}
      >
        <Grid item>
          {/* <video
            playsInline
            muted={true}
            ref={videoRef}
            controls={controls}
            autoPlay
            onTimeUpdate={(ev) => {
              if (videoTime.current) {
                videoTime.current = ev.currentTarget.currentTime;
              }
              setHideVideo(false);
              if (videoTimeout.current) clearTimeout(videoTimeout.current);

              videoTimeout.current = setTimeout(() => {
                setHideVideo(true);
              }, 1000);
            }}
            onCanPlay={() => {
              try {
                videoRef.current?.play();
              } catch (error) {
                console.log(error);
              }
            }}
            style={{
              width: "100%",
              height: "100%",
              ...style,
            }}
            onDoubleClick={(ev) => {
              ev.currentTarget.requestFullscreen();
            }} */}
          {/* /> */}
        </Grid>
      </Grid>

      <Grid
        container
        sx={{
          height: "25em",
          width: "100%",
          background: `${themeMode === "light" ? theme.palette.primary.light : theme.palette.primary.dark}`,
          display: hideVideo ? "block" : "none",
        }}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <Typography color="aliceblue" variant="h2">
            {`Sanskar`}
            {isSelfStream ? null : !hideAudio ? (
              <Icon fontSize="inherit">
                <VolumeUpRounded />
              </Icon>
            ) : (
              <Icon fontSize="inherit">
                <VolumeOffRounded />
              </Icon>
            )}
          </Typography>
        </Grid>
      </Grid>

      <audio
        playsInline
        muted={muted}
        ref={audioRef}
        autoPlay
        onCanPlay={() => {
          try {
            audioRef.current?.play();
          } catch (error) {
            console.log(error);
          }
        }}
      />
    </Paper>
    <Paper
      sx={{
        padding: "10px",
        border: `2px solid ${theme.palette.background.default}`,
         width:"10000px"
      }}
      elevation={8}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          display: !hideVideo ? "block" : "none",
        }}
      >
        <Grid item>
          <video
            playsInline
            muted={true}
            ref={videoRef}
            controls={controls}
            autoPlay
            onTimeUpdate={(ev) => {
              if (videoTime.current) {
                videoTime.current = ev.currentTarget.currentTime;
              }
              setHideVideo(false);
              if (videoTimeout.current) clearTimeout(videoTimeout.current);

              videoTimeout.current = setTimeout(() => {
                setHideVideo(true);
              }, 1000);
            }}
            onCanPlay={() => {
              try {
                videoRef.current?.play();
              } catch (error) {
                console.log(error);
              }
            }}
            style={{
              width: "1000px",
              height: "500px",
              ...style,
            }}
            onDoubleClick={(ev) => {
              ev.currentTarget.requestFullscreen();
            }}
          />
        </Grid>
      </Grid>

      <Grid
        container
        sx={{
          height: "25em",
          width: "100%",
          background: `${themeMode === "light" ? theme.palette.primary.light : theme.palette.primary.dark}`,
          display: hideVideo ? "block" : "none",
        }}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <Typography color="aliceblue" variant="h2">
            {displayName.charAt(0).toUpperCase() + displayName.slice(1)}
            {isSelfStream ? null : !hideAudio ? (
              <Icon fontSize="inherit">
                <VolumeUpRounded />
              </Icon>
            ) : (
              <Icon fontSize="inherit">
                <VolumeOffRounded />
              </Icon>
            )}
          </Typography>
        </Grid>
      </Grid>

      <audio
        playsInline
        muted={muted}
        ref={audioRef}
        autoPlay
        onCanPlay={() => {
          try {
            audioRef.current?.play();
          } catch (error) {
            console.log(error);
          }
        }}
      />
    </Paper>
    </div>
   
  );
};

export default VideoPlayer;
