# ProductManagement Web Form - Backend Alignment Fixes

## Date: December 4, 2025

### Summary
Fixed payload alignment between web (ProductManagement) and backend (Product Controller/Model) by adding missing form fields to the create/update payload and ensuring all model properties are properly mapped.

---

## Changes Made

### 1. Added QualityNum to FormData
**File**: `src/views/pages/ProductManagement/index.js`
**Location**: `onConfirm` method, after Origin field

```javascript
formData.append("QualityNum", dataInsert.qualityNum || "");
```

**Reason**: 
- Backend Product model has `QualityNum` property
- Mobile sends this field to create endpoint
- Web form already collects this value (input exists in ShowEditData)
- Was not being included in the payload

**Status**: ✅ FIXED

---

### 2. Added Weight to FormData
**File**: `src/views/pages/ProductManagement/index.js`
**Location**: `onConfirm` method, after QualityNum

```javascript
if (dataInsert.weightVal) {
  formData.append('Weight', String(dataInsert.weightVal));
}
```

**Reason**:
- Backend Product model has `Weight` property (string)
- Mobile sends this field
- Web form collects `weightVal`
- Was not being included in payload (only appended if truthy to avoid empty submissions)

**Status**: ✅ FIXED

---

### 3. Added ProductTypeID to FormData
**File**: `src/views/pages/ProductManagement/index.js`
**Location**: `onConfirm` method, after ProductGroupID

```javascript
formData.append("ProductTypeID", dataInsert.productCateId || "");
```

**Reason**:
- Backend validates ProductTypeID exists (controller lines ~1030-1035)
- Web form has productCateId select (Loại sản phẩm / Product Type)
- Mobile sends productTypeId to create endpoint
- Was not being included in payload

**Status**: ✅ FIXED

---

## Payload Structure - Before vs After

### Before (Missing 3 fields):
```javascript
FormData {
  ProductCode: "CODE001"
  ProductName: "Product Name"
  Barcode: "123456"
  UnitID: "unit_id"
  ProductGroupID: "group_id"
  // ❌ Missing: QualityNum
  // ❌ Missing: Weight
  // ❌ Missing: ProductTypeID
  ManufactID: "...,"
  Origin: "...",
  ExpiredNum: "1",
  ExpiredUnit: "30",
  ExpiredType: "0",
  Avatar: "https://...",
  Images: "https://...;https://...",
  Accreditation: "https://...",
  Certification: "https://...",
  fields[0]: "field_id_1",
  fields[1]: "field_id_2",
  productUnits: "[{...}]" (JSON),
  ... (other fields)
}
```

### After (All fields):
```javascript
FormData {
  ProductCode: "CODE001"
  ProductName: "Product Name"
  Barcode: "123456"
  fields[0]: "field_id_1",
  fields[1]: "field_id_2",
  UnitID: "unit_id"
  ProductGroupID: "group_id"
  ProductTypeID: "type_id"  // ✅ ADDED
  ManufactID: "...,"
  Origin: "...",
  QualityNum: "123"  // ✅ ADDED
  Weight: "50"  // ✅ ADDED
  ExpiredNum: "1",
  ExpiredUnit: "30",
  ExpiredType: "0",
  Avatar: "https://...",
  Images: "https://...;https://...",
  Accreditation: "https://...",
  Certification: "https://...",
  productUnits: "[{...}]" (JSON),
  ... (other fields)
}
```

---

## Alignment Verification

✅ **Verified Correct**:
- ProductCode, ProductName, Barcode → Direct match with backend model
- UnitID → Maps to Product.UnitID
- ProductGroupID → Maps to Product.ProductGroupID
- ManufactID → Maps to Product.ManufactID
- Origin → Maps to Product.Origin
- ExpiredNum, ExpiredUnit, ExpiredType → byte? nullable fields, conditional append implemented
- Avatar → Sent as URL string (pre-uploaded)
- Images, Accreditation, Certification → Semicolon-separated strings
- fields[] → Per-index notation for FormData binding
- productUnits → Sent as JSON string

⚠️ **Requires Testing**:
- productUnits JSON format (verify backend accepts JSON vs per-index form fields)

---

## Files Modified

1. **src/views/pages/ProductManagement/index.js**
   - `onConfirm` method: Added QualityNum, Weight, ProductTypeID to FormData

2. **src/views/pages/ProductManagement/ShowEditData.js**
   - No changes needed (QualityNum and weightVal already exist in state and form)

3. **PAYLOAD_ALIGNMENT_ANALYSIS.md** (new file)
   - Detailed comparison of mobile, web, and backend payloads
   - Summary table of all fields

---

## Testing Checklist

- [ ] Create new product with all fields filled
  - [ ] Verify network payload includes QualityNum
  - [ ] Verify network payload includes Weight
  - [ ] Verify network payload includes ProductTypeID
  - [ ] Verify response 200 (success)
- [ ] Edit existing product
  - [ ] Verify QualityNum, Weight, ProductTypeID are preserved
  - [ ] Verify response 200 (success)
- [ ] Verify product type filtering works
  - [ ] Select product group → types list updates
  - [ ] ProductTypeID sent correctly
- [ ] Verify productUnits format
  - [ ] Check if backend accepts JSON string format
  - [ ] If not, adjust to per-index notation: `productUnits[0].unitId`, etc.

---

## Related Issues Fixed

1. Select component treating 0 as falsy value (fixed in Select/index.js)
2. expiredType initialization to Number type (fixed in ShowEditData.js)
3. Nullable numeric fields appended only when meaningful (implemented in onConfirm)
4. Avatar pre-upload and URL sending (implemented)
5. Image gallery upload and semicolon formatting (implemented)
6. Multi-select fields with per-index notation (implemented)
7. Product type filtering by group (implemented with getListProductTypeAddComboBox)

---

## Notes

- All missing fields identified through comparison of:
  - Backend Product model (example-model-mobile.js)
  - Backend Controller Create action (example-controller-product.js)
  - Mobile implementation (example.js)
  - Current web implementation (ProductManagement/ShowEditData)

- QualityNum field was actually already in the form but just wasn't sent
- Weight field naming: state uses `weightVal`, FormData key is `Weight` (correct)
- ProductTypeID field naming: state uses `productCateId`, FormData key is `ProductTypeID` (standard backend naming)

