/**
 * PasswordDialog — Modal dialog for password-protected PDFs.
 */

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'

interface PasswordDialogProps {
    open: boolean
    password: string
    error: string
    extracting: boolean
    onClose: () => void
    onPasswordChange: (value: string) => void
    onSubmit: () => void
}

export default function PasswordDialog({
    open,
    password,
    error,
    extracting,
    onClose,
    onPasswordChange,
    onSubmit,
}: PasswordDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { borderRadius: 3, minWidth: 400, p: 1 } }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
                <LockIcon color="primary" />
                Password Protected PDF
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    This PDF is password-protected. Please enter the password to unlock and extract data.
                </DialogContentText>
                <TextField
                    autoFocus
                    fullWidth
                    type="password"
                    label="PDF Password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onSubmit()
                    }}
                    error={!!error}
                    helperText={error}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    sx={{ borderRadius: 50, color: 'text.secondary' }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    disabled={extracting}
                    startIcon={extracting ? <CircularProgress size={18} color="inherit" /> : <LockIcon />}
                    color="primary"
                    sx={{ borderRadius: 50, px: 3 }}
                >
                    {extracting ? 'Unlocking...' : 'Unlock & Extract'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
