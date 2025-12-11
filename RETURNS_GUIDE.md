# Returns Management System - Quick Guide

## Overview
Complete returns/refunds management system for handling product and service returns from customers with full print capabilities.

## Features

### 📋 Returns Listing
- **View all returns** with status indicators (Pending, Approved, Completed, Rejected)
- **Search functionality** - Search by return number, invoice number, or client name
- **Filter by status** - Quick filter for all statuses
- **Statistics dashboard** - Real-time metrics:
  - Total Returns
  - Pending Returns
  - Approved Returns
  - Completed Returns
  - Rejected Returns
  - Total Refund Amount

### ➕ Create New Return
1. Click **"Create Return"** button
2. Fill in return details:
   - **Invoice Number** (original invoice reference)
   - **Client Name**
   - **Return Reason** (detailed explanation)
   - **Refund Method**: 
     - Credit Note
     - Bank Transfer
     - Cash Refund
     - Replacement

3. **Add Return Items:**
   - Item Description
   - Item-specific Return Reason
   - Quantity
   - Unit Price
   - VAT Rate (default 15%)
   - Click "Add Item"

4. Review totals:
   - Subtotal
   - VAT Amount
   - Total Refund Amount

5. Click **"Create Return"** to submit

### 🖨️ Print Return Documents
- Click **"Print"** button on any return
- Professional return note format includes:
  - Company letterhead
  - Return and invoice details
  - Customer information
  - Return reason highlighted
  - Item-wise breakdown with reasons
  - Refund calculations (Subtotal, VAT, Total)
  - Terms & Conditions
  - Signature sections (Customer, Received By, Authorized By)
  - Document reference number

### 📊 Return Information Display
Each return card shows:
- **Return Number** (e.g., RET-2024-001)
- **Status Badge** (color-coded)
- **Invoice Number**
- **Client Name**
- **Return Date**
- **Refund Method**
- **Return Reason** (highlighted in amber)
- **Number of Items**
- **Approved By** (if approved)
- **Additional Notes** (if any)
- **Total Refund Amount** (prominently displayed in red)

### 🎨 Status Colors
- **Pending**: Amber/Orange
- **Approved**: Green
- **Completed**: Blue
- **Rejected**: Red

## Use Cases

### 1. Defective Product Return
```
Invoice: INV-2024-001
Client: ABC Corporation
Reason: Product defective - Quality issues
Refund: Bank Transfer
Status: Approved → Completed
```

### 2. Wrong Item Delivered
```
Invoice: INV-2024-003
Client: XYZ Trading
Reason: Wrong item delivered
Refund: Replacement
Status: Pending
```

### 3. Customer Not Satisfied
```
Invoice: INV-2024-005
Client: Global Enterprises
Reason: Not satisfied with service
Refund: Credit Note
Status: Completed
```

### 4. Late Return Request
```
Invoice: INV-2024-007
Client: Tech Solutions
Reason: Return after policy period
Refund: N/A
Status: Rejected
```

## Return Workflow

1. **Customer Request** → Create Return (Status: Pending)
2. **Management Review** → Approve/Reject
3. **Approved** → Process Refund
4. **Refund Processed** → Mark as Completed
5. **Print Document** → Customer receipt

## Print Document Features

### Header Section
- Company name and logo area
- "RETURN NOTE" label (red badge)
- Company address, phone, email

### Return Details
- Return number and date
- Invoice reference
- Current status
- Refund method

### Customer Information
- Client name
- Refund method
- Approver name (if applicable)

### Items Table
Columns:
- # (Serial number)
- Description
- Reason (item-specific)
- Quantity
- Unit Price
- VAT %
- Total

### Financial Summary
- Subtotal
- VAT Amount
- **Total Refund Amount** (highlighted)

### Terms & Conditions
- Returns must be in original condition
- Original invoice required
- Processing time: 7-14 business days
- Credit note validity: 6 months
- Replacement delivery: 5 business days

### Signatures
Three signature blocks:
1. Customer Signature
2. Received By (Company Rep)
3. Authorized By (Management)

## Navigation

**Desktop Sidebar:**
- Dashboard
- Invoices
- Purchases
- **→ Returns** ← (NEW)
- Reports
- Payments
- Tenders
- Clients
- Companies
- Settings

**Access:** Click "Returns" in sidebar menu

## Sample Data Included

The system includes 4 sample returns:
1. **RET-2024-001** - Approved (Rs 517,500)
2. **RET-2024-002** - Pending (Rs 143,750)
3. **RET-2024-003** - Completed (Rs 86,250)
4. **RET-2024-004** - Rejected (Rs 368,000)

## Testing Instructions

1. **Open:** http://localhost:5173
2. **Login:** admin@bizmanage.lk / Admin@123
3. **Navigate:** Click "Returns" in sidebar
4. **View:** See 4 sample returns with different statuses
5. **Create:** Click "Create Return" to add new return
6. **Print:** Click "Print" on any return to test print layout

## Technical Details

**Files Created:**
- `frontend/src/pages/Returns.tsx` - Main returns page (600+ lines)
- `frontend/src/components/ReturnPrint.tsx` - Print template (250+ lines)
- `frontend/src/types/index.ts` - Return & ReturnItem types

**Components Used:**
- Card, CardContent, CardHeader
- Button, Input, Label
- Dialog (for create form)
- Select (for filters and dropdowns)
- Print media queries for A4 format

**Features:**
- Real-time search and filtering
- Dynamic totals calculation
- Multiple items per return
- Status-based color coding
- Responsive design
- Print-optimized layout

## Browser Compatibility

**Print Function:**
- ✅ Chrome/Edge - Full support
- ✅ Firefox - Full support
- ✅ Safari - Full support
- Uses CSS print media queries
- A4 paper format optimized

**Save as PDF:**
1. Click Print button
2. Select "Save as PDF" as printer
3. Portrait orientation
4. A4 paper size
5. Default margins

## Status Management

Returns go through these states:
1. **Pending** - Awaiting review
2. **Approved** - Authorized for refund
3. **Completed** - Refund processed
4. **Rejected** - Return denied

## Refund Methods

1. **Credit Note**
   - Issue credit for future purchases
   - Valid for 6 months
   - No cash refund

2. **Bank Transfer**
   - Electronic refund to customer account
   - Processing: 7-14 days
   - Full amount refunded

3. **Cash Refund**
   - Immediate cash payment
   - Receipt required
   - Available at office

4. **Replacement**
   - Exchange for new item
   - No refund issued
   - Delivery within 5 days

## Best Practices

1. **Always include detailed reason** for returns
2. **Attach original invoice** reference
3. **Verify item condition** before approval
4. **Document approver name** for audit trail
5. **Print return note** for customer records
6. **Keep digital copy** of all returns
7. **Track refund processing** until completed

## Future Enhancements (Optional)

- Email return confirmation to customer
- Attach photo evidence of returned items
- Automatic credit note generation
- Integration with accounting system
- Return analytics and trends
- Customer return history
- Return reason analysis

---

**System Ready!** ✅
Access the Returns management system at http://localhost:5173 → Login → Returns
