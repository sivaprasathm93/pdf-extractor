/**
 * ActionBar — Google Material 3-style action panel.
 * Prominent filled primary (Extract), tonal secondary (Preview, Export),
 * and outlined import button — with clear visual hierarchy.
 */

import { ChangeEvent } from 'react'
import {
    Box,
    Button,
    TextField,
    Tooltip,
    IconButton,
    CircularProgress,
    Typography,
    Paper,
} from '@mui/material'
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'

interface ActionBarProps {
    file: File | null
    showPreview: boolean
    inlinePassword: string
    extracting: boolean
    loading: boolean
    previewLoading: boolean
    transactionCount: number
    isDark: boolean
    onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void
    onClear: () => void
    onTogglePreview: () => void
    onExtract: () => void
    onExport: () => void
    onPasswordChange: (value: string) => void
}

export default function ActionBar({
    file,
    showPreview,
    inlinePassword,
    extracting,
    loading,
    previewLoading,
    transactionCount,
    isDark,
    onFileSelect,
    onClear,
    onTogglePreview,
    onExtract,
    onExport,
    onPasswordChange,
}: ActionBarProps) {
    const border = isDark ? '1px solid #3c4043' : '1px solid #e8eaed'

    // ── Shared style helpers ──────────────────────────────────────────────

    /** Google Blue filled — primary CTA */
    const filledBtn = {
        borderRadius: '20px',
        px: 2.5,
        py: 0.9,
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'none' as const,
        boxShadow: 'none',
        bgcolor: isDark ? '#8ab4f8' : '#1a73e8',
        color: isDark ? '#202124' : '#fff',
        '&:hover': {
            bgcolor: isDark ? '#aecbfa' : '#1557b0',
            boxShadow: '0 1px 3px rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
        },
        '&.Mui-disabled': {
            bgcolor: isDark ? '#2d2e31' : '#f1f3f4',
            color: isDark ? '#5f6368' : '#bdc1c6',
            boxShadow: 'none',
        },
    }

    /** Tonal filled — secondary action (blue-tinted background, blue text) */
    const tonalBtn = (color: 'blue' | 'green') => {
        const isBlue = color === 'blue'
        return {
            borderRadius: '20px',
            px: 2,
            py: 0.75,
            fontSize: '0.875rem',
            fontWeight: 500,
            textTransform: 'none' as const,
            boxShadow: 'none',
            bgcolor: isDark
                ? isBlue ? 'rgba(138,180,248,0.14)' : 'rgba(129,201,149,0.14)'
                : isBlue ? '#e8f0fe' : '#e6f4ea',
            color: isDark
                ? isBlue ? '#8ab4f8' : '#81c995'
                : isBlue ? '#1a73e8' : '#137333',
            border: 'none',
            '&:hover': {
                bgcolor: isDark
                    ? isBlue ? 'rgba(138,180,248,0.22)' : 'rgba(129,201,149,0.22)'
                    : isBlue ? '#d2e3fc' : '#ceead6',
                boxShadow: 'none',
            },
            '&.Mui-disabled': {
                bgcolor: isDark ? '#2d2e31' : '#f1f3f4',
                color: isDark ? '#5f6368' : '#bdc1c6',
            },
        }
    }

    /** Outlined — ghost style for Import/secondary actions */
    const outlinedBtn = {
        borderRadius: '20px',
        px: 2.5,
        py: 0.75,
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'none' as const,
        boxShadow: 'none',
        borderColor: isDark ? '#8ab4f8' : '#1a73e8',
        color: isDark ? '#8ab4f8' : '#1a73e8',
        bgcolor: 'transparent',
        '&:hover': {
            bgcolor: isDark ? 'rgba(138,180,248,0.08)' : 'rgba(26,115,232,0.06)',
            borderColor: isDark ? '#aecbfa' : '#1557b0',
        },
    }

    return (
        <Paper
            elevation={0}
            sx={{ mb: 2.5, overflow: 'hidden', border, borderRadius: '12px' }}
        >
            {/* ── Button Toolbar ─────────────────────────────────────── */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1,
                    px: 2,
                    py: 1.5,
                    bgcolor: isDark ? 'background.paper' : '#fff',
                }}
            >
                {/* ① Import PDF — outlined */}
                <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadFileRoundedIcon fontSize="small" />}
                    sx={outlinedBtn}
                >
                    Import PDF
                    <input type="file" hidden accept=".pdf" onChange={onFileSelect} />
                </Button>

                {/* ② Password field */}
                <TextField
                    size="small"
                    type="password"
                    label="PDF Password"
                    placeholder="If protected"
                    value={inlinePassword}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <LockOutlinedIcon
                                sx={{ mr: 0.5, fontSize: 16, color: isDark ? '#9aa0a6' : '#80868b' }}
                            />
                        ),
                    }}
                    sx={{
                        width: 180,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '20px',
                            fontSize: '0.875rem',
                        },
                        '& .MuiInputLabel-root': { fontSize: '0.85rem' },
                    }}
                />

                {/* ③ Preview — tonal blue */}
                <Tooltip title={showPreview ? 'Hide PDF preview' : 'Preview the PDF inline'}>
                    <span>
                        <Button
                            variant="contained"
                            startIcon={
                                previewLoading
                                    ? <CircularProgress size={16} color="inherit" />
                                    : showPreview
                                        ? <VisibilityOffRoundedIcon fontSize="small" />
                                        : <VisibilityRoundedIcon fontSize="small" />
                            }
                            onClick={onTogglePreview}
                            disabled={!file || previewLoading}
                            disableElevation
                            sx={tonalBtn('blue')}
                        >
                            {previewLoading ? 'Loading…' : showPreview ? 'Hide Preview' : 'Preview PDF'}
                        </Button>
                    </span>
                </Tooltip>

                {/* ④ Extract Data — prominent filled blue (primary CTA) */}
                <Tooltip title="Extract transactions from this PDF">
                    <span>
                        <Button
                            variant="contained"
                            startIcon={
                                extracting
                                    ? <CircularProgress size={16} color="inherit" />
                                    : <AutoAwesomeRoundedIcon fontSize="small" />
                            }
                            onClick={onExtract}
                            disabled={!file || extracting}
                            disableElevation
                            sx={filledBtn}
                        >
                            {extracting ? 'Extracting…' : 'Extract Data'}
                        </Button>
                    </span>
                </Tooltip>

                {/* ⑤ Export Excel — tonal green */}
                <Tooltip title={transactionCount === 0 ? 'Extract data first' : 'Download as .xlsx'}>
                    <span>
                        <Button
                            variant="contained"
                            startIcon={
                                loading
                                    ? <CircularProgress size={16} color="inherit" />
                                    : <FileDownloadRoundedIcon fontSize="small" />
                            }
                            onClick={onExport}
                            disabled={transactionCount === 0 || loading}
                            disableElevation
                            sx={tonalBtn('green')}
                        >
                            Export Excel
                        </Button>
                    </span>
                </Tooltip>

                {/* Spacer */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Clear button */}
                {file && (
                    <Tooltip title="Remove file">
                        <IconButton
                            size="small"
                            onClick={onClear}
                            sx={{
                                color: isDark ? '#9aa0a6' : '#80868b',
                                transition: 'color 0.15s, background 0.15s',
                                '&:hover': {
                                    bgcolor: isDark ? 'rgba(242,139,130,0.12)' : 'rgba(234,67,53,0.08)',
                                    color: '#ea4335',
                                },
                            }}
                        >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* ── File info strip ────────────────────────────────────── */}
            {file && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1,
                        px: 2.5,
                        py: 0.875,
                        bgcolor: isDark ? '#292a2d' : '#f8f9fa',
                        borderTop: border,
                    }}
                >
                    <InsertDriveFileOutlinedIcon
                        sx={{ fontSize: 15, color: isDark ? '#9aa0a6' : '#80868b', flexShrink: 0 }}
                    />
                    <Typography
                        variant="body2"
                        noWrap
                        sx={{ fontSize: '0.8rem', color: isDark ? '#e8eaed' : '#3c4043', fontWeight: 500 }}
                    >
                        {file.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ fontSize: '0.775rem', color: isDark ? '#5f6368' : '#9aa0a6' }}
                    >
                        {(file.size / 1024).toFixed(0)} KB
                    </Typography>

                    {transactionCount > 0 && (
                        <>
                            <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: isDark ? '#5f6368' : '#bdc1c6' }} />
                            <CheckCircleOutlineRoundedIcon
                                sx={{ fontSize: 14, color: isDark ? '#81c995' : '#34a853' }}
                            />
                            <Typography
                                variant="body2"
                                sx={{ fontSize: '0.8rem', color: isDark ? '#81c995' : '#137333', fontWeight: 500 }}
                            >
                                {transactionCount} transactions extracted
                            </Typography>
                        </>
                    )}
                </Box>
            )}
        </Paper>
    )
}
