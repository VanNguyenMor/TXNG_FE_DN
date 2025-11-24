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

const HistoryListTable = ({ historyData = [], productName = "Sản phẩm" }) => {
  if (historyData.length === 0) {
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
        Lịch sử {productName}
      </CardHeader>
      <ListGroup flush>
        {historyData.map((item, index) => (
          <ListGroupItem
            key={index}
            className="d-flex justify-content-between align-items-start"
          >
            <div style={{ flexGrow: 1 }}>
              <h4 className={`mb-1 ${classes.title}`}>{item.action}</h4>

              <ul className="list-unstyled mb-0 small">
                {Object.keys(item.details).map((key, detailIndex) => (
                  <li key={detailIndex}>
                    <strong>{key}</strong>: {item.details[key]}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-right ml-3">
              <Badge color="info" pill className="mb-1">
                {item.time}
              </Badge>
              <br />
              <Badge pill className={classes.dateBadge}>
                {item.date}
              </Badge>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
    </Card>
  );
};

export default HistoryListTable;
