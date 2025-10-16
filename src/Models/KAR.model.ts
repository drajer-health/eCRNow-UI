// Define types for props
export interface KARProps {
  navigate: (path: string) => void;
}

// Define types for each KAR table row
export interface KARDetail {
  karId: string;
  karName: string;
  karPublisher: string;
  karVersion: string;
}

// Define types for state
export interface KARState {
  isSaved: boolean;
  validated: boolean;
  karRetrieved: boolean;
  details: KARDetail[];
  repoName?: string;
  fhirServerURL?: string;
}
