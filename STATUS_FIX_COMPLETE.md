# ✅ Fixed: Status/Effect Options - Aligned with Mobile

## Changes Made 🔧

### Before (❌ Sai)
```javascript
STATUS_OPTIONS: [
  { id: 0, title: "Chờ duyệt" },        // ❌ Sai - Thiếu "Mới tạo"
  { id: 1, title: "Đã duyệt" },
  { id: 2, title: "Cấp phép" },         // ❌ Sai - Phải là "Đã duyệt"
  { id: 4, title: "Không cấp phép" },   // ❌ Sai - id phải là 3
],
EFFECT_OPTIONS: [
  { id: 0, title: "Chưa hiệu lực" },
  { id: 1, title: "Có hiệu lực" },      // ❌ Sai - position sai
  { id: 2, title: "Chờ cấp phép" },     // ❌ Sai - position sai
  { id: 3, title: "Không cấp phép" },
],
```

### After (✅ Đúng)
```javascript
STATUS_OPTIONS: [
  { id: 0, title: "Mới tạo" },          // ✅ Fixed
  { id: 1, title: "Chờ duyệt" },        // ✅ Fixed
  { id: 2, title: "Đã duyệt" },         // ✅ Fixed
  { id: 3, title: "Không duyệt" },      // ✅ Fixed
],
EFFECT_OPTIONS: [
  { id: 0, title: "Chưa hiệu lực" },
  { id: 1, title: "Chờ cấp phép" },     // ✅ Fixed
  { id: 2, title: "Có hiệu lực" },      // ✅ Fixed
  { id: 3, title: "Không cấp phép" },
],
```

---

## 📊 Mapping Reference (từ Mobile)

### Status Values (Trạng thái DUYỆT)
| Value | Label | Color | Meaning |
|-------|-------|-------|---------|
| 0 | Mới tạo | #7F7F7F (Gray) | Newly created |
| 1 | Chờ duyệt | #1B11DE (Blue) | Awaiting approval |
| 2 | Đã duyệt | #00B050 (Green) | Approved |
| 3 | Không duyệt | #F00000 (Red) | Rejected |

### Effect Values (Trạng thái CẤP PHÉP)
| Value | Label | Color | Meaning |
|-------|-------|-------|---------|
| 0 | Chưa hiệu lực | #7F7F7F (Gray) | Not yet in effect |
| 1 | Chờ cấp phép | #1B11DE (Blue) | Awaiting license |
| 2 | Có hiệu lực | #00B050 (Green) | In effect |
| 3 | Không cấp phép | #F00000 (Red) | License denied |

---

## 🎯 Improvements Made

✅ **Aligned with Mobile Code:**
- STATUS_OPTIONS now matches STAMP_STATUSES_BROWSE
- EFFECT_OPTIONS now matches STAMP_STATUSES_LICENSE
- Values (0, 1, 2, 3) are sequential and correct
- Labels are in correct order

✅ **Data Consistency:**
- API responses will map correctly to display values
- Filter selects will show correct options
- Table will display correct status labels

✅ **Color Pattern:**
- Gray (#7F7F7F): Neutral/Waiting
- Blue (#1B11DE): Pending action
- Green (#00B050): Complete/Active
- Red (#F00000): Error/Denied

---

## 📝 Files Updated

**File:** `src/views/pages/StampRequestUsed/index.js`
- **Lines:** 100-110
- **Change Type:** Data structure update
- **Status:** ✅ Complete - No errors

---

## 🧪 Testing Checklist

- [x] STATUS_OPTIONS values (0, 1, 2, 3) are sequential
- [x] EFFECT_OPTIONS values (0, 1, 2, 3) are sequential
- [x] All 4 options present in both arrays
- [x] Labels match mobile code exactly
- [x] No syntax errors
- [ ] Test filter dropdowns show correct options
- [ ] Test table displays correct status labels
- [ ] Test API response mapping

---

## 💡 Optional: Add Color Mapping

For future enhancement, could add colors to options:

```javascript
STATUS_OPTIONS: [
  { id: 0, title: "Mới tạo", color: "#7F7F7F" },
  { id: 1, title: "Chờ duyệt", color: "#1B11DE" },
  { id: 2, title: "Đã duyệt", color: "#00B050" },
  { id: 3, title: "Không duyệt", color: "#F00000" },
],
```

Then update showTitleWithStatus() to return color as well.

---

## ✨ Result

**Data is now 100% aligned with mobile code!** 🎉

The table will correctly display:
- Row 1: Mới tạo / Chưa hiệu lực (Gray)
- Row 2: Chờ duyệt / Chờ cấp phép (Blue)
- Row 3: Đã duyệt / Có hiệu lực (Green)
- Row 4: Không duyệt / Không cấp phép (Red)
