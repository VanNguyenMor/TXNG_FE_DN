# Payload Alignment Analysis: Web vs Mobile vs Backend

## 1. MODEL COMPARISON (Backend C# Model)

### Product Model Fields (Key ones):
- ProductCode (string)
- ProductName (string)
- Barcode (string)
- ProductGroupID (string)
- ManufactID (string)
- Origin (string)
- UnitID (string)
- ExpiredNum (byte?, nullable)
- ExpiredUnit (byte?, nullable)
- ExpiredType (byte?, nullable)
- Avatar (string) — expects URL/key
- Introduce (string)
- ProductionProcess (string)
- Ingredient (string)
- Storage (string)
- Usage (string)
- Packing (string)
- Images (string) — semicolon-separated URLs
- Accreditation (string) — semicolon-separated URLs (for inspection info)
- Certification (string) — semicolon-separated URLs
- QualityNum (string)

**Missing from current web form**: QualityNum field

---

## 2. CREATE PAYLOAD COMPARISON

### Mobile (example.js, onAdd method):
```javascript
{
  code,                          // ProductCode
  name,                          // ProductName
  unitId,                        // UnitID
  weight,                        // Weight
  expiredNum,                    // ExpiredNum (byte)
  typeDateId,                    // ??? (not in model, expiredUnit?)
  productExpiredType,            // ExpiredType (byte)
  fieldId: chooseFieldReals,     // fields[] (array of IDs)
  productGroupsId,               // ProductGroupID
  productTypeId,                 // ??? (not in model directly)
  originId,                      // Origin
  barCode,                       // Barcode
  qualityNum,                    // QualityNum
  productionProcess,             // ProductionProcess
  introduce,                     // Introduce
  usage,                         // Usage
  storage,                       // Storage
  packing,                       // Packing
  ingredient,                    // Ingredient
  avatar: _avatar,               // Avatar (URL/key)
  imageFiles,                    // Images (semicolon-separated)
  checkFiles,                    // Accreditation
  certificateFiles,              // Certification
  productUnits: [{unitId, value, isReport}]  // ProductsUnit[]
}
```

### Web (ProductManagement/index.js, onConfirm):
```javascript
{
  ProductCode,
  ProductName,
  Barcode,
  fields[0], fields[1], ...      // ✓ Correct index notation
  UnitID,
  ProductGroupID,
  ManufactID,
  Origin,
  ExpiredNum,
  ExpiredUnit,
  ExpiredType,
  Introduce,
  ProductionProcess,
  Ingredient,
  Storage,
  Usage,
  Packing,
  Avatar,                        // ✓ Uploaded URL/key
  Images,                        // ✓ Semicolon-separated
  Accreditation,                 // ✓ Semicolon-separated
  Certification,                 // ✓ Semicolon-separated
  productUnits: JSON.stringify([...])  // ✓ JSON array
}
```

**Issues Found:**
1. ❌ **QualityNum missing** — web form doesn't collect this field
2. ⚠️ **productTypeId** — unclear what backend expects; mobile sends it but Product model doesn't have a field for it directly
3. ✓ Fields, images, avatar handling look correct

---

## 3. GET DETAIL RESPONSE NORMALIZATION

### Mobile (getDetailProduct, example.js line ~664):
```javascript
const response = {
  id, productCode, productName, barcode, ..., productGroupsId,
  productsUnits: [{id, unitId, unitName, value, isReport}],
  productFields: [{id, fieldName}]
};
// Directly assigns to state
this.setState({
  productExpiredType: product.expiredType,
  productGroupsId: product.materialGroupID || product.productGroupsId,
  ...
});
```

### Web (ShowEditData/index.js, loadDetailData):
```javascript
// Normalizes multiple possible API response shapes:
const productFromRes = response.product || response.data?.product || response;
const productsUnits = response.productsUnits || response.data?.productsUnits || [];
const productFields = response.productFields || response.data?.productFields || [];

// initStateFromProps maps:
expiredType: Number(product.expiredType),  // ✓ Convert to number
productGroupsId: product.materialGroupID,   // ✓ Correct
selectedFields: productFields.map(...),     // ✓ Correct
```

**Status**: ✓ Looks good — handles multiple response shapes

---

## 4. FIELD INITIALIZATION COMPARISON

### Mobile State Init:
```javascript
{
  productGroupsId: '',
  productTypes: [],
  productExpiredType: '',
  chooseFields: [],
  qualityNum: '',
  barCode: '',
  ...
}
```

### Web State Init (ShowEditData):
```javascript
{
  productGroupId: null,
  productGroupsId: null,           // ✓ Added for mobile compatibility
  expiredType: null,
  selectedFields: [],
  qualityNum: '',
  barcode: '',
  ...
}
```

**Status**: ✓ Mostly aligned

---

## 5. PRODUCT TYPE FILTERING

### Mobile:
```javascript
getListProductTypeAddComboBox(page, init = true) {
  // Calls endpoint productgroup/getall with filter
  return productTypes filtered by productGroupsId
}
```

