import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: "#CFCFCF",
            contrastText: "#fff"
        },
        secondary: {
            main: "#8673FA",
            contrastText: "#fff"
        }
    },

    mark: {
        color: "red"
      }
});

export default theme;