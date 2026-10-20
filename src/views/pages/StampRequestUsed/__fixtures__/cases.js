export const ROW_ACTION_CASES = [
  ["Mới tạo, Tự in", { status: 0, requestedUsedStatus: 0, isPrint: true }, ["view", "edit", "delete"]],
  ["Mới tạo, Yêu cầu in", { status: 0, requestedUsedStatus: 0, isPrint: false }, ["view", "edit", "delete"]],
  ["Chờ duyệt", { status: 1, requestedUsedStatus: 0, isPrint: true }, ["view"]],
  ["Không duyệt", { status: 3, requestedUsedStatus: 0, isPrint: true }, ["view", "edit", "delete", "resubmit"]],
  ["Đã duyệt, chưa hiệu lực, Tự in", { status: 2, requestedUsedStatus: 0, isPrint: true }, ["view", "requestPermission"]],
  ["Đã duyệt, chờ cấp phép, Tự in", { status: 2, requestedUsedStatus: 1, isPrint: true }, ["view"]],
  ["Đã duyệt, không cấp phép, Tự in", { status: 2, requestedUsedStatus: 3, isPrint: true }, ["view", "requestPermission"]],
  ["Có hiệu lực, Tự in", { status: 2, requestedUsedStatus: 2, isPrint: true }, ["view", "print"]],
  ["Đã duyệt, chưa hiệu lực, Yêu cầu in", { status: 2, requestedUsedStatus: 0, isPrint: false }, ["view"]],
  ["Đã duyệt yêu cầu, Yêu cầu in", { status: 4, requestedUsedStatus: 0, isPrint: false }, ["view", "payment"]],
  ["Đã duyệt yêu cầu, Tự in", { status: 4, requestedUsedStatus: 0, isPrint: true }, ["view"]],
];
