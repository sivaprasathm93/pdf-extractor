/**
 * EmptyState — Google Drive-style empty state illustration.
 */

import { Box, Typography, Button } from '@mui/material'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'

interface EmptyStateProps {
    isDark?: boolean
    onImportClick?: () => void
}

export default function EmptyState({ isDark = false, onImportClick }: EmptyStateProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 10,
                px: 4,
                textAlign: 'center',
            }}
        >
            {/* Circular illustration container */}
            <Box
                sx={{
                    width: 96,
                    height: 96,
                    borderRadius: '50%',
                    bgcolor: isDark ? 'rgba(138,180,248,0.1)' : '#e8f0fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                }}
            >
                <UploadFileOutlinedIcon
                    sx={{
                        fontSize: 44,
                        color: isDark ? '#8ab4f8' : '#1a73e8',
                    }}
                />
            </Box>

            <Typography
                variant="h6"
                sx={{
                    color: isDark ? '#e8eaed' : '#202124',
                    fontWeight: 500,
                    mb: 1,
                    fontSize: '1.1rem',
                }}
            >
                No file selected
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    color: isDark ? '#9aa0a6' : '#5f6368',
                    mb: 3,
                    maxWidth: 320,
                    lineHeight: 1.6,
                }}
            >
                Import a PDF bank statement to extract and export transaction data as Excel.
            </Typography>

            {onImportClick && (
                <Button
                    variant="outlined"
                    size="medium"
                    onClick={onImportClick}
                    sx={{
                        borderColor: isDark ? '#8ab4f8' : '#1a73e8',
                        color: isDark ? '#8ab4f8' : '#1a73e8',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        px: 3,
                        borderRadius: '4px',
                        '&:hover': {
                            bgcolor: isDark ? 'rgba(138,180,248,0.08)' : 'rgba(26,115,232,0.04)',
                            borderColor: isDark ? '#aecbfa' : '#1557b0',
                        },
                    }}
                >
                    Select PDF file
                </Button>
            )}
        </Box>
    )
}
