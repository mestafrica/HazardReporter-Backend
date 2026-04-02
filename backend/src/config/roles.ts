export const roles = [
  {
    role: "admin",
    permissions: [
      "read_users",
      "create_user",
      "update_user",
      "delete_user",
      "view_reports",
    ],
  },
  {
    role: "user",
    permissions: ["update_user", "delete_user"],
  },
];
