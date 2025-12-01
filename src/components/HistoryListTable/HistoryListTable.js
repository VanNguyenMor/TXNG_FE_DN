import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  Badge,
} from "reactstrap";
import classes from "./HistoryListTable.module.css";

const HistoryListTable = ({ historyData = [], tableTitle = "Sản phẩm" }) => {
  if (!historyData || historyData.length === 0) {
    return (
      <Card className="mt-3">
        <CardBody>
          <p className="text-center text-muted">Không có lịch sử giao dịch.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader tag="h4" className={`p-3 ${classes.cardHeader}`}>
        Lịch sử {tableTitle}
      </CardHeader>
      <ListGroup flush>
        {historyData.map((item, index) => {
          // Parse description từ string JSON
          let details = [];
          try {
            details = JSON.parse(item.description || "[]");
          } catch (err) {
            console.error("Error parsing description:", err);
          }

          return (
            <ListGroupItem
              key={index}
              className="d-flex justify-content-between align-items-start"
            >
              <div style={{ flexGrow: 1 }}>
                <h4 className={`mb-1 ${classes.title}`}># {item.id}</h4>

                <ul className="list-unstyled mb-0 small">
                  {details.map((d, detailIndex) => (
                    <li key={detailIndex}>
                      <strong>{d.Label}</strong>: {d.Value}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-right ml-3">
                <Badge color="info" pill className="mb-1">
                  {new Date(item.createdDate).toLocaleTimeString()}
                </Badge>
                <br />
                <Badge pill className={classes.dateBadge}>
                  {new Date(item.createdDate).toLocaleDateString()}
                </Badge>
              </div>
            </ListGroupItem>
          );
        })}
      </ListGroup>
    </Card>
  );
};

export default HistoryListTable;
