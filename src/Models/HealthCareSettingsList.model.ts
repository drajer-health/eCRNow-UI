// types for props
export type AddNewHealthCareHandler = (options: { addNewHealthCare: boolean }) => void;
export interface HealthCareSettingsListProps {
  navigate: (path: string) => void;
  addNewHealthCare: AddNewHealthCareHandler
  selectedHealthCareSettings: (data: HealthCareSetting) => void;
}

// types for state
export interface HealthCareSettingsListState {
  details: HealthCareSetting[];
}

export interface HealthCareSetting {
  id: string | number;
  clientId: string;
  fhirServerBaseURL: string;
  authType: string;
}