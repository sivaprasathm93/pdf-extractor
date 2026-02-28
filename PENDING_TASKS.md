# Pending Tasks

## 🤖 AI Agent for Auto-Fixing Bank Rules
**Priority:** High  
**Status:** Pending (waiting for Gemini API key)

### Description
Implement an LLM-based agent that automatically analyzes and updates bank parsing rules when extracted data is incorrect.

### How to get Gemini API Key (Free Tier)
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Select or create a Google Cloud project
5. Copy the generated API key

### Free tier limits
- Gemini 2.0 Flash: 15 req/min, 1M tokens/day
- No credit card required

### Implementation Plan
1. **Backend: `/api/fix` endpoint**
   - Receives raw cell data + current (wrong) extraction result
   - Sends narration lines + expected transaction count to Gemini
   - Gemini returns correctly grouped narrations
   - Returns corrected transactions to frontend

2. **Frontend: "Fix with AI" button**
   - Appears when extraction results are shown
   - Shows a settings dialog for API key (stored in localStorage)
   - Sends raw data to backend for AI correction
   - Updates the table with corrected results

3. **Rule Learning (future)**
   - Save AI corrections as learned rules per bank
   - Auto-apply learned rules before calling AI next time
   - Reduce API calls over time

---

## 📋 Other Pending Items

### Multi-page support for more banks
- Test with SBI, ICICI, Axis statements
- Each may have different table structures

### Batch PDF processing
- Allow importing multiple PDFs at once
- Merge transactions across statements

### Date range filtering
- Add date filter controls above the data table
- Filter extracted transactions by date range
