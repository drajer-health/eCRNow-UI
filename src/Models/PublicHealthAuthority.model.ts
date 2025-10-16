export interface FormInputGroupProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  isInvalid?: boolean;
  feedback?: string;
  type?: string;
  required?: boolean;
  as?: React.ElementType;
  rows?: number;
  min?: number;
}

export interface RadioOption {
  id: string;
  value: string;
  label: string;
}

export interface FormRadioGroupProps {
  label: string;
  name: string;
  value: string;
  options: RadioOption[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isInvalid?: boolean;
  feedback?: string;
  required?: boolean;
  inline?: boolean;
}

export interface FormButtonGroupProps {
  label: string;
  onClick: () => void;
  type?: "button" | "submit";
  className?: string;
}

export interface PublicHealthAuthorityProps {
  selectedPublicHealthAuthority?: any;
  addNewHealthAuthority?: boolean | { addNewHealthAuthority: boolean };
}