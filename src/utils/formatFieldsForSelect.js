export default function formatFieldsForSelect(fieldID, fieldName) {
  if (!fieldID || !fieldName) return [];

  const ids = fieldID.split(",");
  const names = fieldName.split(";");

  return ids.map((id, index) => ({
    id,
    fieldName: names[index] || "",
  }));
}
