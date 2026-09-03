import React from "react";
import {
    Navigate,
    Outlet,
} from "react-router-dom";

import { useAuthStore } from "../../store/auth.store";

interface RoleRouteProps {
    allowedRoles: Array<"admin" | "agent">;
}

const RoleRoute: React.FC<RoleRouteProps> = ({
    allowedRoles,
}) => {
    const user = useAuthStore(
        (state) => state.user
    );

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }
    console.log("User role:", user.role);
    if (!allowedRoles.includes(user.role)) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return <Outlet />;
};

export default RoleRoute;