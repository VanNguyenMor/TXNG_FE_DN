public partial class Product : CMSEntity
{
    public Product()
    {
        Barcode = "";
        //ConfirmedStatus = ConfirmedStatusConst.NewCreate;
    }

    public string ProductGroupID { get; set; }
    public string QRCode { get; set; }

    [DefaultValue("")]
    public string Barcode { get; set; }
    //public string CompanyID { get; set; }

    public string ProductName { get; set; }

    public string ProductCode { get; set; }
    
    public string ProductCodeYCTC { get; set; }

    public string ManufactID { get; set; }

    public string Origin { get; set; }

    public string Weight { get; set; }

    public string UnitID { get; set; }

    public byte? ExpiredNum { get; set; }

    public byte? ExpiredUnit { get; set; }

    public string Avatar { get; set; }

    public string Introduce { get; set; }

    public string Ingredient { get; set; }

    public string Storage { get; set; }

    public string Usage { get; set; }

    public string Packing { get; set; }

    public string Images { get; set; }

    public string Accreditation { get; set; }

    public string Certification { get; set; }

    public Nullable<bool> IsDisabled { get; set; }
    public Nullable<long> ScanNum { get; set; }

    [NotMapped]
    public string UnitName { get; set; }
    public string QualityNum { get; set; }
    public string Market { get; set; }
    public string ProductionProcess { get; set; }
    public byte? ExpiredType { get; set; }
    public bool? IsLocked { get; set; }
    public decimal? Rating { get; set; }
    //public ConfirmedStatusConst? ConfirmedStatus { get; set; }
    //public string ConfirmedReason { get; set; }
    //public string ConfirmedBy { get; set; }
    //public DateTime? ConfirmedDate { get; set; }

    public string VerifyID { get; set; }

    public string VerifiedBy { get; set; }

    public DateTime? VerifiedDate { get; set; }

    public string VerifiedImage { get; set; }
    public IEnumerable<IFormFile> VerifiedImageFiles { get; set; }

    public string VerifiedImageBy { get; set; }

    public DateTime? VerifiedImageDate { get; set; }

    public ProductVerifiedStatus VerifiedStatus { get; set; }

    public string VerifiedName { get; set; }

    [NotMapped]
    public decimal? InStore { get; set; }
    [NotMapped]
    public decimal? InStoreTemp { get; set; }
    [NotMapped]
    public decimal? OutStore { get; set; }
    [NotMapped]
    public decimal? OutStoreTemp { get; set; }
    [NotMapped]
    public decimal? QuantityInStore { get; set; }

    [NotMapped]
    public bool? IsMaterial { get; set; }

    [NotMapped]
    public string ConfirmedByName { get; set; }

    public bool? IsTypical { get; set; }
    public int? TypicalNum { get; set; }

    public string MaterialGroupID { get; set; }

    public bool? IsBoth { get; set; }

    public ConfirmedStatusConst ConfirmedStatus { get; set; }

    public string NPProductID { get; set; }

    public string NPGTinCode { get; set; }
    public string NPCertificationID { get; set; }
}

[NotMapped]
public class Product_Collection : Product
{
    public Partner Partner { get; set; }
    public List<ProductsUnit> ProductsUnits { get; set; }
}

public class Product_Partnert_PU : Product
{
    public List<Product> Products { get; set; }
    public List<Partner> Partners { get; set; }
    public List<ProductsUnit> ProductsUnits { get; set; }
}