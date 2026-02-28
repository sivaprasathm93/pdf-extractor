/**
 * Shared TypeScript types for PDF Extractor
 */

/** A single parsed transaction row */
export interface Transaction {
    date: string
    details: string
    cheque: string
    debit: string
    credit: string
    balance: string
}

/** Snackbar notification state */
export interface SnackbarState {
    open: boolean
    message: string
}

/** Backend upload response */
export interface UploadResponse {
    success: boolean
    data: Transaction[]
    count: number
    filename: string
    preview_url?: string
    password_required?: boolean
    error?: string
}
