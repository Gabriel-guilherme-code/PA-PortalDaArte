import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

const ProfileContext = createContext(null);

const WEB_STORAGE_KEY = "pa-portal-da-arte-profile-image";

export function ProfileProvider({ children }) {
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        if (Platform.OS === "web") {
          const savedImage = window.localStorage.getItem(WEB_STORAGE_KEY);

          if (savedImage) {
            setProfileImage(savedImage);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar foto de perfil:", error);
      }
    };

    loadProfileImage();
  }, []);

  const saveProfileImage = async (uri) => {
    try {
      if (!uri) {
        setProfileImage(null);

        if (Platform.OS === "web") {
          window.localStorage.removeItem(WEB_STORAGE_KEY);
        }

        return;
      }

      if (Platform.OS === "web") {
        window.localStorage.setItem(WEB_STORAGE_KEY, uri);
      }

      setProfileImage(uri);
    } catch (error) {
      console.error("Erro ao salvar foto de perfil:", error);
      setProfileImage(uri);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profileImage,
        saveProfileImage,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile deve ser usado dentro de ProfileProvider");
  }

  return context;
}
