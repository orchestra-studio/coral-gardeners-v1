"use client";

import React from "react";
import UsersHeader from "@/features/dashboard/users/components/UsersHeader";
import UsersContent from "@/features/dashboard/users/UsersContent";

export default function DeletedUsersPage() {
  return (
    <>
      <UsersHeader type="deleted" />
      <UsersContent type="deleted" />
    </>
  );
}
