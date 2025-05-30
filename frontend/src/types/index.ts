/**
 * TypeScript type definitions for the frontend application
 * These types match the GraphQL schema from the backend
 */

export enum CityEnum {
  TEL_AVIV = 'TEL_AVIV',
  JERUSALEM = 'JERUSALEM',
  HAIFA = 'HAIFA',
  BEER_SHEVA = 'BEER_SHEVA',
  NETANYA = 'NETANYA'
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  city: CityEnum;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  birthDate: string;
  city: CityEnum;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  city?: CityEnum;
}

/**
 * City display names for the UI
 */
export const CITY_DISPLAY_NAMES: Record<CityEnum, string> = {
  [CityEnum.TEL_AVIV]: 'Tel Aviv',
  [CityEnum.JERUSALEM]: 'Jerusalem',
  [CityEnum.HAIFA]: 'Haifa',
  [CityEnum.BEER_SHEVA]: 'Beer Sheva',
  [CityEnum.NETANYA]: 'Netanya'
};

/**
 * Form validation types
 */
export interface FormErrors {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  city?: string;
}

/**
 * Component props types
 */
export interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  loading?: boolean;
}

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
} 