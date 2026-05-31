/** Estado retornado por server actions usadas com useActionState. */
export type ActionState = {
  error?: string;
  success?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export type NavItem = {
  label: string;
  href: string;
  exact?: boolean;
};
