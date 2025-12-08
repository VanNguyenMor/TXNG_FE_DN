# Phân Tích Status/Effect từ Mobile Code

## 🔍 Phát Hiện Quan Trọng

### **1. STAMP_STATUSES_BROWSE (Trạng thái DUYỆT)**

**Mobile:**
```javascript
const STAMP_STATUSES_BROWSE = [
    { value: 0, label: 'Mới tạo' },
    { value: 1, label: 'Chờ duyệt' },
    { value: 2, label: 'Đã duyệt' },
    { value: 3, label: 'Không duyệt' },
];
```

**React (Hiện tại):**
```javascript
STATUS_OPTIONS: [
  { id: 0, title: "Chờ duyệt" },
  { id: 1, title: "Đã duyệt" },
  { id: 2, title: "Cấp phép" },
  { id: 4, title: "Không cấp phép" },
],
```

**❌ KHÁC NHAU:**
- Mobile: 0 = "Mới tạo", 1 = "Chờ duyệt", 2 = "Đã duyệt", 3 = "Không duyệt"
- React: 0 = "Chờ duyệt", 1 = "Đã duyệt", 2 = "Cấp phép", 4 = "Không cấp phép"

---

### **2. STAMP_STATUSES_LICENSE (Trạng thái CẤP PHÉP)**

**Mobile:**
```javascript
const STAMP_STATUSES_LICENSE = [
    { value: 0, label: 'Chưa hiệu lực' },
    { value: 1, label: 'Chờ cấp phép' },
    { value: 2, label: 'Có hiệu lực' },
    { value: 3, label: 'Không cấp phép' },
];
```

**React (Hiện tại):**
```javascript
EFFECT_OPTIONS: [
  { id: 0, title: "Chưa hiệu lực" },
  { id: 1, title: "Có hiệu lực" },
  { id: 2, title: "Chờ cấp phép" },
  { id: 3, title: "Không cấp phép" },
],
```

**❌ KHÁC NHAU:**
- Mobile: 0 = "Chưa hiệu lực", 1 = "Chờ cấp phép", 2 = "Có hiệu lực", 3 = "Không cấp phép"
- React: 0 = "Chưa hiệu lực", 1 = "Có hiệu lực", 2 = "Chờ cấp phép", 3 = "Không cấp phép"

---

### **3. STAMP_STATUSES (Master Data với Color Mapping)**

**Mobile:**
```javascript
const STAMP_STATUSES = [
    {
        titleBrowse: 'Mới tạo',
        titleLicense: 'Chưa hiệu lực',
        color: '#7F7F7F',
    },
    {
        titleBrowse: 'Chờ duyệt',
        titleLicense: 'Chờ cấp phép',
        color: '#1B11DE',
    },
    {
        titleBrowse: 'Đã duyệt',
        titleLicense: 'Có hiệu lực',
        color: '#00B050',
    },
    {
        titleBrowse: 'Không duyệt',
        titleLicense: 'Không cấp phép',
        color: '#F00000',
    },
];
```

**Key Point:**
- Index 0: Gray (#7F7F7F) = Mới tạo / Chưa hiệu lực
- Index 1: Blue (#1B11DE) = Chờ duyệt / Chờ cấp phép
- Index 2: Green (#00B050) = Đã duyệt / Có hiệu lực
- Index 3: Red (#F00000) = Không duyệt / Không cấp phép

---

## 📊 Mapping Comparison Table

| Index | titleBrowse (status) | titleLicense (requestedUsedStatus) | Color |
|-------|---------------------|-----------------------------------|-------|
| 0 | Mới tạo | Chưa hiệu lực | #7F7F7F (Gray) |
| 1 | Chờ duyệt | Chờ cấp phép | #1B11DE (Blue) |
| 2 | Đã duyệt | Có hiệu lực | #00B050 (Green) |
| 3 | Không duyệt | Không cấp phép | #F00000 (Red) |

---

## 🚨 ĐIỂM LỖI CẦN SỬA TRONG REACT

### **Issue 1: Status value = 0 phải là "Mới tạo" chứ không phải "Chờ duyệt"**

**Hiện tại (Sai):**
```javascript
STATUS_OPTIONS: [
  { id: 0, title: "Chờ duyệt" },        // ❌ Sai
  { id: 1, title: "Đã duyệt" },
  { id: 2, title: "Cấp phép" },
  { id: 4, title: "Không cấp phép" },
],
```

**Phải sửa thành:**
```javascript
STATUS_OPTIONS: [
  { id: 0, title: "Mới tạo" },          // ✅ Đúng
  { id: 1, title: "Chờ duyệt" },
  { id: 2, title: "Đã duyệt" },
  { id: 3, title: "Không duyệt" },
],
```

---

### **Issue 2: Effect value = 1 phải là "Chờ cấp phép" chứ không phải "Có hiệu lực"**

**Hiện tại (Sai):**
```javascript
EFFECT_OPTIONS: [
  { id: 0, title: "Chưa hiệu lực" },
  { id: 1, title: "Có hiệu lực" },      // ❌ Sai
  { id: 2, title: "Chờ cấp phép" },     // ❌ Sai
  { id: 3, title: "Không cấp phép" },
],
```

**Phải sửa thành:**
```javascript
EFFECT_OPTIONS: [
  { id: 0, title: "Chưa hiệu lực" },
  { id: 1, title: "Chờ cấp phép" },    // ✅ Đúng
  { id: 2, title: "Có hiệu lực" },     // ✅ Đúng
  { id: 3, title: "Không cấp phép" },
],
```

---

## 📌 Additional Notes

### **Mobile cũng chứa:**

```javascript
const STATUS_STAMP_REQUESTS = {
    ChuaDuyet: 1,    // value = 1
    DaDuyet: 2,      // value = 2
    KhongDuyet: 3,   // value = 3
};
```

Đây là enum constants dùng để so sánh, nhưng định giá trị khác so với array!

---

## 🎯 Action Items

1. **Cập nhật STATUS_OPTIONS** - Thêm "Mới tạo" vào index 0
2. **Cập nhật EFFECT_OPTIONS** - Đổi vị trí "Chờ cấp phép" và "Có hiệu lực"
3. **Thêm Color Mapping** - Tùy chọn: Thêm color vào STATUS_OPTIONS và EFFECT_OPTIONS
4. **Verify API Values** - Kiểm tra API response để chắc chắn values trùng khớp

---

## 📝 Code Analysis Summary

**Mobile code structure (React Native):**
- Uses `value` + `label` format
- STAMP_STATUSES array combines both browse + license titles by index
- Color codes là cơ sở UI

**React code (hiện tại):**
- Uses `id` + `title` format  
- STATUS_OPTIONS và EFFECT_OPTIONS tách riêng
- Chưa có color mapping

**⚠️ Kết luận:** **Cần sửa lại các values trong STATUS_OPTIONS và EFFECT_OPTIONS để match với Mobile code!**
