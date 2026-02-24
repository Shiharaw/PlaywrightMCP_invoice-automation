# Invoice Creation - BDD Test Plan

## Overview
This test plan covers comprehensive end-to-end testing for invoice creation functionality, specifically designed for user **shiharasss@gmail.com** with full administrative permissions.

## Test User Profile
- **Primary Test User**: shiharasss@gmail.com
- **Role**: Admin
- **Company**: TechStartup Inc.
- **Permissions**: Full access to create, edit, send, and manage invoices
- **Features**: Advanced invoice features, customer management, reporting

## Test Scenarios

### 1. Valid Invoice Creation

#### 1.1 Create Simple Invoice with Single Item
**Seed:** `tests/seed.spec.ts`

**Given:** User shiharasss@gmail.com is authenticated and on dashboard  
**When:** User creates a simple invoice with single service item  
**Then:** Invoice should be saved successfully with correct calculations

**Steps:**
1. Navigate to create invoice page from dashboard
2. Fill customer information (Corporate customer profile)
3. Add single invoice item (Web Development Services, 40 hours @ $125/hour)
4. Save as draft
5. Verify success message appears
6. Verify total amount calculation (Expected: $5,000.00)

**Test Data:**
- Customer: Acme Corporation
- Item: Web Development Services (40 × $125.00 = $5,000.00)

#### 1.2 Create Complex Invoice with Multiple Items and Tax
**Seed:** `tests/seed.spec.ts`

**Given:** User wants to create detailed invoice with multiple items, discount, and tax  
**When:** User fills complete invoice data with calculations  
**Then:** Invoice should process successfully with accurate calculations

**Steps:**
1. Navigate to create invoice page
2. Fill customer information (Small Business profile)
3. Add multiple invoice items:
   - Logo Design: 1 × $500.00 = $500.00
   - Website Development: 20 × $150.00 = $3,000.00
   - Content Writing: 5 × $80.00 = $400.00
4. Set discount: 10%
5. Set tax rate: 8.5%
6. Add notes and terms
7. Save and send invoice
8. Verify success message and calculations

**Expected Calculation:**
- Subtotal: $3,900.00
- Discount (10%): -$390.00
- After discount: $3,510.00
- Tax (8.5%): +$298.35
- **Total: $3,808.35**

#### 1.3 Create Invoice with Existing Customer Selection
**Seed:** `tests/seed.spec.ts`

**Given:** User wants to invoice an existing customer from database  
**When:** User selects existing customer and creates invoice  
**Then:** Customer data should be populated and invoice saved successfully

**Steps:**
1. Navigate to create invoice page
2. Select existing customer (Individual customer profile)
3. Fill invoice details (auto-generated invoice number, due date)
4. Add 2 service items from sample data
5. Preview invoice before saving
6. Save as draft
7. Verify success message

### 2. Invoice Form Validation

#### 2.1 Validation Error for Missing Required Customer Information
**Seed:** `tests/seed.spec.ts`

**Given:** User attempts to create invoice without required customer data  
**When:** User tries to save invoice with incomplete customer information  
**Then:** Validation errors should prevent saving and display helpful messages

**Steps:**
1. Navigate to create invoice page
2. Skip customer information fields
3. Add invoice item (Test Service, 1 × $100)
4. Attempt to save as draft
5. Verify validation error appears
6. Verify error mentions required customer fields

**Expected Errors:**
- "Customer name is required"
- "Customer email is required"

#### 2.2 Validation Error for Invalid Email Format
**Seed:** `tests/seed.spec.ts`

**Given:** User enters invalid customer email format  
**When:** User submits form with malformed email  
**Then:** Client-side validation should prevent submission with clear error message

**Steps:**
1. Navigate to create invoice page
2. Enter customer data with invalid email (e.g., "invalid-email")
3. Add invoice item
4. Attempt to save
5. Verify email validation error appears
6. Verify focus moves to email field

**Expected Behaviors:**
- Email field shows red border
- Error message: "Please enter a valid email address"
- Form submission is prevented

#### 2.3 Validation Error for Negative Item Quantities or Prices
**Seed:** `tests/seed.spec.ts`

**Given:** User enters negative values for item details  
**When:** User tries to add items with invalid quantities or prices  
**Then:** Validation should prevent negative values and show error messages

**Steps:**
1. Navigate to create invoice page
2. Fill customer information
3. Add item with negative quantity (-1)
4. Add item with negative price (-$50.00)
5. Verify validation errors appear
6. Verify save button remains disabled

**Expected Validations:**
- Quantity field shows "Quantity must be greater than 0"
- Price field shows "Price must be greater than 0"
- Items with negative values are not added to invoice

### 3. Invoice Item Management

