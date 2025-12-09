using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using TXNG.Model.EntityValidations;

namespace TXNG.Model.js.Companies
{
    public class GoodsReceiptJs
    {
        public string ID { get; set; }

        [NumberTarget(new double[] { 0, 1, 2 }, ErrorMessage = "Loại phiếu không hợp lệ")]
        public byte? GRType { get; set; }

        [Required(ErrorMessage = "Chưa chọn ngày nhập")]
        public Nullable<System.DateTime> GRTime { get; set; }

        [Required(ErrorMessage = "Chưa chọn người nhập")]
        public string ReceiptPerson { get; set; }

        //[NumberTarget(new double[] { 0, 1 }, ErrorMessage = "Loại đối tác không đúng định dạng")]
        public byte PartnerType { get; set; }

        [Required(ErrorMessage = "Chưa chọn đối tác")]
        public string PartnerID { get; set; }
        public string Note { get; set; }

        public string StrFile { get; set; }

        //[Required(ErrorMessage ="Chưa chọn nhập sản phẩm để làm gì")]
        // public bool IsTransport { get; set; }


        [MaxFileSize(5 * 1024 * 1024, 10)]
        [AllowedExtensions(new string[] { ".png", ".jpeg", ".jpg", ".bmp", ".webp", ".pdf", ".doc", ".docx", ".xlsx", ".xls" })]
        public IEnumerable<IFormFile> FilesFiles { get; set; }

        [Required(ErrorMessage = "Chưa nhập chi tiết phiếu nhập")]
        public List<GRDetailJs> GRDetails { get; set; }

        public string Content1 { get; set; }

        public string Content2 { get; set; }

        public GoodsReceiptJs ConvertNull()
        {
            foreach (var item in GRDetails)
            {
                item.RefQRCode = item.RefQRCode ?? "";
            }
            return this;
        }
    }

    public class GRDetailJs
    {
        public string ID { get; set; }

        [Required(ErrorMessage = "Chưa chọn nguyên vật liệu")]
        public string MaterialID { get; set; }

        [Required(ErrorMessage = "Chưa chọn đơn vị tính")]
        public string UnitID { get; set; }

        //[Required(ErrorMessage = "Số lượng nhập không được bỏ trống")]
        //[NumBigger(0, ErrorMessage = "Số lượng nhập phải lớn hơn 0")]0
        public decimal? Quantity { get; set; }

        public int? UnitPrice { get; set; }

        //[Required(ErrorMessage = "Giá không được để trống")]
        //[Range(0, int.MaxValue, ErrorMessage = "Giá xuất phải lớn hơn 0")]
        //public int Amount { get; set; }

        //[Required(ErrorMessage = "VAT không được để trống")]
        //[Range(0, 100, ErrorMessage = "VAT Không đúng định dạng")]
        public int? PerVAT { get; set; }

        public string RefQRCode { get; set; }

        public string WarehouseID { get; set; }

        public string MaterialName { get; set; }

        public string UnitName { get; set; }

        public string TraceID { get; set; }

        public string BatchID { get; set; }

        public string GIID { get; set; }
    }
}