"""
Bank Statement Parsing Rules
=============================
Each bank has specific rules for how their PDF statements are structured
and how narration/transaction details should be parsed.

Add new banks by creating a new class that follows the BankRules interface.
"""

import re


# ─── HDFC Bank ────────────────────────────────────────────────────────────────

class HDFCRules:
    """
    HDFC Bank Statement Parsing Rules
    
    Table Structure:
        - Headers: Txn Date | Narration | Withdrawals | Deposits | Closing Balance
        - ALL transactions are merged into a SINGLE table row
        - Each cell uses '\\n' to separate values
        - Date/Amount columns: 1 line per transaction
        - Narration column: 2-4 lines per transaction (variable)
    
    Date Format:
        - DD/MM/YYYY (e.g., 01/01/2026)
    
    Narration Structure:
        Each transaction narration follows this general pattern:
          Line 1: <TYPE>-<details> (e.g., IMPS-600114982784-Name-Bank-Account)
          Line 2+: continuation of details, ending with 'Value Dt DD/MM/YYYY'
          Last line: 'Ref <number>' or standalone ref number on separate line
    
    Transaction Types (narration prefixes):
        - IMPS: Immediate Payment Service transfers
        - UPI: Unified Payments Interface
        - NEFT: National Electronic Funds Transfer
        - RTGS: Real Time Gross Settlement
        - POS: Point of Sale (card transactions)
        - FT: Fund Transfer (salary credits, etc.)
        - ACH: Automated Clearing House (auto-debits, EMIs)
        - ECS: Electronic Clearing Service
        - ATM: ATM withdrawals
        - NACH: National Automated Clearing House
    
    Narration End Markers (how to detect end of one narration block):
        1. Line containing 'Ref <digits>' on same line
           Example: '01/01/2026 Ref 600114982784'
        2. Standalone digits line following a line ending with 'Ref'
           Example: 'hekam Value Dt 03/01/2026 Ref' + newline + '600335454148'
        3. Line containing 'Value Dt DD/MM/YYYY' WITHOUT 'Ref'
           Example: 'Value Dt 06/01/2026' (seen in some ACH/ECS debits)
    
    Column Mapping:
        - 'Txn Date' → date
        - 'Narration' → details
        - 'Withdrawals' → debit
        - 'Deposits' → credit
        - 'Closing Balance' → balance
        - No cheque/reference column (ref is embedded in narration)
    
    Special Cases:
        - Some narrations have no 'Ref' number (e.g., insurance debits)
        - Salary credits may use 'FT-' prefix with masked details
        - Page 1 is account summary (no transactions)
        - Page 2+ contain transactions
    """

    name = "HDFC Bank"

    # Date pattern
    date_pattern = re.compile(r'(\d{2}/\d{2}/\d{4})')

    # Narration end markers
    ref_same_line = re.compile(r'Ref\s+\d+', re.IGNORECASE)
    ref_end_of_line = re.compile(r'Ref\s*$', re.IGNORECASE)
    standalone_digits = re.compile(r'^\d{6,}$')
    value_dt_no_ref = re.compile(r'Value\s+Dt\s+\d{2}/\d{2}/\d{4}', re.IGNORECASE)

    # Header keywords for detection
    header_keywords = ["TXN DATE", "NARRATION", "WITHDRAWALS", "DEPOSITS", "CLOSING BALANCE"]

    @staticmethod
    def detect(headers):
        """Check if this bank's rules apply based on table headers."""
        header_text = " ".join(str(h).upper() for h in headers if h)
        return "NARRATION" in header_text and "WITHDRAWAL" in header_text

    @staticmethod
    def column_map():
        """Map column header keywords to field names."""
        return {
            "date_keywords": ["DATE"],
            "details_keywords": ["NARRATION"],
            "debit_keywords": ["WITHDRAWAL"],
            "credit_keywords": ["DEPOSIT"],
            "balance_keywords": ["CLOSING BALANCE", "BALANCE"],
        }


# ─── Kotak Mahindra Bank ─────────────────────────────────────────────────────

