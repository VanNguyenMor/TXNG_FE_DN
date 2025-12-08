# Status vs Effect (Trạng thái vs Hiệu lực) - Phân Biệt

## 📋 Từ File Example.js

### **Key Discovery:**
```javascript
// Line 313-314: Status phân thành 2 loại
let titleBrowse = STAMP_STATUSES[status || 0].titleBrowse;              // Trạng thái duyệt
let titleLicense = STAMP_STATUSES[requestedUsedStatus || 0].titleLicense; // Trạng thái cấp phép
```

### **API Fields Mapping:**

| Field API | Ý Nghĩa | VN | Select UI |
|-----------|---------|-----|-----------|
| `status` | **Trạng thái DUYỆT** | Tình trạng duyệt yêu cầu | "Trạng thái duyệt" |
| `requestedUsedStatus` | **Trạng thái CẤP PHÉP** | Tình trạng cấp phép tem | "Trạng thái cấp phép" |

### **Status Values Explained:**

#### **1. `status` - Trạng thái DUYỆT (Approval Status)**

```javascript
// STAMP_STATUSES_BROWSE options
0 = "Chờ duyệt"          // Waiting for approval
1 = "Đã duyệt"            // Approved
2 = "Cấp phép"            // Licensed/Certified
3 = "Từ chối"             // Rejected
4 = "Không cấp phép"     // Not approved
```

**Usage in example.js:**
- Line 320: `let showDeliveryDate = status == 2 && requestedUsedStatus != 3;`
  → Chỉ show delivery date khi status = 2 (Cấp phép)
- Line 321: `let showRequestBrowse = status == 0 && requestedUsedStatus == 0;`
  → Chỉ show request button khi status = 0 (Chờ duyệt)
- Line 322: `let showRequestBrowseFile = status == 3 && requestedUsedStatus == 0;`
  → Chỉ show file upload khi status = 3 (Từ chối)

#### **2. `requestedUsedStatus` - Trạng thái CẤP PHÉP (License Status)**

```javascript
// STAMP_STATUSES_LICENSE options
0 = "Chưa hiệu lực"       // Not yet in effect
1 = "Có hiệu lực"         // In effect
2 = "Chờ cấp phép"        // Awaiting license
3 = "Không cấp phép"      // License denied
```

**Usage in example.js:**
- Line 323: `let showRequestLicense = (status == 2 && requestedUsedStatus == 0) || (status == 2 && requestedUsedStatus == 3);`
  → Chỉ show request license khi cần cấp phép
- Line 325: `let showPrint = status == 2 && requestedUsedStatus == 2 && isPrint;`
  → Chỉ show print button khi đã cấp phép
- Line 327: `let showPaymentButton = status == 4 && isPrint == false;`
  → Chỉ show payment khi không được cấp phép

### **Visual Representation - Table Columns:**

```
┌───┬──────────────┬────────────┬────────────┬─────────────┐
│STT│ Ngày yêu cầu │ SL yêu cầu │ Dải tem    │ Hình thức   │
├───┼──────────────┼────────────┼────────────┼─────────────┤
│   │              │            │            │             │
│   │ [Trạng thái DUYỆT] │ [Trạng thái CẤP PHÉP] │          │
│   │                   │                 │
│ 1 │ 04/10/2025   │ 20        │ -          │ Yêu cầu in  │
│   │ Chờ duyệt    │           │            │ Chưa hiệu lực
│   │              │           │            │             │
│ 2 │ 03/10/2025   │ 30        │ 4341-4370  │ Tự in       │
│   │ Đã duyệt     │           │            │ Có hiệu lực │
│   │              │           │            │             │
└───┴──────────────┴────────────┴────────────┴─────────────┘
```

### **Filter UI Structure:**

```javascript
// Line 1472-1490 in example.js
<View style={[style.filter, style.marginFilter]}>
  <Text>Trạng thái duyệt</Text>  {/* = status field */}
  <RNPickerSelect
    items={STAMP_STATUSES_BROWSE}  {/* [0: Chờ duyệt, 1: Đã duyệt, ...] */}
    onValueChange={this.onChangeStatusBrowse}
  />
</View>

<View style={[style.filter, style.marginFilter]}>
  <Text>Trạng thái cấp phép</Text>  {/* = requestedUsedStatus field */}
  <RNPickerSelect
    items={STAMP_STATUSES_LICENSE}  {/* [0: Chưa hiệu lực, 1: Có hiệu lực, ...] */}
    onValueChange={this.onChangeStatusLicense}
  />
</View>
```

---

## 🔍 Comparison Matrix

| Aspect | `status` (Duyệt) | `requestedUsedStatus` (Cấp Phép) |
|--------|-------------------|----------------------------------|
| **Mục đích** | Duyệt yêu cầu | Cấp phép tem |
| **Mục tiêu** | Trạng thái thẩm định | Tình trạng có giấy phép |
| **Giá trị** | 0, 1, 2, 3, 4 | 0, 1, 2, 3 |
| **Label** | "Trạng thái duyệt" | "Trạng thái cấp phép" |
| **Điều kiện** | approval workflow | license workflow |
| **Hiển thị** | titleBrowse | titleLicense |

---

## ✅ Cách Đã Cập Nhật Trong React Component

File: `src/views/pages/StampRequestUsed/index.js`

```javascript
// Line 100-110
STATUS_OPTIONS: [
  { id: 0, title: "Chờ duyệt" },
  { id: 1, title: "Đã duyệt" },
  { id: 2, title: "Cấp phép" },
  { id: 4, title: "Không cấp phép" },
],
EFFECT_OPTIONS: [
  { id: 0, title: "Chưa hiệu lực" },
  { id: 1, title: "Có hiệu lực" },
  { id: 2, title: "Chờ cấp phép" },
  { id: 3, title: "Không cấp phép" },
],
```

### **Helper Functions:**

```javascript
// Line 645-663: showTitleWithEffect()
showTitleWithEffect = (id) => {
  const { EFFECT_OPTIONS } = this.state;
  // Convert effect ID to display title
  // Uses EFFECT_OPTIONS
}

// Line 665-683: showTitleWithStatus()
showTitleWithStatus = (id) => {
  const { STATUS_OPTIONS } = this.state;
  // Convert status ID to display title
  // Uses STATUS_OPTIONS
}
```

### **Table Display:**

```javascript
// In renderTable() method
<td>{this.showTitleWithStatus(e.currentStatus)}</td>  {/* Uses STATUS_OPTIONS */}
<td>{this.showTitleWithEffect(e.effect)}</td>         {/* Uses EFFECT_OPTIONS */}
```

---

## 📌 Summary

**TÓM TẮT PHÂN BIỆT:**

1. **`status`** = "Trạng thái DUYỆT" (Approval)
   - Phản ánh việc duyệt yêu cầu xin cấp tem
   - 5 trạng thái: Chờ duyệt, Đã duyệt, Cấp phép, Từ chối, Không cấp phép
   
2. **`requestedUsedStatus`** = "Trạng thái CẤP PHÉP" (License)
   - Phản ánh việc cấp phép/hiệu lực tem
   - 4 trạng thái: Chưa hiệu lực, Có hiệu lực, Chờ cấp phép, Không cấp phép

**Hai trạng thái song song, độc lập với nhau!**
