import { useAuthStore } from "@/stores/AuthStore";

export type NamedUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type UserNamePart =
  | "fullname"
  | "firstname"
  | "lastname"
  | "initial"
  | "username";

const FALLBACK_NAME = "";

export const currentUserName = (
  part: UserNamePart = "fullname",
  user: NamedUser | null | undefined = useAuthStore.getState().user,
): string => {
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || FALLBACK_NAME;

  switch (part) {
    case "firstname":
      return firstName || FALLBACK_NAME;
    case "lastname":
      return lastName || FALLBACK_NAME;
    case "username":
      return user?.email?.split("@")[0] || FALLBACK_NAME;
    case "initial":
      return (
        fullName
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((namePart) => namePart.charAt(0).toUpperCase())
          .join("") || "U"
      );
    case "fullname":
    default:
      return fullName;
  }
};