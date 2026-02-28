/**
 * TransactionTable — Google Sheets-style data table with gray header row.
 */

import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Box,
    Typography,
    Chip,
} from '@mui/material'
import type { Transaction } from '../types'

interface Column {
    id: keyof Transaction
    label: string
    width: number
    align?: 'left' | 'right'
}

const columns: Column[] = [
    { id: 'date', label: 'Date', width: 110 },
    { id: 'details', label: 'Transaction Details', width: 350 },
    { id: 'cheque', label: 'Cheque / Ref No.', width: 140 },
    { id: 'debit', label: 'Debit (₹)', width: 130, align: 'right' },
    { id: 'credit', label: 'Credit (₹)', width: 130, align: 'right' },
    { id: 'balance', label: 'Balance (₹)', width: 140, align: 'right' },
]

interface TransactionTableProps {
    transactions: Transaction[]
    isDark?: boolean
}

export default function TransactionTable({ transactions, isDark = false }: TransactionTableProps) {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(100)

    const handleChangePage = (_: unknown, newPage: number) => setPage(newPage)
    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10))
        setPage(0)
    }

    const visibleRows = transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    const hasValue = (val: string) => val && val.trim() !== ''

    const dividerColor = isDark ? '#3c4043' : '#e8eaed'

    return (
        <Paper elevation={0} className="fade-in" sx={{ overflow: 'hidden', border: `1px solid ${dividerColor}` }}>
            {/* ── Table header strip ────────────────────────────── */}
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `1px solid ${dividerColor}`,
                    bgcolor: isDark ? 'background.paper' : '#fff',
                }}
            >
                <Typography
                    variant="subtitle2"
                    sx={{ color: isDark ? '#e8eaed' : '#202124', fontWeight: 500, fontSize: '0.9rem' }}
                >
                    Transactions
                </Typography>
                <Chip
                    label={`${transactions.length} rows`}
                    size="small"
                    sx={{
                        bgcolor: isDark ? 'rgba(138,180,248,0.1)' : '#e8f0fe',
                        color: isDark ? '#8ab4f8' : '#1a73e8',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        border: 'none',
                        height: 24,
                    }}
                />
            </Box>

            {/* ── Table ─────────────────────────────────────────── */}
            <TableContainer sx={{ maxHeight: 800 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell
                                    key={col.id}
                                    align={col.align || 'left'}
                                    sx={{
                                        width: col.width,
                                        fontWeight: 500,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        color: isDark ? '#9aa0a6' : '#5f6368',
                                        bgcolor: isDark ? '#292a2d' : '#f8f9fa',
                                        borderBottom: `2px solid ${dividerColor}`,
                                        py: 1.25,
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((row, idx) => (
                            <TableRow
                                key={idx}
                                sx={{
                                    '&:hover': { bgcolor: isDark ? '#35363a' : '#f8f9fa' },
                                    transition: 'background 0.1s',
                                    '&:last-child td': { border: 0 },
                                }}
                            >
                                <TableCell
                                    sx={{
                                        fontSize: '0.875rem',
                                        color: isDark ? '#e8eaed' : '#202124',
                                        whiteSpace: 'nowrap',
                                        borderBottom: `1px solid ${dividerColor}`,
                                        py: 1.25,
                                    }}
                                >
                                    {row.date}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontSize: '0.875rem',
                                        color: isDark ? '#e8eaed' : '#202124',
                                        borderBottom: `1px solid ${dividerColor}`,
                                        py: 1.25,
                                        wordBreak: 'break-word',
                                        whiteSpace: 'normal',
                                    }}
                                >
                                    <Typography variant="body2" title={row.details}
                                        sx={{ color: 'inherit', fontSize: 'inherit', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                        {row.details}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ fontSize: '0.875rem', color: isDark ? '#e8eaed' : '#202124', borderBottom: `1px solid ${dividerColor}`, py: 1.25 }}>
                                    {row.cheque}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: hasValue(row.debit) ? 500 : 400,
                                        color: hasValue(row.debit) ? '#ea4335' : (isDark ? '#9aa0a6' : '#5f6368'),
                                        borderBottom: `1px solid ${dividerColor}`,
                                        py: 1.25,
                                    }}
                                >
                                    {row.debit}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: hasValue(row.credit) ? 500 : 400,
                                        color: hasValue(row.credit) ? '#34a853' : (isDark ? '#9aa0a6' : '#5f6368'),
                                        borderBottom: `1px solid ${dividerColor}`,
                                        py: 1.25,
                                    }}
                                >
                                    {row.credit}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        color: isDark ? '#e8eaed' : '#202124',
                                        borderBottom: `1px solid ${dividerColor}`,
                                        py: 1.25,
                                    }}
                                >
                                    {row.balance}
                                </TableCell>
                            </TableRow>
                        ))}
                        {visibleRows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                    <Typography sx={{ color: isDark ? '#9aa0a6' : '#5f6368', fontSize: '0.875rem' }}>
                                        No transactions found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={transactions.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50, 100]}
                sx={{
                    borderTop: `1px solid ${dividerColor}`,
                    color: isDark ? '#9aa0a6' : '#5f6368',
                    fontSize: '0.8rem',
                    '& .MuiTablePagination-select': { color: isDark ? '#e8eaed' : '#202124' },
                }}
            />
        </Paper>
    )
}
