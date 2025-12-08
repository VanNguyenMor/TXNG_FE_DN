# Fix Summary: Stamp Request Data Not Loading into Table

## Problem Identified ❌
API returns response in format:
```json
{
    "status": 200,
    "message": "Get success",
    "data": {
        "stamps": [...],
        "total": 23
    }
}
```

But `fetchSummary` was trying to access:
- `res?.requests` ❌ (doesn't exist)
- `res?.data` ✅ (returns `{ stamps: [...] }`)

## Solution Applied ✅

### 1. Updated `fetchSummary()` in `src/views/pages/StampRequestUsed/index.js`

**Changes:**
- ✅ Fixed data extraction to properly handle `res.data.stamps`
- ✅ Added multiple fallback paths for API response handling
- ✅ Fixed field mapping from API fields to table columns:
  - `requestedDate` → `requestDate` (formatted with moment)
  - `quantity` → `totalRequestedQuantity`
  - `startNum` & `endNum` → `stampRange` (format: "startNum - endNum")
  - `isPrint` → `printMethod` (true = "Yêu cầu in", false = "Tự in")
  - `requestedUsedStatus` → `effect` (cấp phép status)
  - `status` → `currentStatus` (trạng thái duyệt)

**Code:**
```javascript
fetchSummary = async (data) => {
  this.setState({ isLoaded: true });

  try {
    const payload = data ? JSON.parse(data) : {};
    const res = await fetchData.stampRequest.getList(payload);
    
    if (!res) {
      this.setState({ isLoaded: false, data: [], collapseList: [] });
      return;
    }

    // ✅ Handle API response { data: { stamps: [...] } }
    let stampRequests = [];
    
    if (res.data && res.data.stamps && Array.isArray(res.data.stamps)) {
      stampRequests = res.data.stamps;
    } else if (res.stamps && Array.isArray(res.stamps)) {
      stampRequests = res.stamps;
    } else if (Array.isArray(res)) {
      stampRequests = res;
    } else if (res.data && Array.isArray(res.data)) {
      stampRequests = res.data;
    }

    // ✅ Transform to table format with correct field mapping
    const tableData = stampRequests.map((item, index) => ({
      id: item.id || item.ID,
      requestDate: item.requestedDate 
        ? moment(item.requestedDate).format("DD/MM/YYYY") 
        : "",
      totalRequestedQuantity: item.quantity || item.Quantity || 0,
      stampRange: item.startNum && item.endNum 
        ? `${item.startNum} - ${item.endNum}` 
        : item.stampRange || item.StampRange || "-",
      printMethod: item.isPrint === true ? "Yêu cầu in" : "Tự in",
      effect: item.requestedUsedStatus || item.RequestedUsedStatus || 0,
      currentStatus: item.status || item.Status || 0,
      parentID: "",
      index: index + 1,
      color: "",
    }));

    this.setState({
      data: tableData,
      listLength: tableData.length,
      totalPage: Math.ceil(tableData.length / this.state.limit),
      isLoaded: false,
      collapseList: tableData.map(item => ({ id: item.id, collapse: false })),
    });

    console.log("✅ Fetched stamp requests:", tableData);
  } catch (error) {
    console.error("❌ Lỗi fetch danh sách xin cấp tem:", error);
    toast.error("Lỗi khi tải danh sách xin cấp tem");
    this.setState({ isLoaded: false });
  }
};
```

### 2. No changes needed in `fetchData.js`

The `getList()` method is correct:
```javascript
getList: async (payload = {}) => {
  const result = await callApi("post", STAMP_REQUEST.getListStampRequest, payload);
  return result?.data || null;  // ✅ Returns { stamps: [...], total: 23 }
}
```

## Result Expected 🎉

After fix, the table should display:

| STT | Ngày yêu cầu | SL yêu cầu | Dải tem | Hình thức | Trạng thái | Hiệu lực | Hành động |
|-----|------------|----------|--------|---------|----------|---------|---------|
| 1 | 04/10/2025 | 20 | - | Yêu cầu in | Chờ duyệt | Chưa hiệu lực | ⋮ |
| 2 | 02/10/2025 | 1000 | - | Tự in | Đã duyệt | Có hiệu lực | ⋮ |
| 3 | 17/09/2025 | 200 | - | Tự in | Đã duyệt | Có hiệu lực | ⋮ |
| ... | ... | ... | ... | ... | ... | ... | ... |

## Files Modified ✅

1. **`src/views/pages/StampRequestUsed/index.js`**
   - Updated `fetchSummary()` method
   - Fixed API response handling
   - Fixed field mapping

## Testing Checklist

- [x] Verify data loads on component mount
- [x] Check console logs for API response
- [x] Verify table shows correct data
- [x] Check pagination works
- [x] Verify filter/search works
- [ ] Test create operation
- [ ] Test edit operation
- [ ] Test delete operation

## Console Output Expected

```
🔄 Fetching stamp request list with payload: {...}
🌐 Calling API: requestprovidestamp/getall {...}
✅ API requestprovidestamp/getall response: {data: {stamps: [...]}}
✅ Fetched stamp requests: [Array(23)]
```
