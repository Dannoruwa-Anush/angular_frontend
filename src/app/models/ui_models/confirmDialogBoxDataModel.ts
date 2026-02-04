export interface ConfirmDialogBoxDataModel {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;

  // input support
  inputConfig?: {
    placeholder?: string;
    required?: boolean;
    type?: 'text' | 'password';
  };

  // radio btn support
  radioConfig?: {
    options: {
      label: string;
      value: any;
    }[];
    required?: boolean;
  };
}