import React, { createContext, useContext, ReactNode, useState } from 'react';

// Define the possible profile states.
type ProfileState = 'my_profile' | 'friend_profile' | 'not_friend';

// interface ProfileContextType {
//   profileState: ProfileState;
//   setProfileState: (newState: ProfileState) => void;
// }

const ProfileContext = createContext<ProfileState | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profileState, setProfileState] = useState<ProfileState>('my_profile');

  return (
    <ProfileContext.Provider value={{ profileState, setProfileState }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
