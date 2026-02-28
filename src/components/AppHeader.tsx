/**
 * AppHeader — Google-style top app bar (white, with logo branding).
 */

import {
    AppBar,
    Toolbar,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    Box,
} from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

interface AppHeaderProps {
    fileName: string | null
    isDark: boolean
    onClear: () => void
    onToggleTheme: () => void
}

export default function AppHeader({ fileName, isDark, onClear, onToggleTheme }: AppHeaderProps) {
    return (
        <AppBar
            position="sticky"
            elevation={0}
            className={isDark ? 'google-appbar-dark' : 'google-appbar'}
            sx={{ color: 'text.primary' }}
        >
            <Toolbar sx={{ minHeight: '56px !important', px: { xs: 2, sm: 3 } }}>
                {/* Google-style logo mark */}
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4285f4 0%, #0f9d58 50%, #fbbc04 80%, #ea4335 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1.5,
                        flexShrink: 0,
                    }}
                >
                    <PictureAsPdfIcon sx={{ fontSize: 18, color: '#fff' }} />
                </Box>

                <Typography
                    variant="h6"
                    className="google-brand"
                    sx={{ flexGrow: 1, color: isDark ? '#e8eaed' : '#202124' }}
                >
                    PDF Extractor
                </Typography>

                {fileName && (
                    <Chip
                        label={fileName}
                        onDelete={onClear}
                        size="small"
                        className={isDark ? 'file-chip-dark' : 'file-chip'}
                        sx={{ mr: 1, maxWidth: 220 }}
                    />
                )}

                <Tooltip title={isDark ? 'Switch to Light' : 'Switch to Dark'}>
                    <IconButton
                        onClick={onToggleTheme}
                        size="small"
                        className="theme-toggle"
                        sx={{ color: isDark ? '#9aa0a6' : '#5f6368' }}
                    >
                        {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    )
}
