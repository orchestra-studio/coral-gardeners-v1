import Image from "next/image";
import { UserData } from "../types";

interface UserProfileProps {
  userData: UserData;
}

export default function UserProfile({ userData }: UserProfileProps) {
  return (
    <div className="px-4 py-3 border-b border-[var(--border)]">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-[var(--border)] flex items-center justify-center bg-[var(--surface-hover)] overflow-hidden flex-shrink-0">
          {userData.avatar ? (
            <Image
              src={userData.avatar}
              alt={`${userData.name} avatar`}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-[var(--text)]">
              {userData.initials}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-[var(--text)] text-start truncate">
            {userData.name || userData.email}
          </div>
          {userData.email && (
            <div className="text-sm text-[var(--text-muted)] text-start truncate">
              {userData.email}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
