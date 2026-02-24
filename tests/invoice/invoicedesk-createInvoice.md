# Enhanced UI and Functional Test Suite - Invoice Creation

## 6. UI/UX Testing Scenarios

### 6.1 Form Input Field Validations and Visual Feedback
**Seed:** `tests/seed.spec.ts`

**Given:** User interacts with various input fields on invoice creation form
**When:** User enters valid/invalid data and navigates between fields
**Then:** Visual feedback should be immediate and intuitive

**Steps:**
1. Navigate to create invoice page
2. Click on customer name field and verify focus state
3. Enter valid customer name and verify checkmark/success indicator
4. Enter invalid email format and verify error styling (red border, error icon)
5. Tab through all form fields and verify tab order follows logical flow
6. Verify placeholder text is visible and helpful
7. Test field clearing functionality
8. Verify required field indicators (asterisks) are present

**UI Validations:**
- Focus states with proper visual indication
- Error states with red borders and error icons
- Success states with green checkmarks
- Consistent spacing between form elements
- Proper field labeling and placeholder text

### 6.2 Real-time Calculation Display and Updates
**Seed:** `tests/seed.spec.ts`

**Given:** User has invoice form with calculation section visible
**When:** User modifies quantities, prices, discount, or tax values
**Then:** Calculations should update in real-time with smooth animations

**Steps:**
1. Create invoice with base item ($100)
2. Observe calculation panel shows $100 subtotal
3. Change quantity from 1 to 5 and verify instant update to $500
4. Add 10% discount and verify animated update to $450
5. Add 8% tax and verify final calculation ($486.00)
6. Verify calculation breakdown is clearly displayed
7. Test rapid value changes for performance

**Expected Behaviors:**
- Calculations update within 100ms of input change
- Smooth number transitions/animations
- Clear breakdown of subtotal, discount, tax, total
- Currency formatting consistency
- No calculation flicker or jumping

### 6.3 Form Section Layout and Visual Hierarchy
**Seed:** `tests/seed.spec.ts`

**Given:** User views the complete invoice creation form
**When:** Page loads and displays all form sections
**Then:** Layout should follow clear visual hierarchy and grouping

**Visual Elements to Verify:**
- **Header Section:** Page title, navigation breadcrumb
- **Customer Section:** Customer selection, invoice details
- **Items Section:** Add item button, items table, product selection
- **Totals Section:** Calculation summary, VAT controls
- **Actions Section:** Save, send, cancel buttons

**Layout Requirements:**
- Consistent spacing between sections
- Clear section headings and dividers
- Proper alignment of form elements
- Responsive design on different screen sizes
- Logical visual flow from top to bottom

### 6.4 Form Sections and Layout
**File:** `tests/invoice/create-invoice-pom-data-driven.spec.ts`

**Customer & Invoice Details Section:**
- Customer dropdown with search/select functionality
- Auto-generated invoice number (editable)
- Issue date and due date fields
- Currency field (auto-populated based on customer)
- VAT rate input with percentage symbol

**Invoice Items Section:**
- "Add Item" button prominently displayed
- Items table with Product, Unit Price, Quantity, Amount columns
- Remove button for each item row
- Empty state message when no items added
- Product selection from catalog (dropdown/modal)

**Totals Summary Section:**
- Subtotal calculation
- VAT amount with percentage breakdown
- Grand total prominently displayed
- Currency formatting consistency
- Real-time update indication

## 7. Keyboard Navigation & Accessibility

### 7.1 Tab Navigation Flow
**Seed:** `tests/seed.spec.ts`

**Required Tab Order:**
1. Customer dropdown
2. Invoice number field
3. Issue date field
4. Due date field
5. VAT rate field
6. Add Item button
7. Save Invoice button
8. Cancel button

**Navigation Requirements:**
- Tab key moves focus forward logically
- Shift+Tab moves focus backward
- Focus indicators clearly visible
- No keyboard traps
- Skip links for screen readers

### 7.2 Keyboard Shortcuts and Efficiency
**Seed:** `tests/seed.spec.ts`

**Supported Shortcuts:**
- Enter key submits form when appropriate
- Escape key cancels operations/closes modals
- Arrow keys navigate within dropdowns
- Ctrl+S saves invoice (if implemented)
- Tab completion in dropdown fields

### 7.3 Screen Reader Support
**File:** `tests/invoice/create-invoice-pom-data-driven.spec.ts`

**Accessibility Requirements:**
- All form fields have associated labels
- Required fields marked with aria-required
- Error messages linked with aria-describedby
- Section headings use proper heading hierarchy
- Button purposes clear via aria-label or visible text
- Status messages announced via aria-live regions

## 8. Performance and Responsiveness

### 8.1 Page Load Performance
**Expected Metrics:**
- Initial page load: < 2 seconds
- Form interactivity: < 500ms after load
- Customer data loading: < 1 second
- Product catalog loading: < 1 second

