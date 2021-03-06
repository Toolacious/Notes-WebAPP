import React from "react";
import { Switch } from "react-router-dom";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import AuthRoute from "./authRoute";
import ProtectRoute from "./protectRoute";
import Page_1_0 from "../components/Page_1_0/Page_1_0";
function Routes() {
    return (
        <Switch>
            <AuthRoute exact path="/" component={SignIn} />
            <AuthRoute exact path="/login" component={SignIn} />
            <AuthRoute exact path="/signup" component={SignUp} />
            <ProtectRoute exact path="/dashboard" component={Page_1_0} />
        </Switch>
    );
}

export default Routes;
