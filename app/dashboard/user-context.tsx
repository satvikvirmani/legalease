"use client";

import { createContext } from "react";
import { User } from "@supabase/supabase-js";

const userContext = createContext<User | null>(null);

export { userContext };