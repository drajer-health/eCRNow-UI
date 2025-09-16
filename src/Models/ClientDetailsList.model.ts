// Define the shape of a single client detail
export interface ClientDetail {
  id: number;
  clientId: string;
  fhirServerBaseURL: string;
  isDirect: boolean;
  isRestAPI: boolean;
  isXdr: boolean;
}

// Define props passed to this component

export type AddNewClientHandler = (options: { addNew: boolean }) => void;
export interface ClientDetailsListProps {
  addNew: AddNewClientHandler;
  selectedClientDetails: (client: ClientDetail) => void;
  navigate?: (path: string) => void;
}

// Define the component's internal state
export interface ClientDetailsListState {
  details: ClientDetail[];
}
