/**
 * Google-style Material Design theme for PDF Extractor
 * Palette: Google Blue (#1a73e8), White, #f8f9fa surface
 */

import { createTheme } from '@mui/material'

export const getTheme = (mode: 'light' | 'dark') =>
    createTheme({
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    primary: { main: '#1a73e8', light: '#4a90e2', dark: '#1557b0' },
                    secondary: { main: '#34a853' },
                    error: { main: '#ea4335' },
                    warning: { main: '#fbbc04' },
                    info: { main: '#1a73e8' },
                    success: { main: '#34a853' },
                    background: { default: '#f8f9fa', paper: '#ffffff' },
                    text: { primary: '#202124', secondary: '#5f6368' },
                    divider: '#e8eaed',
                }
                : {
                    primary: { main: '#8ab4f8', light: '#aecbfa', dark: '#669df6' },
                    secondary: { main: '#81c995' },
                    error: { main: '#f28b82' },
                    warning: { main: '#fdd663' },
                    info: { main: '#8ab4f8' },
                    success: { main: '#81c995' },
                    background: { default: '#202124', paper: '#292a2d' },
                    text: { primary: '#e8eaed', secondary: '#9aa0a6' },
                    divider: '#3c4043',
                }),
        },
        typography: {
            fontFamily: '"Roboto", "Google Sans", "Helvetica Neue", sans-serif',
            h4: { fontWeight: 500, letterSpacing: '-0.2px' },
            h5: { fontWeight: 500 },
            h6: { fontWeight: 500 },
            subtitle1: { fontWeight: 500, fontSize: '0.95rem' },
            subtitle2: { fontWeight: 500, fontSize: '0.85rem' },
            body2: { fontSize: '0.875rem' },
            button: { textTransform: 'none', fontWeight: 500, letterSpacing: '0.25px' },
        },
        shape: { borderRadius: 8 },
        shadows: [
            'none',
            '0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
            '0 1px 2px rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)',
            '0 4px 8px 3px rgba(60,64,67,0.15), 0 1px 3px rgba(60,64,67,0.3)',
            '0 6px 10px 4px rgba(60,64,67,0.15), 0 2px 3px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
            '0 8px 12px 6px rgba(60,64,67,0.15), 0 4px 4px rgba(60,64,67,0.3)',
        ],
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: 4,
                        padding: '8px 24px',
                        fontSize: '0.875rem',
                        letterSpacing: '0.25px',
                        transition: 'box-shadow 0.2s ease, background 0.15s ease',
                        '&:hover': { boxShadow: '0 1px 3px rgba(60,64,67,0.3)' },
                    },
                    containedPrimary: {
                        backgroundColor: '#1a73e8',
                        color: '#fff',
                        boxShadow: 'none',
                        '&:hover': {
                            backgroundColor: '#1765cc',
                            boxShadow: '0 1px 3px rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
                        },
                    },
                    outlinedPrimary: {
                        borderColor: '#dadce0',
                        color: '#1a73e8',
                        '&:hover': {
                            borderColor: '#1a73e8',
                            backgroundColor: 'rgba(26,115,232,0.04)',
                        },
                    },
                },
                defaultProps: { disableElevation: true },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        border: mode === 'light' ? '1px solid #e8eaed' : '1px solid #3c4043',
                    },
                    elevation1: {
                        boxShadow: '0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        boxShadow: mode === 'light'
                            ? '0 1px 3px rgba(60,64,67,0.3)'
                            : '0 1px 3px rgba(0,0,0,0.5)',
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: { borderRadius: 4, fontSize: '0.8rem' },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 4,
                            '& fieldset': { borderColor: '#dadce0' },
                            '&:hover fieldset': { borderColor: '#1a73e8' },
                            '&.Mui-focused fieldset': {
                                borderColor: '#1a73e8',
                                borderWidth: '2px',
                            },
                        },
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: { borderBottom: `1px solid ${mode === 'light' ? '#e8eaed' : '#3c4043'}` },
                },
            },
        },
    })
