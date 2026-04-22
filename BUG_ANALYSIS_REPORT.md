# TeamSync Frontend - Comprehensive Bug Analysis Report

## Executive Summary
This report identifies critical bugs in the React frontend code that prevent proper creation, editing, and display of Goals, Commissions, Events, and Properties. The issues range from missing validation and incomplete state management to potential API data inconsistencies.

---

## BUG #1: Properties Not Showing on User End

### Severity: **CRITICAL**

### Description
Users see 0 properties in their dashboard even when properties are created by admins. Properties appear in the admin panel but not in the user dashboard.

### Root Cause Analysis

#### Issue 1A: PropertyList Component Exists But Unused
- **File**: [PropertyList.jsx](PropertyList.jsx)
- **Lines**: 1-130
- **Problem**: The `PropertyList` component is defined but **never imported or used anywhere**
- **Impact**: Even if fetched correctly, the component isn't rendered to users

#### Issue 1B: UserDashboard Uses Generic ItemList Component
- **File**: [UserDashboard.jsx](UserDashboard.jsx#L1358)
- **Line**: 1358
- **Current Code**:
```jsx
<DashboardCard title="Properties">
  <ItemList
    data={dashboard?.properties}
    emptyText="No properties assigned yet."
  />
</DashboardCard>
```
- **Problem**: The `ItemList` component ([UserDashboard.jsx](UserDashboard.jsx#L1891-L1920), lines 1891-1920) is overly generic
  - It only displays `item.title || item.address || item.transactionName`
  - Properties **don't have a `title` field**, they have `address`
  - The component doesn't display property-specific fields like status, representation, or price
  
#### Issue 1C: No User-Specific Filtering
- **File**: [dashboardService.js](dashboardService.js#L114)
- **Line**: 114-116
- **Current Code**:
```javascript
export const getProperties = async () => {
  const response = await axios.get(`${API_BASE_URL}/properties`);
  return response.data;
};
```
- **Problem**: Endpoint returns **ALL properties** without filtering by user
- **Expected**: Should only return properties assigned to the current user
- **Hypothesis**: Backend API `GET /api/properties` returns all properties regardless of user context

#### Issue 1D: No Error Handling in Service Layer
- **File**: [dashboardService.js](dashboardService.js#L1-150)
- **Problem**: All API calls lack try-catch error handling
- **Impact**: Network errors, 403 Forbidden responses, or other failures silently fail

### Proof of Issue

1. Navigate to Admin Dashboard → Property Management
2. Create a new property assigned to a specific user
3. Log in as that user
4. Navigate to User Dashboard
5. **Expected**: Property appears in "Properties" section
6. **Actual**: Shows "No properties assigned yet."

### Affected Files
- [PropertyList.jsx](PropertyList.jsx) - Unused component
- [UserDashboard.jsx](UserDashboard.jsx#L1891-L1920) - Generic ItemList doesn't display properties correctly
- [dashboardService.js](dashboardService.js#L114-116) - No user-specific endpoint

### Recommended Fix

#### Fix 1: Create Proper User Properties Endpoint
In [dashboardService.js](dashboardService.js), modify to use user-specific endpoint:
```javascript
export const getUserProperties = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/user/${userId}/properties`);
  return response.data;
};
```

#### Fix 2: Create PropertyList Component for UserDashboard
Replace generic ItemList in [UserDashboard.jsx](UserDashboard.jsx#L1358) with:
```jsx
<DashboardCard title="Properties">
  <PropertyListUser
    properties={dashboard?.properties}
    emptyText="No properties assigned yet."
  />
</DashboardCard>
```

#### Fix 3: Fetch User-Specific Properties
In [UserDashboard.jsx](UserDashboard.jsx#L76-84) `loadDashboard` function:
```javascript
// Instead of generic getUserDashboard, ensure it fetches user-specific properties
const data = await getUserDashboard(loggedInUserId);
// Backend should return only properties assigned to this user
```

---

## BUG #2: Form Validation - Numeric Fields Accept Invalid Values

### Severity: **HIGH**

### Description
All creation/edit forms allow invalid numeric values without proper validation, potentially causing API errors or data corruption.

### Issues Identified

#### Issue 2A: Empty Number Fields Converted to 0
- **Files**:
  - [CreateGoalForm.jsx](CreateGoalForm.jsx#L89-91) - targetValue, currentValue
  - [CreateCommissionForm.jsx](CreateCommissionForm.jsx#L72) - amount
  - [CreatePropertyForm.jsx](CreatePropertyForm.jsx#L142) - listPrice, salePrice

- **Current Code** (CreateGoalForm lines 89-91):
```javascript
if (targetValue === "" || Number(targetValue) < 0) {
  setError("Target value must be 0 or greater.");
  return;
}
```

- **Problem**: 
  - Check `Number(targetValue) < 0` but doesn't verify it's a valid number
  - Empty string `""` becomes `0` when converted, allowing silent data loss
  - Should reject empty mandatory numeric fields

#### Issue 2B: Negative Values Allowed
- **Problem**: Validation checks `< 0` but allows negatives in some contexts
- **Example**: In [CreatePropertyForm.jsx](CreatePropertyForm.jsx#L142), listPrice validation:
```javascript
if (!listPrice || Number(listPrice) <= 0) {
  setError("List price must be greater than 0.");
  return;
}
```
- While this is correct for listPrice, other numeric fields don't validate properly

#### Issue 2C: No Decimal Validation
- **File**: [CreateCommissionForm.jsx](CreateCommissionForm.jsx#L59)
- **Amount field** has `step="0.01"` but no validation to ensure it's not NaN or Infinity

### Example Failure Scenario
1. User creates Commission with empty amount field
2. Form converts empty string to Number("")
3. API receives `{amount: 0}` silently instead of rejecting
4. User doesn't realize the data was lost

### Affected Files
- [CreateGoalForm.jsx](CreateGoalForm.jsx#L74-110)
- [CreateCommissionForm.jsx](CreateCommissionForm.jsx#L60-80)
- [CreateEventForm.jsx](CreateEventForm.jsx#L87-109)
- [CreatePropertyForm.jsx](CreatePropertyForm.jsx#L130-160)

### Recommended Fix

Add strict validation in all forms:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  setError("");

  // Validate required numeric fields
  if (targetValue === "" || isNaN(Number(targetValue))) {
    setError("Target value is required and must be a number.");
    return;
  }

  if (Number(targetValue) < 0) {
    setError("Target value cannot be negative.");
    return;
  }

  // ... rest of validation
};
```

---

## BUG #3: Edit Functionality - Incomplete State Management

### Severity: **HIGH**

### Description
Users cannot reliably edit items. Edit mode state management is broken, preventing successful edits on second+ attempts.

### Issues Identified

#### Issue 3A: useEffect Dependency Issue
- **Files**:
  - [CreateGoalForm.jsx](CreateGoalForm.jsx#L32-36)
  - [CreateCommissionForm.jsx](CreateCommissionForm.jsx#L25-32)
  - [CreateEventForm.jsx](CreateEventForm.jsx#L17-30)

- **Problem**: The second useEffect depends on `[editingGoal]` but:
  - When form loads for the first time, editingGoal is null
  - Form doesn't properly reset when switching between create/edit modes
  - User changes → Click Cancel → Click Edit on same item → Form data is stale

- **Code** (CreateGoalForm lines 32-45):
```javascript
useEffect(() => {
  if (editingGoal) {
    setTitle(editingGoal.title || "");
    // ... populate fields
    setUserId(editingGoal.user?.id ? String(editingGoal.user.id) : "");
    setMessage("");
    setError("");
  }
}, [editingGoal]);
```

- **Issue**: If user makes changes → error occurs → tries again, the old editingGoal object remains, so useEffect doesn't trigger again

#### Issue 3B: Form Not Resetting After Edit Failure
- **Problem**: `resetForm()` is only called on successful submission
- **Scenario**:
  1. User edits Goal with invalid data
  2. Submit button shows error
  3. User corrects the data and tries again
  4. Form still has old state from first attempt mixed with new edits
  
- **Missing**: Reset form state on error or allow user to manually clear

#### Issue 3C: onRefresh Prop Not Propagated
- **Files**:
  - [GoalManagementPanel.jsx](GoalManagementPanel.jsx#L47-50)
  - [CommissionManagementPanel.jsx](CommissionManagementPanel.jsx#L47-50)
  - [EventManagementPanel.jsx](EventManagementPanel.jsx#L47-50)
  - [PropertyManagementPanel.jsx](PropertyManagementPanel.jsx#L47-50)

- **Code** (GoalManagementPanel lines 47-50):
```javascript
const handleFormSuccess = async () => {
  await fetchGoals();
  setEditingGoal(null);
  if (onRefresh) onRefresh();
};
```

- **Problem**: `onRefresh` is called but the prop is never passed from parent component
- **Impact**: AdminDashboard doesn't know data changed, summary totals don't update

### Example Failure Scenario
1. Admin clicks "Edit" on a Goal
2. Form shows current values
3. Admin makes changes but submits invalid data
4. Error message appears
5. Admin corrects the data
6. Clicks Submit again
7. **Bug**: Form data might not update properly because editingGoal object hasn't changed
8. Submit fails or uses stale data

### Recommended Fix

#### Fix 3A: Improve useEffect Logic
```javascript
useEffect(() => {
  if (editingGoal) {
    setTitle(editingGoal.title || "");
    // ... populate all fields
  } else {
    resetForm(); // Reset when no item is being edited
  }
}, [editingGoal, users]); // Include users as dependency
```

#### Fix 3B: Add Manual Clear Option
Add button to clear form state after errors.

#### Fix 3C: Create Custom Hook for Edit Management
```javascript
function useEditableItem() {
  const [editing, setEditing] = useState(null);
  const [formState, setFormState] = useState({});
  
  const startEdit = (item) => {
    setEditing(item);
    setFormState(item);
  };
  
  const cancelEdit = () => {
    setEditing(null);
    setFormState({});
  };
  
  return { editing, formState, startEdit, cancelEdit };
}
```

---

## BUG #4: Event DateTime Handling - Timezone Issues

### Severity: **MEDIUM**

### Description
Event date/time is split into separate inputs and combined, which can cause timezone issues and date parsing errors.

### Issues Identified

#### Issue 4A: DateTime String Construction
- **File**: [CreateEventForm.jsx](CreateEventForm.jsx#L96-109)
- **Code**:
```javascript
const formattedDateTime = `${eventDate}T${eventTime}:00`;

const eventData = {
  // ...
  eventDate: formattedDateTime,
  // ...
};
```

- **Problem**:
  - Combines date and time as local string: "2024-04-21T14:30:00"
  - Backend may interpret as different timezone
  - No UTC conversion or timezone awareness
  - Displays inconsistently across browsers/regions

#### Issue 4B: Edit Mode DateTime Parsing
- **File**: [CreateEventForm.jsx](CreateEventForm.jsx#L65-75)
- **Code**:
```javascript
if (editingEvent.eventDate) {
  const eventDateObj = new Date(editingEvent.eventDate);
  
  const year = eventDateObj.getFullYear();
  const month = String(eventDateObj.getMonth() + 1).padStart(2, "0");
  // ...
  setEventDate(`${year}-${month}-${day}`);
  setEventTime(`${hours}:${minutes}`);
}
```

- **Problem**:
  - `new Date(isoString)` interprets as UTC, but then displays in local time
  - If backend stores in UTC and frontend interprets as local, times appear shifted
  - User edits event, time changes to different value

### Example Failure Scenario
1. Admin creates event "2024-04-21T14:30:00" (local time)
2. Backend stores as UTC
3. Admin later edits event
4. Time shows different value (UTC vs local conversion issue)
5. Admin saves, unintentionally changing the event time

### Recommended Fix

```javascript
// When sending to API, always use ISO format with timezone
const eventDateTime = new Date(
  `${eventDate}T${eventTime}`
).toISOString();

const eventData = {
  // ...
  eventDate: eventDateTime, // Properly formatted UTC ISO string
  // ...
};

// When loading from API for editing
if (editingEvent.eventDate) {
  const dt = new Date(editingEvent.eventDate); // Backend's ISO string
  setEventDate(dt.toLocaleDateString('en-CA')); // Proper local format
  setEventTime(dt.toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'}));
}
```

---

## BUG #5: Service Layer - No Error Handling

### Severity: **HIGH**

### Description
[dashboardService.js](dashboardService.js) has no error handling, causing unhandled promise rejections and poor error messages.

### Issues Identified

#### Issue 5A: Unhandled Promise Rejections
- **File**: [dashboardService.js](dashboardService.js#L1-150)
- **All functions lack error handling**:
```javascript
export const getGoals = async () => {
  const response = await axios.get(`${API_BASE_URL}/goals`);
  return response.data;
  // No error handling! If network fails, promise rejects
};
```

#### Issue 5B: Silent Failures
- **Impact**: When API fails, error propagates up through entire call chain
- **Result**: Components get unhandled rejections, console errors, unclear user feedback

#### Issue 5C: No Retry Logic
- **Problem**: Transient network errors cause permanent failures
- **Expected**: Should retry failed requests automatically

### Recommended Fix

Create centralized error handling wrapper:
```javascript
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.status, error.message);
    // Transform error for consistency
    return Promise.reject({
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'Unknown error',
      originalError: error
    });
  }
);

export const getGoals = async () => {
  try {
    const response = await axiosInstance.get('/goals');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch goals:', error);
    throw error;
  }
};
```

---

## BUG #6: Missing User-Specific Data Fetching

### Severity: **HIGH**

### Description
Many endpoints return all data instead of filtering by authenticated user, causing data visibility and performance issues.

### Issues Identified

#### Issue 6A: getProperties Returns All Properties
- **File**: [dashboardService.js](dashboardService.js#L114-116)
- **Problem**: No user filtering
- **Expected**: Should return only properties assigned to the current user

#### Issue 6B: No User Context in API Calls
- **Problem**: Frontend doesn't send userId context to most endpoints
- **Hypothesis**: Backend should determine user from auth token, but unclear if implemented

#### Issue 6C: AdminDashboard Shows All Data
- **Problem**: PropertyList, GoalList, etc. don't filter by admin role vs regular user
- **Expected**: Admin sees all data; regular user sees only assigned data

### Recommended Fix

Create user-specific service methods:
```javascript
// In dashboardService.js
export const getUserGoals = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/goals/user/${userId}`);
  return response.data;
};

export const getUserProperties = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/properties/user/${userId}`);
  return response.data;
};
```

Use in UserDashboard:
```javascript
const loadDashboard = async () => {
  try {
    const data = await getUserDashboard(loggedInUserId);
    // Backend returns only user's data
    setDashboard(data);
  } catch (err) {
    setError("Failed to load dashboard.");
  }
};
```

---

## BUG #7: Form Field Step Attribute Issues

### Severity: **LOW**

### Description
Number inputs have step attributes but form validation doesn't enforce them.

### Issue
- **File**: [CreateCommissionForm.jsx](CreateCommissionForm.jsx#L59)
- **Code**:
```html
<input
  type="number"
  step="0.01"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
/>
```

- **Problem**: `step="0.01"` is UI hint only; doesn't validate submission
- **Expected**: Validation should enforce decimal places

---

## Summary Table

| Bug # | Title | Severity | Impact | Status |
|-------|-------|----------|--------|--------|
| 1 | Properties not showing on user end | CRITICAL | Data not visible to end users | Needs fix |
| 2 | Form validation - numeric fields accept invalid values | HIGH | Silent data loss, API errors | Needs fix |
| 3 | Edit functionality - incomplete state management | HIGH | Editing fails on 2+ attempts | Needs fix |
| 4 | Event datetime handling - timezone issues | MEDIUM | Event times show incorrectly | Needs fix |
| 5 | Service layer - no error handling | HIGH | Unhandled rejections, poor UX | Needs fix |
| 6 | Missing user-specific data fetching | HIGH | Data visibility issues | Needs fix |
| 7 | Form field step attribute issues | LOW | Invalid decimal inputs | Needs fix |

---

## Recommended Fix Priority

### Phase 1 (Critical - Fix Immediately)
1. **Bug #1**: Properties visibility - Blocks core feature
2. **Bug #5**: Add error handling - Foundation for stability

### Phase 2 (High Priority - Fix in Current Sprint)
3. **Bug #2**: Form validation - Prevents data corruption
4. **Bug #3**: Edit state management - Affects user experience
5. **Bug #6**: User-specific data - Security and correctness

### Phase 3 (Medium Priority - Fix Next Sprint)
6. **Bug #4**: DateTime handling - Data consistency
7. **Bug #7**: Step attribute - Input validation

---

## Testing Recommendations

### For Bug #1 (Properties Visibility)
```
1. Create property in admin panel assigned to user A
2. Log in as user A
3. Verify property appears in UserDashboard
4. Verify all property details display correctly
5. Repeat with multiple users
```

### For Bug #2 (Form Validation)
```
1. Try creating Goal with empty numeric fields
2. Try creating Commission with empty amount
3. Verify proper error messages
4. Verify data is not saved on validation failure
```

### For Bug #3 (Edit Functionality)
```
1. Edit a Goal - should work
2. Make changes and encounter error
3. Fix error and try again
4. Verify data updates correctly
5. Edit again immediately
6. Verify no stale data issues
```

### For Bug #4 (DateTime Handling)
```
1. Create event in one timezone
2. Login from different timezone
3. Verify event time displays correctly
4. Edit event and verify time doesn't change
```

---

## Files Requiring Changes

- [dashboardService.js](dashboardService.js) - Add error handling, user-specific endpoints
- [CreateGoalForm.jsx](CreateGoalForm.jsx) - Improve validation, fix edit state
- [CreateCommissionForm.jsx](CreateCommissionForm.jsx) - Improve validation, fix edit state
- [CreateEventForm.jsx](CreateEventForm.jsx) - Fix datetime handling, improve validation
- [CreatePropertyForm.jsx](CreatePropertyForm.jsx) - Improve validation, fix edit state
- [UserDashboard.jsx](UserDashboard.jsx) - Fix property display, use proper component
- [GoalManagementPanel.jsx](GoalManagementPanel.jsx) - Propagate onRefresh, improve state
- [CommissionManagementPanel.jsx](CommissionManagementPanel.jsx) - Propagate onRefresh
- [EventManagementPanel.jsx](EventManagementPanel.jsx) - Propagate onRefresh
- [PropertyManagementPanel.jsx](PropertyManagementPanel.jsx) - Propagate onRefresh, add user filter
