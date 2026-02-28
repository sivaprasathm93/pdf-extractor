/**
 * App.tsx — Main application orchestrator.
 * All UI is composed from smaller components; this file handles state and API calls.
 */

import { useState, useMemo, useEffect, useRef, ChangeEvent } from 'react'
import { ThemeProvider, CssBaseline, Box, Container, Alert, Snackbar, Typography } from '@mui/material'
import { VisibilityOutlined, AutoAwesomeOutlined, FileDownloadOutlined } from '@mui/icons-material'
import axios from 'axios'

import { getTheme } from './theme'
import type { Transaction, SnackbarState, UploadResponse } from './types'

import AppHeader from './components/AppHeader'
import ActionBar from './components/ActionBar'
import PdfPreview from './components/PdfPreview'
import TransactionTable from './components/TransactionTable'
import EmptyState from './components/EmptyState'
import PasswordDialog from './components/PasswordDialog'

import './App.css'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

export default function App() {
    // ── Theme ────────────────────────────────────────────
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light')
    const theme = useMemo(() => getTheme(themeMode), [themeMode])
    const isDark = themeMode === 'dark'

    // ── Analytics ─────────────────────────────────────────
    const [analyticsData, setAnalyticsData] = useState({ page_visit: 0, extract_click: 0, export_click: 0, preview_click: 0 })

    const fetchAnalytics = () => {
        axios.get(`${API_URL}/analytics`).then(r => setAnalyticsData(r.data)).catch(() => { })
    }

    const trackEvent = (event: string) => {
        axios.post(`${API_URL}/track`, { event }).then(() => fetchAnalytics()).catch(() => { })
    }

    const hasTrackedVisit = useRef(false)

    useEffect(() => {
        if (!hasTrackedVisit.current) {
            hasTrackedVisit.current = true
            trackEvent('page_visit')
        }
        fetchAnalytics()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // ── Core State ───────────────────────────────────────
    const [file, setFile] = useState<File | null>(null)
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '' })
    const [extracting, setExtracting] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [previewLoading, setPreviewLoading] = useState(false)
    const [previewPending, setPreviewPending] = useState(false)

    // ── Password State ───────────────────────────────────
    const [inlinePassword, setInlinePassword] = useState('')
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
    const [pdfPassword, setPdfPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')

    // ── Handlers ─────────────────────────────────────────

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile)
            setPdfUrl(null)
            setTransactions([])
            setError('')
            setInlinePassword('')
            setShowPreview(false)
            setPreviewPending(false)
        } else {
            setError('Please select a valid PDF file')
        }
    }

    const handlePreview = async (password = '') => {
        if (!file) return

        // If already previewing, just toggle off
        if (showPreview) {
            setShowPreview(false)
            return
        }

        setPreviewLoading(true)
        setError('')
        trackEvent('preview_click')

        const effectivePassword = password || inlinePassword.trim()
        const formData = new FormData()
        formData.append('file', file)
        if (effectivePassword) {
            formData.append('password', effectivePassword)
        }

        try {
            const response = await axios.post(`${API_URL}/preview-upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            if (response.data.success) {
                setPdfUrl(response.data.preview_url)
                setShowPreview(true)
                setPasswordDialogOpen(false)
                setPdfPassword('')
                setPasswordError('')
                setPreviewPending(false)
            } else if (response.data.password_required) {
                setPreviewPending(true)
                setPasswordDialogOpen(true)
                setPasswordError(response.data.error || '')
            } else {
                setError(response.data.error || 'Failed to preview PDF')
            }
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { password_required?: boolean; error?: string } } }
            const errData = axiosErr.response?.data
            if (errData?.password_required) {
                setPreviewPending(true)
                setPasswordDialogOpen(true)
                setPasswordError(errData.error || '')
            } else {
                setError(errData?.error || 'Server error. Is the backend running?')
            }
        } finally {
            setPreviewLoading(false)
        }
    }

    const handleExtract = async (password = '') => {
        if (!file) return
        setExtracting(true)
        setError('')
        trackEvent('extract_click')

        const effectivePassword = password || inlinePassword.trim()
        const formData = new FormData()
        formData.append('file', file)
        if (effectivePassword) {
            formData.append('password', effectivePassword)
        }

        try {
            const response = await axios.post<UploadResponse>(`${API_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            if (response.data.success) {
                setTransactions(response.data.data)
                setSnackbar({
                    open: true,
                    message: `Extracted ${response.data.count} transactions successfully!`,
                })
                if (response.data.preview_url) {
                    setPdfUrl(response.data.preview_url)
                }
                setPasswordDialogOpen(false)
                setPdfPassword('')
                setPasswordError('')
            } else if (response.data.password_required) {
                setPasswordDialogOpen(true)
                setPasswordError(response.data.error || '')
            } else {
                setError(response.data.error || 'Failed to extract data')
            }
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: UploadResponse } }
            const errData = axiosErr.response?.data
            if (errData?.password_required) {
                setPasswordDialogOpen(true)
                setPasswordError(errData.error || '')
            } else {
                setError(errData?.error || 'Server error. Is the backend running?')
            }
        } finally {
            setExtracting(false)
        }
    }

    const handlePasswordSubmit = () => {
        if (!pdfPassword.trim()) {
            setPasswordError('Please enter a password')
            return
        }
        setPasswordError('')
        if (previewPending) {
            handlePreview(pdfPassword)
        } else {
            handleExtract(pdfPassword)
        }
    }

    const handlePasswordDialogClose = () => {
        setPasswordDialogOpen(false)
        setPdfPassword('')
        setPasswordError('')
        setPreviewPending(false)
    }

    const handleExport = async () => {
        if (transactions.length === 0) return
        setLoading(true)
        trackEvent('export_click')
        try {
            const response = await axios.post(
                `${API_URL}/export`,
                { transactions },
                { responseType: 'blob' }
            )
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            const exportName = file?.name?.replace(/\.pdf$/i, '.xlsx') || 'bank_statement.xlsx'
            link.setAttribute('download', exportName)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
            setSnackbar({ open: true, message: 'Excel file downloaded!' })
        } catch {
            setError('Failed to export Excel')
        } finally {
            setLoading(false)
        }
    }

    const handleClear = () => {
        setFile(null)
        setPdfUrl(null)
        setTransactions([])
        setError('')
        setShowPreview(false)
        setPreviewPending(false)
    }

    // ── Render ────────────────────────────────────────────

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
                <AppHeader
                    fileName={file?.name ?? null}
                    isDark={isDark}
                    onClear={handleClear}
                    onToggleTheme={() => setThemeMode(isDark ? 'light' : 'dark')}
                />

                <Container maxWidth="xl" sx={{ py: 2.5, px: { xs: 2, sm: 3 }, flexGrow: 1 }}>
                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2, borderRadius: '8px', fontSize: '0.875rem' }}
                            onClose={() => setError('')}
                        >
                            {error}
                        </Alert>
                    )}

                    <ActionBar
                        file={file}
                        showPreview={showPreview}
                        inlinePassword={inlinePassword}
                        extracting={extracting}
                        loading={loading}
                        previewLoading={previewLoading}
                        transactionCount={transactions.length}
                        isDark={isDark}
                        onFileSelect={handleFileSelect}
                        onClear={handleClear}
                        onTogglePreview={() => handlePreview()}
                        onExtract={() => handleExtract()}
                        onExport={handleExport}
                        onPasswordChange={setInlinePassword}
                    />

                    {/* ── Split-screen: preview left | table right ── */}
                    {(showPreview || transactions.length > 0) && (
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'flex-start',
                            }}
                        >
                            {showPreview && pdfUrl && (
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <PdfPreview pdfUrl={pdfUrl} isDark={isDark} />
                                </Box>
                            )}
                            {transactions.length > 0 && (
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <TransactionTable transactions={transactions} isDark={isDark} />
                                </Box>
                            )}
                        </Box>
                    )}

                    {!file && <EmptyState isDark={isDark} />}
                </Container>

                <PasswordDialog
                    open={passwordDialogOpen}
                    password={pdfPassword}
                    error={passwordError}
                    extracting={extracting}
                    onClose={handlePasswordDialogClose}
                    onPasswordChange={(val) => {
                        setPdfPassword(val)
                        setPasswordError('')
                    }}
                    onSubmit={handlePasswordSubmit}
                />

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    message={snackbar.message}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    className="google-snackbar"
                />

                {/* ── Footer ─────────────────────────────────── */}
                <Box
                    component="footer"
                    sx={{
                        mt: 'auto',
                        py: 3,
                        px: 4,
                        borderTop: isDark ? '1px solid #3c4043' : '1px solid #e8eaed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >
                    {/* Left: Crafted by */}
                    <Typography
                        variant="body1"
                        sx={{
                            color: isDark ? '#9aa0a6' : '#80868b',
                            fontSize: '0.95rem',
                            letterSpacing: '0.2px',
                        }}
                    >
                        Crafted by{' '}
                        <Box
                            component="span"
                            sx={{ color: isDark ? '#8ab4f8' : '#1a73e8', fontWeight: 600 }}
                        >
                            SK
                        </Box>
                    </Typography>

                    {/* Center: Powered by logos */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography sx={{ fontSize: '0.85rem', color: isDark ? '#9aa0a6' : '#80868b', mr: 0.5, fontWeight: 500 }}>
                            Powered by
                        </Typography>
                        {[
                            {
                                name: 'GitHub',
                                url: 'https://github.com',
                                svg: (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill={isDark ? '#9aa0a6' : '#80868b'}>
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                ),
                            },
                            {
                                name: 'Vercel',
                                url: 'https://vercel.com',
                                svg: (
                                    <svg width="22" height="18" viewBox="0 0 76 65" fill={isDark ? '#9aa0a6' : '#80868b'}>
                                        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                                    </svg>
                                ),
                            },
                            {
                                name: 'Render',
                                url: 'https://render.com',
                                svg: (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill={isDark ? '#9aa0a6' : '#80868b'}>
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={isDark ? '#9aa0a6' : '#80868b'} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                            },
                            {
                                name: 'UptimeRobot',
                                url: 'https://uptimerobot.com',
                                svg: (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill={isDark ? '#9aa0a6' : '#80868b'}>
                                        <circle cx="12" cy="12" r="10" stroke={isDark ? '#9aa0a6' : '#80868b'} strokeWidth="2" fill="none" />
                                        <path d="M12 6v6l4 2" stroke={isDark ? '#9aa0a6' : '#80868b'} strokeWidth="2" fill="none" strokeLinecap="round" />
                                    </svg>
                                ),
                            },
                            {
                                name: 'Antigravity',
                                url: 'https://antigravity.google',
                                svg: (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 3L4 21h4l1.5-4h5L16 21h4L12 3zm0 6.5L14.5 15h-5L12 9.5z" fill={isDark ? '#9aa0a6' : '#80868b'} />
                                    </svg>
                                ),
                            },
                            {
                                name: 'Claude',
                                url: 'https://claude.ai',
                                svg: (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill={isDark ? '#9aa0a6' : '#80868b'}>
                                        <circle cx="12" cy="12" r="3" fill={isDark ? '#9aa0a6' : '#80868b'} />
                                        <circle cx="12" cy="4" r="1.5" fill={isDark ? '#9aa0a6' : '#80868b'} />
                                        <circle cx="12" cy="20" r="1.5" fill={isDark ? '#9aa0a6' : '#80868b'} />
                                        <circle cx="4" cy="12" r="1.5" fill={isDark ? '#9aa0a6' : '#80868b'} />
                                        <circle cx="20" cy="12" r="1.5" fill={isDark ? '#9aa0a6' : '#80868b'} />
                                        <circle cx="6.34" cy="6.34" r="1.5" fill={isDark ? '#9aa0a6' : '#80868b'} />
                                        <circle cx="17.66" cy="17.66" r="1.5" fill={isDark ? '#9aa0a6' : '#80868b'} />
                                        <circle cx="6.34" cy="17.66" r="1.5" fill={isDark ? '#9aa0a6' : '#80868b'} />
                                        <circle cx="17.66" cy="6.34" r="1.5" fill={isDark ? '#9aa0a6' : '#80868b'} />
                                    </svg>
                                ),
                            },
                        ].map(({ name, url, svg }) => (
                            <Box
                                key={name}
                                component="a"
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={name}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    opacity: 0.6,
                                    transition: 'opacity 0.2s, transform 0.2s',
                                    '&:hover': { opacity: 1, transform: 'scale(1.2)' },
                                }}
                            >
                                {svg}
                            </Box>
                        ))}
                    </Box>

                    {/* Right: Analytics counters */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                        {[
                            { label: 'Visits', value: analyticsData.page_visit, icon: <VisibilityOutlined sx={{ fontSize: 18 }} /> },
                            { label: 'Extracts', value: analyticsData.extract_click, icon: <AutoAwesomeOutlined sx={{ fontSize: 18 }} /> },
                            { label: 'Exports', value: analyticsData.export_click, icon: <FileDownloadOutlined sx={{ fontSize: 18 }} /> },
                        ].map(({ label, value, icon }) => (
                            <Box
                                key={label}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.75,
                                }}
                            >
                                <Box sx={{ color: isDark ? '#8ab4f8' : '#1a73e8', display: 'flex', alignItems: 'center' }}>{icon}</Box>
                                <Typography
                                    sx={{
                                        fontSize: '0.9rem',
                                        color: isDark ? '#e8eaed' : '#3c4043',
                                        fontWeight: 600,
                                    }}
                                >
                                    {value}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        color: isDark ? '#9aa0a6' : '#80868b',
                                    }}
                                >
                                    {label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}
