import Image from "next/image";
import { UserData } from "../types";

interface UserAvatarProps {
  userData: UserData;
}

export default function UserAvatar({ userData }: UserAvatarProps) {
  return (
    <div className="h-6 w-6 rounded-full border-2 border-[var(--border)] flex items-center justify-center bg-[var(--surface-hover)] overflow-hidden">
      {userData.avatar ? (
        <Image
          src={userData.avatar}
          alt={`${userData.name} avatar`}
          width={24}
          height={24}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-[10px] font-medium text-[var(--text)]">
          {userData.initials}
        </span>
      )}
    </div>
  );
}
