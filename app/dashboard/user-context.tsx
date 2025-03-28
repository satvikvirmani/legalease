"use client";

import React from "react";
import type { User } from "@supabase/supabase-js";

// Create a userContext with a default shape
export const userContext = React.createContext<{
    user: User | null;
    updateUser: (user: Partial<User>) => void;
}>({
    user: null,
    updateUser: () => {},
});