### Web:
```javascript
getListProductTypeAddComboBox(page = 0, init = true, filter = '') {
  // Calls productManagement.getListProductType(payload)
  // with filter parameter
  // Sets PRODUCT_TYPE_DATA in state
}

// Child ShowEditData filters:
const filteredProductTypes = (PRODUCT_TYPE_DATA || []).filter(
  (ptype) => ptype.materialGroupID === productGroupId
)
```

**Status**: ✓ Logic is correct

---

## 6. CONTROLLER VALIDATION (example-controller-product.js)

The controller's Create action expects:
```csharp
[FromForm] ProductJs model
```

**ProductJs likely contains**:
- ProductCode, ProductName, Barcode, ✓
- UnitID, ProductGroupID, ManufactID, Origin, ✓
- ExpiredNum, ExpiredUnit, ExpiredType ✓
- fields[] (array binding) ✓
- Introduce, ProductionProcess, Ingredient, Storage, Usage, Packing ✓
- Avatar (string) ✓
- Images, Accreditation, Certification (strings) ✓
- productUnits (complex type — may need JSON or per-index) ⚠️

**Controller does validation** (lines 822-1027):
- Checks fields is not empty
- Validates productType exists
- Validates origin exists
- Validates productGroup exists
- Handles productUnits array

---

## ISSUES & RECOMMENDATIONS

### � FIXED Issues:

1. ✅ **QualityNum field missing** — FIXED
   - Added `formData.append("QualityNum", dataInsert.qualityNum || "")` to onConfirm
   - Field already exists in ShowEditData form

2. ✅ **Weight field missing** — FIXED
   - Added conditional append for Weight:
     ```javascript
     if (dataInsert.weightVal) {
       formData.append('Weight', String(dataInsert.weightVal));
     }
     ```
   - Field already exists in ShowEditData form

3. ✅ **ProductTypeId missing** — FIXED
   - Added `formData.append("ProductTypeID", dataInsert.productCateId || "")` to onConfirm
   - Field already exists in ShowEditData as productCateId (Loại sản phẩm)

### ⚠️ Remaining Issues to Test:

4. **productUnits format** (NEEDS TESTING)
   - Web: Sends as JSON string: `formData.append('productUnits', JSON.stringify(...))`
   - Mobile: May expect different format
   - Backend Controller: May expect per-index form fields instead of JSON
   - **Action**: Test in browser DevTools to verify backend accepts JSON or adjust format

### ✓ Correct Items:

- ProductCode ✓
- ProductName ✓
- Barcode ✓
- fields[] with per-index notation ✓
- UnitID ✓
- ProductGroupID ✓
- ManufactID ✓
- Origin ✓
- ExpiredNum/ExpiredUnit/ExpiredType (with conditional append) ✓
- Introduce, ProductionProcess, Ingredient, Storage, Usage, Packing ✓
- Avatar (as uploaded URL) ✓
- Images/Accreditation/Certification (semicolon-separated) ✓

---

## SUMMARY TABLE

| Field | Backend Model | Mobile | Web Current | Status |
|-------|---------------|--------|-------------|--------|
| ProductCode | ✓ | ✓ | ✓ | OK |
| ProductName | ✓ | ✓ | ✓ | OK |
| Barcode | ✓ | ✓ | ✓ | OK |
| QualityNum | ✓ | ✓ | ✅ FIXED | OK |
| ProductGroupID | ✓ | ✓ | ✓ | OK |
| ProductTypeID | ✓ | ✓ | ✅ FIXED | OK |
| UnitID | ✓ | ✓ | ✓ | OK |
| ManufactID | ✓ | ✓ | ✓ | OK |
| Origin | ✓ | ✓ | ✓ | OK |
| Weight | ✓ | ✓ | ✅ FIXED | OK |
| ExpiredNum | ✓ | ✓ | ✓ | OK |
| ExpiredUnit | ✓ | ✓ | ✓ | OK |
| ExpiredType | ✓ | ✓ | ✓ | OK |
| Avatar | ✓ | ✓ | ✓ | OK |
| Introduce | ✓ | ✓ | ✓ | OK |
| ProductionProcess | ✓ | ✓ | ✓ | OK |
| Ingredient | ✓ | ✓ | ✓ | OK |
| Storage | ✓ | ✓ | ✓ | OK |
| Usage | ✓ | ✓ | ✓ | OK |
| Packing | ✓ | ✓ | ✓ | OK |
| Images | ✓ | ✓ | ✓ | OK |
| Accreditation | ✓ | ✓ | ✓ | OK |
| Certification | ✓ | ✓ | ✓ | OK |
| fields[] | N/A | ✓ | ✓ | OK |
| productUnits | ProductsUnit[] | ✓ | ⚠️ JSON | NEEDS TEST |

---

## NEXT STEPS

1. **Add QualityNum field** to ShowEditData form
2. **Add Weight field** to FormData append in onConfirm
3. **Verify productTypeId** is being sent (currently missing from FormData append)
4. **Test productUnits JSON** format vs per-index to confirm backend accepts it
5. **Run create/update flow** and inspect network payload to verify all fields present

