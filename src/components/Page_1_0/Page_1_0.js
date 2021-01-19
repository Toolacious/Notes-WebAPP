import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Header from "./Header";
import Main from "./Main";
import { filecontext } from "../../context/filetree";
import { AvatarContext } from "../../context/avatarContext";
import { useQuery } from "@apollo/react-hooks";
import { NOTES_QUERY } from "../../graphql/notes";
import { AVATAR_QUERY } from "../../graphql/getAvatar";
import { AuthContext } from "../../routes/auth";

import PersistentDrawerLeft from "./LeftDrawer";
import PersistentDrawerRight from "./RightDrawer";
import TagBar from "./TagBar";

import { FileActions } from "./FileActions";
import { mainContext } from "../../context/mainContext";

import Loading from "../../routes/loading";

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
    const {
        user: { email, userId: id },
    } = useContext(AuthContext);
    const [mode, setMode] = useState("search");
    const [open, setOpen] = useState(false);
    const [searchStr, setSearchStr] = useState("");

    const { loading, error, data } = useQuery(NOTES_QUERY, {
        variables: { email },
    });

    const { loading: ava_loading, error: ava_error, data: ava_data } = useQuery(
        AVATAR_QUERY,
        {
            variables: { id },
        }
    );
    const [avatar, setAvatar] = useState("");
    useEffect(() => {
        if (!ava_loading && !ava_error) {
            setAvatar(ava_data.userAvatar);
        }
        return () => {};
    }, [ava_loading]);

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

    return loading || ava_loading ? (
        <div color="blue">
            <Loading type="spinningBubbles" color="ffffff" />
        </div>
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
                    <AvatarContext.Provider value={{ avatar, setAvatar }}>
                        <Header />
                    </AvatarContext.Provider>
                    <mainContext.Provider
                        value={{
                            mode,
                            setMode,
                            open,
                            setOpen,
                            searchStr,
                            setSearchStr,
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
