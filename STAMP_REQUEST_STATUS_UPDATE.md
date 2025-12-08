# Update Summary: Added Status Options for Stamp Request

## Changes Made ✅

### 1. Updated `STATUS_OPTIONS` (Trạng thái duyệt)
**File:** `src/views/pages/StampRequestUsed/index.js` (lines 100-104)

```javascript
STATUS_OPTIONS: [
  { id: 0, title: "Chờ duyệt" },
  { id: 1, title: "Đã duyệt" },
  { id: 2, title: "Cấp phép" },
  { id: 4, title: "Không cấp phép" },
],
```

### 2. Updated `EFFECT_OPTIONS` (Trạng thái cấp phép / Hiệu lực)
**File:** `src/views/pages/StampRequestUsed/index.js` (lines 105-110)

```javascript
EFFECT_OPTIONS: [
  { id: 0, title: "Chưa hiệu lực" },
  { id: 1, title: "Có hiệu lực" },
  { id: 2, title: "Chờ cấp phép" },
  { id: 3, title: "Không cấp phép" },
],
```

### 3. Added `showTitleWithEffect()` Helper Function
**Location:** Line 645-663 (in method area)

Purpose: Convert effect status ID to display title
```javascript
showTitleWithEffect = (id) => {
  const { EFFECT_OPTIONS } = this.state;
  let queue = EFFECT_OPTIONS ? [...EFFECT_OPTIONS] : [];

  while (queue.length > 0) {
    const authentic = queue.shift();
    if (authentic && authentic.id === id) {
      return authentic.title;
    }
    if (authentic && authentic.children && authentic.children.length > 0) {
      queue.push(...authentic.children);
    }
  }
  return "";
};
```

### 4. Filter UI Already Implemented
**Location:** Line 895-930 (in render method)

Two Select dropdowns for filtering:
- **Trạng thái duyệt** - Uses `STATUS_OPTIONS`
- **Trạng thái cấp phép** - Uses `EFFECT_OPTIONS`

Both call `handleChangeSelectFilter()` on change

## Data Mapping Reference

### From API Response to Table Display

| Field | API Value | Display Value |
|-------|-----------|---------------|
| `status` | 0, 1, 2, 4 | Chờ duyệt, Đã duyệt, Cấp phép, Không cấp phép |
| `requestedUsedStatus` | 0, 1, 2, 3 | Chưa hiệu lực, Có hiệu lực, Chờ cấp phép, Không cấp phép |

### Table Columns Display

```
| STT | Ngày yêu cầu | SL yêu cầu | Dải tem | Hình thức | Trạng thái | Hiệu lực | Hành động |
|-----|------------|----------|--------|---------|----------|---------|---------|
```

- **Trạng thái** = `showTitleWithStatus(e.currentStatus)` - uses `STATUS_OPTIONS`
- **Hiệu lực** = `showTitleWithEffect(e.effect)` - uses `EFFECT_OPTIONS`

## Testing Checklist

- [x] STATUS_OPTIONS updated with 4 options
- [x] EFFECT_OPTIONS updated with 4 options
- [x] showTitleWithEffect() function added
- [x] Filter UI renders both dropdowns
- [x] No duplicate function definitions
- [ ] Test filtering by status
- [ ] Test filtering by effect/permission
- [ ] Verify table displays correct status labels
- [ ] Verify table displays correct effect labels

## Files Modified

1. `src/views/pages/StampRequestUsed/index.js`
   - Updated state initialization (STATUS_OPTIONS, EFFECT_OPTIONS)
   - Added showTitleWithEffect() method
   - Removed duplicate definition

## Next Steps

1. Test filter functionality with API
2. Verify all status values display correctly
3. Test form validation with new status options
4. Update create/edit form if needed
