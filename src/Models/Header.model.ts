// Define the prop types (adjust as needed)
export interface HeaderProps {
  bypassAuth?: boolean; // or more specific type if applicable
}

// Define the state types
export interface HeaderState {
  appName: string;
  appDesc: string;
  isMenuOpen: boolean;
  // If you're using currentPath in the updateHeader logic, uncomment below
  // currentPath?: string;
}

// Define the shape of each item in menuData
export interface MenuItem {
  path: string;
  label: string;
  authRequired?: boolean;
}