### 8.2 Real-time Calculation Performance
**Performance Requirements:**
- Calculation updates: < 200ms after input change
- No blocking during rapid input changes
- Smooth animations without jank
- Responsive at 60fps on standard hardware

### 8.3 Form Responsiveness Across Device Sizes
**Responsive Design Tests:**
- Desktop (1920x1080): Full layout with all sections visible
- Tablet (768x1024): Adapted layout with proper spacing
- Mobile (375x667): Stacked sections, touch-friendly controls
- Form usability maintained across all sizes

## 9. Advanced Functional Testing

### 9.1 Item Row Management
**Complex Scenarios:**
- Adding 10+ items without performance degradation
- Reordering items (if drag-drop implemented)
- Bulk item operations (select multiple, delete)
- Item templates or quick-add functionality
- Copying items from previous invoices

### 9.2 Advanced Item Row Interactions
**File:** `tests/invoice/create-invoice-pom-data-driven.spec.ts`

**Item Addition Workflow:**
1. Click "Add Item" button
2. Product selection modal/dropdown appears
3. Select product from catalog
4. Set quantity (default to 1)
5. Unit price auto-populated from product data
6. Amount calculated automatically (quantity × unit price)
7. Item added to table with proper formatting

**Item Modification:**
- Inline editing of quantities
- Price overrides (if permitted)
- Item deletion with confirmation
- Duplicate item detection and handling

## 10. Data Persistence and Integrity

### 10.1 Auto-save Functionality
**Browser Session Management:**
- Form data persisted in localStorage/sessionStorage
- Recovery after browser crash or accidental navigation
- Data cleared after successful submission
- Proper cleanup on logout

### 10.2 Data Validation and Integrity
**Server-side Validation:**
- Customer existence verification
- Product availability and pricing
- Invoice number uniqueness
- Required field enforcement
- Data type and format validation

## 11. Security and Input Validation

### 11.1 XSS Prevention
**File:** `tests/invoice/create-invoice-pom-data-driven.spec.ts`

**Input Sanitization Tests:**
- HTML tags in customer names
- JavaScript in invoice notes
- SQL injection attempts in text fields
- Special characters in numeric fields
- Unicode and emoji handling

### 11.2 Business Logic Validation
**Edge Cases:**
- Zero or negative quantities
- Extremely large numbers
- Invalid date combinations
- Circular customer references
- Currency conversion boundaries

### 11.3 Authorization and Access Control
**Security Checks:**
- User permissions for invoice creation
- Customer data access restrictions
- Product catalog visibility rules
- Invoice editing after creation
- Audit trail maintenance

## 12. Integration and Workflow Testing

### 12.1 Customer Management Integration
**Customer Selection Workflow:**
- Existing customer selection from dropdown
- Customer search and filtering
- New customer creation inline
- Customer data validation
- Currency auto-selection based on customer

### 12.2 Product Catalog Integration
**Product Selection Process:**
- Product search and filtering
- Category-based product browsing
- Product availability checking
- Price list and discount application
- Inventory level warnings (if applicable)

### 12.3 Email and Notification Integration
**Communication Workflow:**
- Email template selection
- Custom message addition
- Email preview functionality
- Send confirmation and tracking
- Delivery status monitoring

### 12.4 Payment Processing Integration
**Payment Workflow:**
- Payment method selection
- Payment link generation
- Payment status tracking
- Partial payment handling
- Payment confirmation workflow

## Test Data Requirements

### Customer Test Data
```json
{
  "individual": {
    "name": "Shihara Wickramasinghe",
    "email": "shihara@example.com",
    "currency": "LKR",
    "taxRate": 18
  },
  "corporate": {
    "name": "Tech Corp Ltd",
    "email": "billing@techcorp.com", 
    "currency": "USD",
    "taxRate": 10
  },
  "small_business": {
    "name": "Design Studio",
    "email": "hello@designstudio.com",
    "currency": "LKR",
    "taxRate": 8.5
  }
}
```

### Product Test Data
```json
{
  "products": [
    {
      "id": "ICE_CREAM",
      "name": "Ice Cream",
      "price": "1200.00",
      "currency": "LKR"
    },
    {
      "id": "CAKE", 
      "name": "Cake",
      "price": "875.74",
      "currency": "LKR"
    }
  ]
}
```

### Invoice Test Scenarios
```json
{
  "scenarios": [
    {
      "name": "simple_single_item",
      "customer": "individual",
      "items": [{"product": "ICE_CREAM", "quantity": 1}],
      "vatRate": 18,
      "expectedTotal": "1416.00"
    },
    {
      "name": "complex_multiple_items",
      "customer": "corporate", 
      "items": [
        {"product": "ICE_CREAM", "quantity": 2},
        {"product": "CAKE", "quantity": 1}
      ],
      "vatRate": 10,
      "expectedTotal": "3075.74"
    }
  ]
}
```