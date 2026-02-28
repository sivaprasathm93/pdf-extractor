/**
 * App.tsx — Main application orchestrator.
 * All UI is composed from smaller components; this file handles state and API calls.
 */

import { useState, useMemo, ChangeEvent } from 'react'
import { ThemeProvider, CssBaseline, Box, Container, Alert, Snackbar, Typography } from '@mui/material'
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

const API_URL = 'http://localhost:5000/api'

export default function App() {
    // ── Theme ────────────────────────────────────────────
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light')
    const theme = useMemo(() => getTheme(themeMode), [themeMode])
    const isDark = themeMode === 'dark'

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
                        py: 2,
                        borderTop: isDark ? '1px solid #3c4043' : '1px solid #e8eaed',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: isDark ? '#9aa0a6' : '#80868b',
                            fontSize: '0.8rem',
                            letterSpacing: '0.2px',
                        }}
                    >
                        Crafted by{' '}
                        <Box
                            component="span"
                            sx={{ color: isDark ? '#8ab4f8' : '#1a73e8', fontWeight: 500 }}
                        >
                            SK
                        </Box>
                    </Typography>
                </Box>
            </Box>
        </ThemeProvider>
    )
}
