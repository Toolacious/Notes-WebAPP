import React, { useContext, useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import GitHubIcon from "@material-ui/icons/GitHub";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import Header from "./Header";
import MainFeaturedPost from "./MainFeaturedPost";
import FeaturedPost from "./FeaturedPost";
import Main from "./Main";
import { filecontext } from "../../context/filetree";
import { useQuery } from "@apollo/react-hooks";
import { NOTES_QUERY } from "../../graphql/notes";
import { AuthContext } from "../../routes/auth";

import PersistentDrawerLeft from "./LeftDrawer";
import PersistentDrawerRight from "./RightDrawer";
import TagBar from "./TagBar";

import { FileActions } from "./FileActions";
import { mainContext } from "../../context/mainContext";

const useStyles = makeStyles((theme) => ({
    mainGrid: {
        marginTop: theme.spacing(3),
    },
    pageContainer: {
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
    },
}));

export default function Page_1_0() {
    const classes = useStyles();
    const context = useContext(AuthContext);
    const [mode, setMode] = useState("search");
    const [open, setOpen] = useState(false);
    const [searchStr, setSearchStr] = useState("");
    const ref = useRef(null);
    const handleRef = (tag) => {
        try {
            ref.current.value = "tags: " + tag;
            ref.current.focus();
        } catch (err) {
            console.log(err);
        }
    };

    const { loading, error, data, subscribeToMore } = useQuery(NOTES_QUERY, {
        variables: { email: context.user.email },
    });
    //const [usernotes, setuserNotes] = useState([]);
    const {
        usernotes,
        openFiles,
        currentOpenFile,
        setcurrentOpenFile,
        setuserNotes,
        setopenFiles,
        actions,
    } = FileActions({ usernotes: [], openFiles: [], currentOpenFile: "" });

    useEffect(() => {
        if (!loading && !error) {
            setuserNotes(data.usernotes);
        }
    }, [loading, data, error]);

    return loading ? (
        <>loading...</>
    ) : (
        <React.Fragment>
            <CssBaseline />
            <Container
                maxWidth={false}
                disableGutters={true}
                className={classes.pageContainer}
            >
                <filecontext.Provider
                    value={{
                        usernotes,
                        openFiles,
                        currentOpenFile,
                        setcurrentOpenFile,
                        setuserNotes,
                        setopenFiles,
                        actions,
                    }}
                >
                    <Header />
                    <mainContext.Provider
                        value={{
                            mode,
                            setMode,
                            open,
                            setOpen,
                            searchStr,
                            setSearchStr,
                            ref,
                            handleRef,
                        }}
                    >
                        <main
                            style={{
                                display: "flex",
                                flexGrow: 1,
                                alignItems: "stretch",
                            }}
                        >
                            <PersistentDrawerLeft></PersistentDrawerLeft>
                            <div
                                style={{
                                    display: "flex",
                                    flexGrow: 1,
                                    flexDirection: "column",
                                    alignItems: "stretch",
                                }}
                            >
                                <Main></Main>
                                <TagBar></TagBar>
                            </div>
                            <PersistentDrawerRight></PersistentDrawerRight>
                        </main>
                    </mainContext.Provider>
                </filecontext.Provider>
            </Container>
        </React.Fragment>
    );
}
