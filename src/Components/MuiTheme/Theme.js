import { createTheme } from "@mui/material";

export const theme = createTheme({
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

export const filterTheme = createTheme({
    palette: {
        primary: {
            main: "#CFCFCF",
            contrastText: "#fff"
        },
        secondary: {
            main: "#B1A5FA",
            contrastText: "#fff"
        }
    },

    mark: {
        color: "red"
      }
});