#### 3.1 Add and Remove Multiple Invoice Items
**Seed:** `tests/seed.spec.ts`

**Given:** User wants to manage multiple invoice items  
**When:** User adds, modifies, and removes items from invoice  
**Then:** Item list should update correctly with accurate calculations

**Steps:**
1. Navigate to create invoice page
2. Fill customer information
3. Add multiple items (3-4 different services)
4. Modify quantities for existing items
5. Remove middle item from list
6. Add additional item
7. Verify final item count and totals
8. Save invoice

**Expected Behaviors:**
- Items appear in order added
- Remove functionality works for any item
- Calculations update after each change
- Final total reflects current item list

#### 3.2 Dynamic Calculation Updates When Modifying Items
**Seed:** `tests/seed.spec.ts`

**Given:** User has invoice with items and wants to see real-time calculations  
**When:** User modifies quantities, adds discount, or changes tax rate  
**Then:** All calculations should update immediately without page refresh

**Steps:**
1. Create invoice with base items
2. Observe initial calculations
3. Change item quantities and verify subtotal updates
4. Add 15% discount and verify discount application
5. Change tax rate from 8% to 12% and verify tax calculation
6. Verify grand total reflects all changes
7. Test rapid changes for responsiveness

**Expected Behaviors:**
- Calculations update within 200ms of input change
- All currency values formatted consistently
- No calculation errors or rounding issues
- Smooth visual updates without flicker

### 4. Invoice Status and Actions

#### 4.1 Save Invoice in Draft Status
**Seed:** `tests/seed.spec.ts`

**Given:** User wants to save work in progress  
**When:** User creates partial invoice and saves as draft  
**Then:** Invoice should be saved with draft status and retrievable for editing

**Steps:**
1. Create invoice with customer and items
2. Save as draft (not sent)
3. Navigate to invoices list
4. Locate saved invoice
5. Verify draft status indicator
6. Open invoice for editing
7. Verify all data preserved

**Expected Outcomes:**
- Invoice appears in list with "Draft" status
- All entered data is preserved
- Invoice can be reopened for editing
- Invoice number is reserved/generated

#### 4.2 Save and Send Invoice to Customer
**Seed:** `tests/seed.spec.ts`

**Given:** User wants to send invoice immediately  
**When:** User completes invoice and chooses send option  
**Then:** Invoice should be marked as sent and customer should receive notification

**Steps:**
1. Create complete invoice with all required data
2. Select "Save and Send" option
3. Confirm send action in any confirmation dialog
4. Verify success message
5. Check invoice status changed to "Sent"
6. Verify timestamp shows sent date/time

**Expected Behaviors:**
- Invoice status changes to "Sent"
- Sent timestamp recorded
- Success confirmation displayed
- Invoice becomes read-only (edit restrictions apply)

### 5. User Experience and Navigation

#### 5.1 Cancel Invoice Creation Returns to Dashboard
**Seed:** `tests/seed.spec.ts`

**Given:** User started creating invoice but wants to cancel  
**When:** User clicks cancel button or browser back  
**Then:** User should return to previous page with no data saved

**Steps:**
1. Navigate to create invoice page
2. Fill some customer data and items
3. Click "Cancel" button
4. Verify returned to invoices list or dashboard
5. Navigate back to create invoice page
6. Verify form is blank (no data retained)

**Expected Navigation:**
- Cancel button returns to invoices list
- Browser back button works correctly
- No confirmation dialog for unsaved data (or appropriate warning)
- Form data is cleared on return

#### 5.2 Form Validates All Required Elements Are Present
**Seed:** `tests/seed.spec.ts`

**Given:** User accesses create invoice page  
**When:** Page loads completely  
**Then:** All required form elements should be visible and functional

**Elements to Verify:**
- Customer selection dropdown
- Invoice number field (auto-generated)
- Issue date and due date fields
- Currency field (based on customer)
- VAT rate input
- Add Item button
- Items table with headers
- Totals summary section
- Save and Cancel buttons

**Accessibility Checks:**
- All input fields have proper labels
- Tab order follows logical flow
- Required field indicators visible
- Error messages are accessible
- Form is keyboard navigable

## Test Execution Notes

### Environment Requirements
- **Test User:** shiharasss@gmail.com with admin permissions
- **Base URL:** https://invoicedesk.siyothsoft.com
- **Browser Support:** Chrome, Firefox, Safari (latest versions)
- **Test Data:** Configured customer records and product catalog

### Test Data Management
- Use consistent test customer data
- Product prices based on actual catalog
- Currency handling for LKR vs USD customers
- Sequential invoice numbering considerations

### Performance Expectations
- Page load time: < 2 seconds
- Calculation updates: < 200ms
- Form submission: < 5 seconds
- List view loading: < 3 seconds