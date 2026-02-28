/**
 * PdfPreview — Google-style inline PDF viewer.
 */

import { Paper, Box, Typography } from '@mui/material'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'

interface PdfPreviewProps {
    pdfUrl: string
    isDark?: boolean
}

export default function PdfPreview({ pdfUrl, isDark = false }: PdfPreviewProps) {
    const dividerColor = isDark ? '#3c4043' : '#e8eaed'

    return (
        <Paper
            elevation={0}
            className="fade-in"
            sx={{ mb: 2, overflow: 'hidden', border: `1px solid ${dividerColor}` }}
        >
            <Box
                sx={{
                    px: 2,
                    py: 1.25,
                    borderBottom: `1px solid ${dividerColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: isDark ? 'background.paper' : '#fff',
                }}
            >
                <PictureAsPdfOutlinedIcon
                    sx={{ fontSize: 18, color: isDark ? '#9aa0a6' : '#5f6368' }}
                />
                <Typography
                    variant="subtitle2"
                    sx={{ color: isDark ? '#e8eaed' : '#202124', fontWeight: 500 }}
                >
                    PDF Preview
                </Typography>
            </Box>
            <Box sx={{ height: 700 }}>
                <iframe
                    src={pdfUrl}
                    style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
                    title="PDF Preview"
                />
            </Box>
        </Paper>
    )
}
