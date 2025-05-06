export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  autohide: boolean;
  delay: number;
}
