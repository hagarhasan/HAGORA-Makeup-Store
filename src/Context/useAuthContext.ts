import { useContext } from "react";

import { AuthContext, type AuthContextType } from "./authContextStore";

export function useAuthContext(): AuthContextType {
    return useContext(AuthContext);
}
