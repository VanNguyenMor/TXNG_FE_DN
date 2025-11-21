import React from "react";
import { Card, Table } from "reactstrap";

const ModalTable = ({ data, columns, classes }) => {
  return (
    <Card className="shadow mt-2">
      <Table
        className={`align-items-center table-flush vayt65 ${
          classes?.scrollTable || ""
        }`}
        responsive
      >
        <thead className="thead-light" style={{ backgroundColor: "#09b2fd" }}>
          <tr className={classes?.detailTableHead || ""}>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`header-cell ${col.className || ""}`}
                style={col.style || {}}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={col.className || ""}>
                    {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-muted"
              >
                <i className="fas fa-info-circle mr-2"></i>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card>
  );
};

export default ModalTable;