class KotakRules:
    """
    Kotak Mahindra Bank Statement Parsing Rules
    
    Table Structure:
        - Headers: Date | Transaction Details | Cheque/Ref No | Debit | Credit | Balance
        - Each transaction is its OWN table row (standard format)
    
    Date Format:
        - DD Mon, YYYY (e.g., 01 Jan, 2026)
    
    Narration Structure:
        - Single line per transaction in the 'Transaction Details' column
        - Cheque/reference number in separate column
    
    Column Mapping:
        - 'Date' → date
        - 'Transaction Details' / 'Particulars' → details
        - 'Cheque/Ref No' → cheque
        - 'Debit' → debit
        - 'Credit' → credit
        - 'Balance' → balance
    """

    name = "Kotak Mahindra Bank"

    date_pattern = re.compile(
        r'(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec),?\s*\d{4})',
        re.IGNORECASE
    )

    header_keywords = ["DATE", "TRANSACTION DETAILS", "CHEQUE", "DEBIT", "CREDIT", "BALANCE"]

    @staticmethod
    def detect(headers):
        """Check if this bank's rules apply based on table headers."""
        header_text = " ".join(str(h).upper() for h in headers if h)
        return "CHEQUE" in header_text and "DEBIT" in header_text

    @staticmethod
    def column_map():
        return {
            "date_keywords": ["DATE"],
            "details_keywords": ["TRANSACTION", "DESCRIPTION", "DETAIL", "PARTICULAR"],
            "cheque_keywords": ["CHEQUE", "CHQ", "REF"],
            "debit_keywords": ["DEBIT", "DR"],
            "credit_keywords": ["CREDIT", "CR"],
            "balance_keywords": ["BALANCE", "BAL"],
        }


# ─── SBI (State Bank of India) ───────────────────────────────────────────────

class SBIRules:
    """
    SBI Bank Statement Parsing Rules
    
    Table Structure:
        - Headers: Txn Date | Value Date | Description | Ref No./Cheque No. | Debit | Credit | Balance
        - Each transaction is its OWN table row
    
    Date Format:
        - DD/MM/YYYY or DD Mon YYYY
    
    Column Mapping:
        - 'Txn Date' → date
        - 'Description' → details
        - 'Ref No./Cheque No.' → cheque
        - 'Debit' → debit
        - 'Credit' → credit
        - 'Balance' → balance
    """

    name = "State Bank of India"

    date_pattern = re.compile(r'(\d{2}/\d{2}/\d{4})')

    @staticmethod
    def detect(headers):
        header_text = " ".join(str(h).upper() for h in headers if h)
        return "DESCRIPTION" in header_text and "VALUE DATE" in header_text

    @staticmethod
    def column_map():
        return {
            "date_keywords": ["TXN DATE", "DATE"],
            "details_keywords": ["DESCRIPTION"],
            "cheque_keywords": ["REF", "CHEQUE"],
            "debit_keywords": ["DEBIT"],
            "credit_keywords": ["CREDIT"],
            "balance_keywords": ["BALANCE"],
        }


# ─── ICICI Bank ──────────────────────────────────────────────────────────────

class ICICIRules:
    """
    ICICI Bank Statement Parsing Rules
    
    Table Structure:
        - Headers: S No. | Value Date | Transaction Date | Cheque Number | Transaction Remarks | Withdrawal Amount | Deposit Amount | Balance
        - Each transaction is its OWN table row
    
    Date Format:
        - DD/MM/YYYY
    """

    name = "ICICI Bank"

    date_pattern = re.compile(r'(\d{2}/\d{2}/\d{4})')

    @staticmethod
    def detect(headers):
        header_text = " ".join(str(h).upper() for h in headers if h)
        return "TRANSACTION REMARKS" in header_text

    @staticmethod
    def column_map():
        return {
            "date_keywords": ["TRANSACTION DATE", "VALUE DATE", "DATE"],
            "details_keywords": ["TRANSACTION REMARKS", "REMARKS"],
            "cheque_keywords": ["CHEQUE"],
            "debit_keywords": ["WITHDRAWAL"],
            "credit_keywords": ["DEPOSIT"],
            "balance_keywords": ["BALANCE"],
        }


# ─── Registry ────────────────────────────────────────────────────────────────

# All supported bank rules, checked in order
ALL_BANK_RULES = [
    HDFCRules,
    KotakRules,
    SBIRules,
    ICICIRules,
]


def detect_bank(headers):
    """Detect which bank the statement belongs to based on table headers."""
    for rules in ALL_BANK_RULES:
        if rules.detect(headers):
            return rules
    return None  # Unknown bank — use generic parsing
