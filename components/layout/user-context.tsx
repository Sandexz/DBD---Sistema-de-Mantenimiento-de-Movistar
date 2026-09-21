"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "NOC" | "SUPERVISOR" | "FIELD";

interface UserProfile {
  role: UserRole;
  name: string;
  id: string;
  roleLabel: string;
  organization: string;
}

interface UserContextType {
  profile: UserProfile;
  setRole: (role: UserRole) => void;
}

const profilesMap: Record<UserRole, UserProfile> = {
  NOC: {
    role: "NOC",
    name: "Ing. Luis Valdivia",
    id: "NOC-9912",
    roleLabel: "Ingeniero NOC Central",
    organization: "Movistar Perú",
  },
  SUPERVISOR: {
    role: "SUPERVISOR",
    name: "Ing. Carlos Mendoza",
    id: "SUP-041",
    roleLabel: "Supervisor de Infraestructura",
    organization: "Movistar Planta Externa",
  },
  FIELD: {
    role: "FIELD",
    name: "Luis Ramos",
    id: "TEC-ALFA-01",
    roleLabel: "Técnico de Campo (Líder)",
    organization: "Lari Contratistas (Contrata)",
  },
};

const UserContext = createContext<UserContextType>({
  profile: profilesMap.NOC,
  setRole: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [role, setCurrentRole] = useState<UserRole>("NOC");

  useEffect(() => {
    const saved = localStorage.getItem("sgmr_user_role") as UserRole;
    if (saved && profilesMap[saved]) {
      setCurrentRole(saved);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    localStorage.setItem("sgmr_user_role", newRole);
  };

  return (
    <UserContext.Provider value={{ profile: profilesMap[role], setRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserContext);
}
