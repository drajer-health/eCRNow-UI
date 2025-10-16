// Define props type
export interface PublicHealthAuthorityListProps {
  navigate: (path: string) => void;
  addNewPublicHealthAuthority: (arg: any) => void;
  selectedPublicHealthAuthority: (arg: any) => void;
}

// Define state type
export interface PublicHealthAuthorityListState {
  details: {
    id: number;
    clientId: string;
    fhirServerBaseURL: string;
    authType: string;
  }[];
}
