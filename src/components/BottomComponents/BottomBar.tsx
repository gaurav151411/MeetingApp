import { Button, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import { useContext } from "react";
import { ConferenceContext } from "src/context/ConferenceContext";
// import ARComponent  from "../ARComponent"
// import { useTray } from "../../hooks/useTray";
import ButtonTray from "./ButtonTray";

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     bottom_bar: {
//       background: "#EDEDEDd",
//       // height: "12vh",
//       bottom: 20,
//       // overflow: "auto",
//       position: "fixed",
//       alignItems: "center",
//       padding: theme.spacing(2),
//       zIndex: 10,
//     },

//     ar_button: {
//       width: "100%",
//       height: "54px",
//       // position: "absolute",
//       // left: "80px",
//       background: "#2F4F4F",
//       borderRadius: "16px",

//       alignItems: "center",
//       "&:hover": {
//         color: "black",
//         background: "#097969",
//       },
//     },
//     text: {
//       fontFamily: "Noto Sans JP",
//       fontStyle: "normal",
//       fontWeight: 500,
//       fontSize: "26px",
//       lineHeight: "52px",
//       textAlign: "center",

//       color: "#A4A4A4",
//     },
//     // bottom_bar: {
//     //   // background: "#EDEDEDd",
//     //   background: "green",
//     //   height: "80px",
//     //   overflow: "auto",
//     //   // position: "absolute",
//     //   // bottom: "-90px",
//     //   // left: 0,
//     //   // bottom: "80px",
//     //   // marginTop: "0px",
//     //   alignItems: "center",
//     // },
//   })
// );

const BottomBar = () => {
  const { usingAR, usingGesture, usingTrainedGesture, webcam, toggle } =
    useContext(ConferenceContext);
  const isHost = true;
  // const [ar_text, usingAR_text] = useState(false);
  const theme = useTheme();
  // const ar_button = () => {
  //   usingAR_text(!ar_text);
  // };

  return (
    <Grid
      container
      spacing={4}
      sx={{
        bottom: 20,
        // overflow: "auto",
        position: "fixed",
        alignItems: "center",
        padding: theme.spacing(2),
        zIndex: 10,
      }}
      direction="row"
    >
      {/* <ARComponent/> */}
      
      <Grid item sx={{ display: { xs: "none", md: "block" } }} md={1} lg={2} />
      {isHost ? (
        <Grid item container xs={7} sm={4} md={3} lg={2} direction="row">
          <Grid item xs={4}>
            <Button
              variant="contained"
              color={usingAR ? "success" : "primary"}
              sx={{ height: "100%" }}
              disabled={!webcam}
              onClick={() => toggle("usingAR")}
            >
              <Typography>
                AR
                {/* {usingAR ? "Stop AR" : "Start AR"} */}
              </Typography>
            </Button>
          </Grid>

          <Grid item xs={4}>
            <Button
              sx={{ height: "100%" }}
              variant="contained"
              color={usingGesture ? "success" : "primary"}
              onClick={() => toggle("usingGesture")}
              disabled={!webcam}
            >
              <Typography>
                Ges
                {/* {usingGesture ? "Stop Gesture" : "Start Gesture"} */}
              </Typography>
            </Button>
          </Grid>

          <Grid item xs={4}>
            <Button
              variant="contained"
              color={usingTrainedGesture ? "success" : "primary"}
              sx={{ height: "100%" }}
              disabled={!webcam}
              onClick={() => toggle("usingTrainedGesture")}
            >
              <Typography>
                Train Ges
                {/* {usingTrainedGesture
                  ? "Stop Trained Gesture"
                  : "Start Trained Gesture"} */}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      ) : null}
      <Grid item container xs={12} sm={8} md={7} lg={5}>
        <ButtonTray />
      </Grid>
    </Grid>
  );
};

export default BottomBar;
