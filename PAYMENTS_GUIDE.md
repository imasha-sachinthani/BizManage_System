# Payment Tracking & Management System - Guide

## Overview
Complete payment tracking system with intelligent alerts, due period management, overdue notifications, and professional print receipts.

## Features

### 🔔 **Smart Alert System**
Automatically monitors and alerts for:
1. **Overdue Payments** (Red Alert)
   - Shows total count and amount
   - Critical priority for action

2. **Due Within 7 Days** (Amber Warning)
   - Early warning for upcoming payments
   - Proactive collection management

3. **Partial Payments** (Blue Info)
   - Tracks incomplete payments
   - Shows outstanding balance

4. **High-Value Overdue** (Critical Alert)
   - Flags payments >Rs 2M overdue
   - Requires immediate attention

### 📊 **Statistics Dashboard**
Seven key metrics tracked:
- **Total Payments**: All payment records
- **Completed**: Paid in full
- **Pending**: Awaiting payment
- **Overdue**: Past due date
- **Partial**: Partially paid
- **Total Received**: Amount collected (Rs XM)
- **Outstanding**: Amount pending (Rs XM)

### 🔍 **Advanced Search & Filters**
- **Search by**:
  - Payment number (PAY-2024-XXX)
  - Invoice number (INV-2024-XXX)
  - Client name
- **Filter by status**:
  - All Status
  - Pending
  - Completed
  - Overdue
  - Partial

### 📅 **Due Period Tracking**
Each payment displays:
- **Due Date**: When payment is expected
- **Days to Due**: Countdown for pending payments
- **Days Overdue**: Counter for late payments
- **Color-coded badges**:
  - 🔴 Red: Overdue
  - 🟡 Amber: Due within 7 days
  - ⚪ Grey: Due later

### 🖨️ **Professional Print Receipts**
Print different document types based on status:

#### **Completed Payment Receipt**
- Green header "PAYMENT RECEIPT"
- Full payment confirmation
- "PAID IN FULL" status
- Payment date and reference
- Signature sections
- Thank you message

#### **Pending Payment Notice**
- Amber header "PAYMENT PENDING"
- Amount due highlighted
- Bank details for payment
- Payment instructions
- Invoice reference

#### **Overdue Payment Notice**
- Red header "OVERDUE NOTICE"
- ⚠️ Urgent warning message
- Days overdue counter
- Late payment charges note
- Immediate action required

#### **Partial Payment Receipt**
- Blue header "PARTIAL PAYMENT"
- Amount paid shown
- Balance due highlighted
- Payment deadline for balance
- Next steps information

### 💰 **Payment Status Types**

1. **Completed** 🟢
   - Full payment received
   - Green badge and amount
   - Receipt printable
   - Transaction reference shown

2. **Pending** 🟡
   - Payment not yet received
   - Due date tracking
   - Reminder button available
   - Payment instructions ready

3. **Overdue** 🔴
   - Past due date
   - Days overdue counter
   - Urgent action alerts
   - Multiple reminder options
   - Legal action warning (if applicable)

4. **Partial** 🔵
   - Some payment received
   - Balance outstanding shown
   - Paid vs Balance breakdown
   - Follow-up tracking

## How to Use

### Access Payments Page
1. **Login** to BizManage at http://localhost:5173
2. Click **"Payments"** in sidebar
3. View payment dashboard

### Review Alerts
- Check alert cards at top of page
- Red alerts = Urgent action needed
- Amber alerts = Follow up soon
- Blue alerts = Information only

### Search Payments
1. Use search bar at top
2. Type payment #, invoice #, or client name
3. Results filter in real-time

### Filter by Status
1. Click status filter dropdown
2. Select desired status
3. View filtered results

### Send Payment Reminder
1. Find pending/overdue payment
2. Click **"Remind"** button
3. Confirmation shows reminder sent
4. Email sent to client (if configured)

### Print Receipt/Notice
1. Locate payment in list
2. Click **"Print"** button
3. Print dialog opens
4. Choose:
   - **Print**: Send to printer
   - **Save as PDF**: Digital copy
5. Document formatted for A4

## Payment Details Displayed

### Header Information
- Payment Number (PAY-2024-XXX)
- Status badge (color-coded)
- Due period badge (days info)

### Key Details Grid
- **Invoice No**: Original invoice reference
- **Client**: Customer name
- **Due Date**: Expected payment date
- **Method**: Payment type (Bank Transfer, Cheque, etc.)

### Status-Specific Info

**For Partial Payments:**
```
Paid: Rs 1,500,000
Balance: Rs 1,300,000
```

**For Overdue:**
```
⚠️ OVERDUE by 42 days - Immediate action required
```

**Transaction Details:**
- Reference number (if paid)
- Payment date (if completed)
- Notes/comments

## Sample Data Included

8 sample payments demonstrating all statuses:

### Completed Payments
1. **PAY-2024-001** - ABC Corporation
   - Rs 2,450,000 paid via bank transfer
   - Reference: TRF/2024/10/001

2. **PAY-2024-004** - Retail Mart Ltd
   - Rs 4,200,000 paid online
   - Reference: ONL-20241020-4567

### Pending Payments
3. **PAY-2024-002** - XYZ Enterprises
   - Rs 1,875,000 due Dec 15
   - Method: Cheque

4. **PAY-2024-007** - Metro Enterprises
   - Rs 890,000 due Dec 20

### Overdue Payments
5. **PAY-2024-003** - Global Trading Co
   - Rs 3,250,000 overdue 97 days
   - Urgent action needed

6. **PAY-2024-006** - Smart Systems Ltd
   - Rs 1,650,000 overdue 31 days

7. **PAY-2024-008** - Future Tech Corp
   - Rs 5,400,000 overdue 42 days
   - High-value alert
   - Legal action pending note

### Partial Payment
8. **PAY-2024-005** - Tech Solutions Inc
   - Total: Rs 2,800,000
   - Paid: Rs 1,500,000
   - Balance: Rs 1,300,000 due Nov 30

## Print Receipt Examples

### Completed Payment Receipt
```
[Company Header]
PAYMENT RECEIPT

Payment No: PAY-2024-001
Invoice No: INV-2024-001
Client: ABC Corporation Ltd
Due Date: 2024-10-15
Payment Date: 2024-10-14
Method: BANK TRANSFER
Reference: TRF/2024/10/001

Invoice Amount: Rs 2,450,000.00
Payment Status: PAID IN FULL

[Signature Sections]
Thank you for your payment
```

### Overdue Notice
```
[Company Header]
OVERDUE NOTICE

Payment No: PAY-2024-003
Invoice No: INV-2024-003
Client: Global Trading Co
Due Date: 2024-09-05
Days Overdue: 97

⚠️ OVERDUE PAYMENT NOTICE
This payment is overdue by 97 days.
Please settle immediately to avoid
additional charges and legal action.

Overdue Amount: Rs 3,250,000.00

Bank Details:
[Payment Instructions]
```

## Alert Trigger Conditions

### Overdue Alert (Red/Critical)
- Status = Overdue
- Any amount past due date
- Shows total count and value

### Due Soon Alert (Amber/Warning)
- Status = Pending or Partial
- Due date within 0-7 days
- Proactive reminder

### Partial Payment Alert (Blue/Info)
- Status = Partial
- Balance amount > 0
- Shows total outstanding

### High-Value Alert (Critical)
- Status = Overdue
- Amount > Rs 2,000,000
- Priority escalation

## Due Period Calculation

**Days Overdue:**
```
Today's Date - Due Date = Days Overdue
(Only if positive, else 0)
```

**Days to Due:**
```
Due Date - Today's Date = Days Until Due
```

**Color Coding:**
- **Red badge**: Already overdue
- **Amber badge**: Due in ≤7 days
- **Grey badge**: Due in >7 days

## Payment Methods Supported

1. **Bank Transfer**
   - Electronic fund transfer
   - Reference number tracked
   - Most common method

2. **Cheque**
   - Physical cheque payment
   - Clearance time considered
   - Cheque number reference

3. **Cash**
   - Cash payment
   - Receipt mandatory
   - Office collection

4. **Online**
   - Online payment gateway
   - Transaction ID tracked
   - Instant confirmation

5. **Credit Card**
   - Card payment
   - Authorization code
   - Processing fees may apply

## Best Practices

### 1. Daily Review
- Check alerts every morning
- Prioritize overdue payments
- Follow up on due-soon items

### 2. Proactive Communication
- Send reminders 7 days before due
- Follow up on day after due
- Escalate after 30 days overdue

### 3. Documentation
- Print receipts for all completed payments
- File overdue notices
- Maintain payment reference records

### 4. Escalation Process
```
Day 0: Due date
Day 1: First reminder
Day 7: Second reminder
Day 14: Third reminder + phone call
Day 30: Final notice
Day 45: Legal action consideration
```

### 5. High-Value Handling
- Extra attention for >Rs 2M
- Direct client contact
- Management escalation
- Payment plan options

## Technical Details

**Files Created:**
- `frontend/src/pages/Payments.tsx` - Main page (550+ lines)
- `frontend/src/components/PaymentPrint.tsx` - Print template (250+ lines)
- `frontend/src/types/index.ts` - Payment interface

**Alert Logic:**
- Runs on page load
- Re-checks when data changes
- Real-time calculation
- No backend required (mock data)

**Calculations:**
- Days overdue: Automatic
- Days to due: Real-time
- Total amounts: Summed dynamically
- Statistics: Live computed

## Testing Instructions

1. **Access Page**
   - Login at http://localhost:5173
   - Click "Payments" in sidebar

2. **Check Alerts**
   - Should see 4 alerts at top:
     - 3 overdue (Rs 10.3M)
     - Partial payment alert
     - High-value alert

3. **Test Search**
   - Type "ABC" → Shows ABC Corporation
   - Type "PAY-2024-001" → Shows that payment
   - Clear search

4. **Test Filters**
   - Select "Overdue" → Shows 3 overdue
   - Select "Completed" → Shows 2 completed
   - Select "All Status" → Shows all 8

5. **Test Reminders**
   - Click "Remind" on pending payment
   - See success toast message

6. **Test Print**
   - Click "Print" on completed payment
   - See green "PAYMENT RECEIPT"
   - Click "Print" on overdue payment
   - See red "OVERDUE NOTICE"
   - Try print-to-PDF

## Browser Compatibility

**Print Function:**
- ✅ Chrome/Edge - Full support
- ✅ Firefox - Full support
- ✅ Safari - Full support
- CSS print media queries used
- A4 format optimized

**Alerts:**
- Real-time updates
- Responsive design
- Color-coded for urgency
- Icon indicators

## Future Enhancements (Optional)

- Email reminder automation
- SMS notifications
- Payment link generation
- Online payment gateway integration
- Automated follow-up scheduling
- Payment plan management
- Credit limit tracking
- Aging analysis reports
- Collection effectiveness metrics
- Customer payment history

---

**System Status:** ✅ Operational
**Access:** http://localhost:5173 → Payments
**Sample Data:** 8 payments (2 completed, 2 pending, 3 overdue, 1 partial)
**Alerts:** Automatic monitoring enabled
**Print:** Ready for all payment types
