using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using TXNG.Consts;
using TXNG.Core.Authorize;
using TXNG.Core.Filters;
using TXNG.Core.Helpers;
using TXNG.Core.Providers;
using TXNG.Core.Services;
using TXNG.Core.Services.AlertRole;
using TXNG.Core.Services.Companies;
using TXNG.Core.Services.Roles;
using TXNG.Core.Utilities.Interfaces;
using TXNG.Model.BatchCompanies;
using TXNG.Model.Categories;
using TXNG.Model.Companies;
using TXNG.Model.Config;
using TXNG.Model.DBCenter.QRCodes;
using TXNG.Model.DescriptionProductMaterialHistoryModel.cs;
using TXNG.Model.GRQuantity;
using TXNG.Model.Inventory;
using TXNG.Model.js;
using TXNG.Model.js.Companies;
using TXNG.Model.js.Filter.GoodReceipt;
using TXNG.Model.js.UpdateGoodReceivedFromGoodDeliveryJs;
using TXNG.Model.MaterialHistories;
using TXNG.Model.Papers;
using TXNG.Model.ProductField;
using TXNG.Model.ProductHistories;
using TXNG.Model.Products;
using TXNG.Model.Stamps;
using TXNG.Model.Traces;
using TXNG.Model.TracesCompanies;
using TXNG.Model.Users;
using TXNG.Model.ViewModels.Companies;
using TXNG.Model.ViewModels.DataAlertTypeTemplate;
using TXNG.Model.ViewModels.ProductMaterialUnit;
using TXNG.Model.ViewModels.UpdateGoodReceivedFromGoodDelivery;
using TXNG.Model.Warehouses;
using static TXNG.Consts.Constants;

namespace TXNG.Website.Controllers.Companies
{
    [AuthorizeJWT(policy: PolicyConsts.COMPANY_POLICY)]
    public class GoodsReceivedNoteController : CMSController
    {
        #region Contructor
        private readonly IConfigsService _configsService;

        private readonly ITxngContext _txngContext;
        private readonly IGoodsReceiptService _goodsReceiptService;
        private readonly ILogService _logService;
        private readonly ICacheService _cacheService;
        private readonly IUserService _userService;
        private readonly ICompanyService _companyService;
        private readonly IAlertService _alertService;

        private readonly IFileProvider _fileProvider;
        private readonly IGoodsProvider _goodsProvider;
        private readonly IMaterialService _materialService;
        private readonly IProductService _productService;
        private readonly IQRCodeProvider _qRCodeProvider;
        private readonly IProductMaterialUnitService _productMaterialUnitService;

        private readonly User userCurrent;

        private readonly IAlertTypeService _alertTypeService;

        private readonly IProductMaterialHistoryService _productMaterialHistoryService;

        public GoodsReceivedNoteController(
            IConfigsService configsService,
            IMaterialService materialService,
            IProductService productService,
            ITxngContext txngContext,
            IGoodsReceiptService goodsReceiptService,
            ILogService logService,
            ICacheService cacheService,
            IUserService userService,
            ICompanyService companyService,
            IAlertService alertService,
            IFileProvider fileProvider,
            IGoodsProvider goodsProvider,
            IQRCodeProvider qRCodeProvider,
            IProductMaterialUnitService productMaterialUnitService,
            IAlertTypeService alertTypeService,
            IProductMaterialHistoryService productMaterialHistoryService)
        {
            _materialService = materialService;
            _productService = productService;
            _configsService = configsService;
            _txngContext = txngContext;
            _goodsReceiptService = goodsReceiptService;
            _logService = logService;
            _cacheService = cacheService;
            _userService = userService;
            _companyService = companyService;
            _alertService = alertService;

            _fileProvider = fileProvider;
            _goodsProvider = goodsProvider;
            _qRCodeProvider = qRCodeProvider;
            _productMaterialUnitService = productMaterialUnitService;

            _alertTypeService = alertTypeService;

            _productMaterialHistoryService = productMaterialHistoryService;

            userCurrent = _userService.GetUserCurrent();
        }
        #endregion


        [HttpPost("UpdateGoodReceivedFromGoodDelivery")]
        public IActionResult UpdateGoodReceivedFromGoodDelivery([FromBody] UpdateGoodReceivedFromGoodDeliveryJs updateGoodReceivedFromGoodDeliveryJs)
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                string companyId = userCurrent.CompanyID;

                int checkExistPartner = _txngContext.Query<int>($" SELECT COUNT(ID) FROM Partners WHERE CompanyID = @COMPANYID AND SUBSTRING(ID, 0, CHARINDEX('{Constants.Alias.CENTER_PARTNER}', ID)) = @PARTNERID AND PartnerType = 1 AND ISNULL(IsDeleted, 0) = 0 ", new
                {
                    COMPANYID = companyId,
                    PARTNERID = updateGoodReceivedFromGoodDeliveryJs.PartnerID
                }).FirstOrDefault();

                if (checkExistPartner <= 0)
                {
                    Company company = _txngContext.Query<Company>(" SELECT * FROM Companies WHERE ID = @ID ", new
                    {
                        ID = updateGoodReceivedFromGoodDeliveryJs.PartnerID
                    }).FirstOrDefault();

                    if (company != null)
                    {
                        string partnerCode = _configsService.NewIDPartnerCode(companyId);

                        _configsService.UpdateNewIDPartnerCode(companyId);

                        PartnerVerifiedStatus partnerVerifiedStatus = PartnerVerifiedStatus.Unauthenticated;

                        if (company.VerifiedStatus == CompaniesVerifiedStatus.Authenticated)
                        {
                            partnerVerifiedStatus = PartnerVerifiedStatus.Authenticated;
                        }
                        else if (company.VerifiedStatus == CompaniesVerifiedStatus.AwaitAuthenticated)
                        {
                            partnerVerifiedStatus = PartnerVerifiedStatus.AwaitAuthenticated;
                        }

                        string centerPartnerId = _configsService.GetCenterPartnerId(updateGoodReceivedFromGoodDeliveryJs.PartnerID);

                        Partner partner = new Partner
                        {
                            ID = centerPartnerId,
                            CompanyID = companyId,
                            Code = partnerCode,
                            PartnerName = company.CompanyName,
                            NationID = "1",
                            Address = company.Address,
                            PhoneNumber = company.PhoneNumber,
                            Fax = company.Fax,
                            Email = company.Email,
                            Website = company.Website,
                            TaxCode = company.TaxCode,
                            ContactName = company.ContactName,
                            ContactPhone = company.ContactPhone,
                            ContactEmail = company.ContactEmail,
                            Location = company.Location,
                            Logo = company.Logo,
                            Certification = company.Certifications,
                            BusinessLicenses = company.BusinessLicenses,
                            Images = company.Images,
                            VerifiedImage = company.VerifiedImage,
                            VerifiedImageBy = company.VerifiedImageBy,
                            VerifiedImageDate = company.VerifiedImageDate,
                            VerifyID = company.VerifyID,
                            VerifiedBy = company.VerifiedBy,
                            VerifiedDate = company.VerifiedDate,
                            VerifiedStatus = partnerVerifiedStatus,
                            VerifiedName = company.VerifiedName,
                            PartnerType = PartnerType.Distributor,
                            IsDeleted = false,
                            CreatedBy = userCurrent.Id,
                            CreatedDate = DateTime.Now
                        };

                        _txngContext.Insert<Partner>(partner);
                    }
                    else
                    {
                        resultJs.message = "Công ty xuất không tồn tại";

                        return Ok(resultJs);
                    }
                }

                Batch batch = _txngContext.Query<Batch>(" SELECT * FROM Batches WHERE ID = @ID ", new
                {
                    ID = updateGoodReceivedFromGoodDeliveryJs.BatchID
                }).FirstOrDefault();

                if (batch == null)
                {
                    resultJs.message = "Lô hàng này không tồn tại";

                    return Ok(resultJs);
                }

                StampList stampList = _txngContext.Query<StampList>(" SELECT * FROM StampLists WHERE BatchID = @BATCHID AND [Status] = 1 ", new
                {
                    BATCHID = batch.BatchCode
                }).FirstOrDefault();

                if (stampList == null)
                {
                    resultJs.message = "Lô hàng này không tồn tại";

                    return Ok(resultJs);
                }

                if (string.IsNullOrEmpty(stampList.TraceID))
                {
                    resultJs.message = "Nhật ký theo lô hàng này không tồn tại";

                    return Ok(resultJs);
                }

                UpdateGoodReceivedFromGoodDeliveryViewModel updateGoodReceivedFromGoodDeliveryViewModel = _txngContext.Query<UpdateGoodReceivedFromGoodDeliveryViewModel>(" SELECT GI.MaterialName, GI.Quantity, GI.UnitName,G.CreatedDate, G.ID AS GoodIssueID, GI.BatchID, GI.MaterialID, G.CompanyName AS CompanyName2, G.CompanyID AS CompanyID2, GI.UnitID, B.BatchNum, GI.QuantityRemain FROM GoodIssues G INNER JOIN GIDetails GI ON G.ID = GI.GIID INNER JOIN Batches B ON B.ID = GI.BatchID WHERE LEFT(G.PartnerID, 44) = @COMPANYID AND GI.QuantityRemain > 0 AND G.Status = 2 AND GI.BatchID IS NOT NULL AND G.ID = @ID ", new
                {
                    COMPANYID = companyId,
                    ID = updateGoodReceivedFromGoodDeliveryJs.GIID
                }).FirstOrDefault();

                if (updateGoodReceivedFromGoodDeliveryViewModel == null)
                {
                    resultJs.message = "Phiếu xuất này không tồn tại";

                    return Ok(resultJs);
                }

                decimal? quantity = updateGoodReceivedFromGoodDeliveryJs.GRDetailJs.Sum(p => p.Quantity);

                if ((quantity ?? 0) > updateGoodReceivedFromGoodDeliveryViewModel.QuantityRemain)
                {
                    resultJs.message = "Số lượng nhập vượt quá số lượng hiện có: " + quantity.ToString();

                    return Ok(resultJs);
                }

                int checkExistTraceCompany = _txngContext.Query<int>(" SELECT 1 FROM TracesCompanies WHERE TraceID = @TRACEID AND CompanyID = @COMPANYID ", new
                {
                    COMPANYID = companyId,
                    TRACEID = stampList.TraceID
                }).FirstOrDefault();

                if (checkExistTraceCompany <= 0)
                {
                    _txngContext.Execute(" INSERT INTO TracesCompanies (ID, TraceID, CompanyID, IsBelongTo) VALUES (@ID, @TRACEID, @COMPANYID, 0) ", new
                    {
                        ID = _configsService.NewIDoC,
                        TRACEID = stampList.TraceID,
                        COMPANYID = companyId
                    });
                }

                int checkExistProductCompany = _txngContext.Query<int>(" SELECT 1 FROM ProductCompany WHERE CompanyID = @COMPANYID AND ProductID = @PRODUCTID ", new
                {
                    COMPANYID = companyId,
                    PRODUCTID = updateGoodReceivedFromGoodDeliveryJs.ProductID
                }).FirstOrDefault();

                if (checkExistProductCompany <= 0)
                {
                    ProductCompany productCompany = new ProductCompany
                    {
                        CompanyID = companyId,
                        ProductID = updateGoodReceivedFromGoodDeliveryJs.ProductID
                    };

                    _txngContext.Insert<ProductCompany>(productCompany);
                }

                string companyField = _txngContext.Query<string>(" SELECT FieldID FROM CompaniesFields WHERE CompanyID = @COMPANYID ", new
                {
                    COMPANYID = companyId
                }).FirstOrDefault();

                if (!string.IsNullOrEmpty(companyField))
                {
                    List<string> productFieldIds = _txngContext.Query<string>($" SELECT PF.FieldID FROM ProductFields AS PF WHERE PF.ProductID = @PRODUCTID AND PF.FieldID IN (SELECT ID FROM FUNC_GETFIELDCHILDREN('{companyField}') WHERE LEN(FieldCode) = 5) ", new
                    {
                        PRODUCTID = updateGoodReceivedFromGoodDeliveryJs.ProductID
                    }).ToList();

                    List<string> fieldIds = _txngContext.Query<string>($" SELECT ID FROM FUNC_GETFIELDCHILDREN('{companyField}') WHERE LEN(FieldCode) = 5  ", new
                    {

                    }).ToList();

                    List<string> fieldIdExcepts = fieldIds.Except(productFieldIds).ToList();

                    List<string> productFields = new List<string>();

                    for (int i = 0; i < fieldIdExcepts.Count; i++)
                    {
                        productFields.Add(string.Format(" INSERT INTO ProductFields (ID, ProductID, FieldID) VALUES (N'{0}', N'{1}', N'{2}') ", _configsService.NewIDoC, updateGoodReceivedFromGoodDeliveryJs.ProductID, fieldIdExcepts[i]));
                    }

                    if (productFields.Count > 0)
                    {
                        _txngContext.Execute(string.Join(" ; ", productFields));
                    }
                }

                updateGoodReceivedFromGoodDeliveryJs.GRDetailJs = updateGoodReceivedFromGoodDeliveryJs.GRDetailJs.Select(p =>
                {
                    p.TraceID = stampList.TraceID;

                    return p;
                }).ToList();

                int total = 1 + _txngContext.Query<int>($@" SELECT COUNT (1) FROM GoodReceipts 
                            WHERE DATEDIFF(MONTH, GRTime, GETDATE()) = 0 AND CompanyID = @COMPANYID",
                    new
                    {
                        COMPANYID = companyId
                    }).FirstOrDefault();

                GoodsReceipt goodsReceipt = new GoodsReceipt();

                goodsReceipt.ID = _configsService.NewIDoC;

                Type qrCodeType = typeof(QRCodeType);

                QRCodeType qrCodeTypePN = QRCodeType.PN;

                string qrCodeString = StringHelper.GetEnumMemberAttrValue(qrCodeType, qrCodeTypePN);

                string grCode = _configsService.NewIDGoodReceiptCode(companyId);

                _configsService.UpdateNewIDGoodReceiptCode(companyId);

                goodsReceipt.GRCode = grCode;
                goodsReceipt.QRCode = _qRCodeProvider.Encryto(QRCodeType.PN, qrCodeString + "." + goodsReceipt.ID);
                goodsReceipt.CompanyID = companyId;
                goodsReceipt.IsDisabled = false;
                goodsReceipt.CreatedBy = userCurrent.Id;
                goodsReceipt.CreatedDate = DateTime.Now;
                goodsReceipt.Amount = Convert.ToInt32(updateGoodReceivedFromGoodDeliveryJs.GRDetailJs.Sum(x => (x.UnitPrice * x.Quantity)));
                goodsReceipt.GRTime = DateTime.Now;
                goodsReceipt.Status = 0;
                goodsReceipt.ReceiptPerson = userCurrent.Id;
                goodsReceipt.GRType = 2;
                goodsReceipt.BatchID = updateGoodReceivedFromGoodDeliveryJs.BatchID;
                goodsReceipt.PartnerID = updateGoodReceivedFromGoodDeliveryJs.PartnerID;

                decimal? vat = updateGoodReceivedFromGoodDeliveryJs.GRDetailJs.Sum(p => (p.PerVAT * (p.UnitPrice * p.Quantity)) / 100);

                goodsReceipt.VAT = Convert.ToInt32(vat);

                goodsReceipt.TotalAmount = goodsReceipt.Amount + goodsReceipt.VAT;

                int handleInventory = HandleInventoryProduct(goodsReceipt.ID, goodsReceipt.GRType, companyId, userCurrent.Id, userCurrent.FullName, updateGoodReceivedFromGoodDeliveryJs.GRDetailJs, true);

                if (handleInventory != 0)
                {
                    if (handleInventory == -1)
                    {
                        resultJs.message = "Bạn vui lòng chọn 1 đơn vị tính quy đổi làm đơn vị báo cáo trước khi nhập hàng";

                        return Ok(resultJs);
                    }
                    else if (handleInventory == -2)
                    {
                        resultJs.message = "Sản phẩm/nguyên liệu này không tồn tại";

                        return Ok(resultJs);
                    }
                }

                _txngContext.Insert<GoodsReceipt>(goodsReceipt);

                _txngContext.Execute($" UPDATE GIDetails SET QuantityRemain = QuantityRemain - {quantity} WHERE GIID = @GIID ", new
                {
                    GIID = updateGoodReceivedFromGoodDeliveryJs.GIID
                });

                _logService.SaveLog($"Thêm phiếu nhập hàng {goodsReceipt.GRCode} từ phiếu xuất");

                resultJs.status = 200;

                resultJs.message = "Nhập hàng từ phiếu xuất thành công";

                resultJs.data = new
                {
                    id = goodsReceipt.ID
                };

                return Ok(resultJs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("GetListBatchCompany")]
        public IActionResult GetListBatchCompany()
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                string companyId = userCurrent.CompanyID;

                //object batchCompanies = _txngContext.Query<object>(" SELECT GI.MaterialName, GI.Quantity, GI.UnitName, G.CreatedDate, G.ID AS GoodIssueID, GI.BatchID, GI.MaterialID, G.CompanyName AS CompanyName2, G.CompanyID AS CompanyID2, GI.UnitID, B.BatchNum, GI.QuantityRemain FROM GoodIssues G INNER JOIN GIDetails GI ON G.ID = GI.GIID INNER JOIN Batches B ON B.ID = GI.BatchID WHERE LEFT(G.PartnerID, 44) = @COMPANYID AND GI.QuantityRemain > 0 AND G.Status = 2 AND GI.BatchID IS NOT NULL ", new
                //{
                //    COMPANYID = companyId
                //}).ToList();

                object batchCompanies = _txngContext.Query<object>($" SELECT GI.MaterialName, GI.Quantity, GI.UnitName, G.CreatedDate, G.ID AS GoodIssueID, GI.BatchID, GI.MaterialID, G.CompanyName AS CompanyName2, G.CompanyID AS CompanyID2, GI.UnitID, B.BatchNum, GI.QuantityRemain FROM GoodIssues G INNER JOIN GIDetails GI ON G.ID = GI.GIID INNER JOIN Batches B ON B.ID = GI.BatchID WHERE SUBSTRING(G.PartnerID, 0, CHARINDEX('{Constants.Alias.CENTER_PARTNER}', G.PartnerID)) = @COMPANYID AND GI.QuantityRemain > 0 AND G.Status = 2 AND GI.BatchID IS NOT NULL ", new
                {
                    COMPANYID = companyId
                }).ToList();

                resultJs.status = 200;

                resultJs.message = "Success";

                resultJs.data = new
                {
                    batchCompanies = batchCompanies
                };

                return Ok(resultJs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        #region Get
        /// <summary>
        /// Get detail goodls received note
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("Get")]
        public IActionResult Get(string id)
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                User userCurrent = _userService.GetUserCurrent();

                GrMoreViewModel viewModel = new GrMoreViewModel();

                viewModel = _txngContext.Query<GrMoreViewModel>("SELECT GR.*, (SELECT FullName FROM Users AS U WHERE U.ID = GR.ReceiptPerson) AS ReceiptPersonName, (SELECT FullName FROM Users AS U WHERE U.ID = GR.ConfirmedBy) AS ConfirmedByName FROM GoodReceipts AS GR WHERE GR.CompanyID = @CompanyID AND GR.ID = @ID",
                    new
                    {
                        ID = id,
                        CompanyID = userCurrent.CompanyID
                    })
                    .FirstOrDefault();

                if (viewModel == null) goto Final;

                string sql = "";

                if ((viewModel.GRType ?? 1) == 1)
                {
                    sql = $@" SELECT A.MaterialID, A.ID, (CASE WHEN B.MaterialName IS NOT NULL AND B.MaterialName != '' THEN B.MaterialName WHEN D.ProductName IS NOT NULL AND D.ProductName != '' THEN D.ProductName ELSE '' END) AS MaterialName, c.UnitName, b.QuantityInStore, B.UnitID as InStoreUnitID,
                    A.UnitID, A.Quantity AS Quantity, A.UnitPrice, A.Amount,  a.PerVAT, A.WarehouseID, (SELECT BatchID FROM GoodReceipts AS GR WHERE GR.ID = A.GRID) AS BatchID
                    FROM GRDetails A with(nolock)
                        LEFT JOIN Materials B with(nolock) on B.ID =  a.MaterialID
                        LEFT JOIN Products D with(nolock) on D.ID =  a.MaterialID
                        LEFT JOIN Units C with(nolock) on A.UnitID = C.ID
                    WHERE A.GRID = @ID ";
                }
                else
                {
                    sql = $@"SELECT A.MaterialID, A.ID, b.ProductName as MaterialName, c.UnitName, b.QuantityInStore, B.UnitID as InStoreUnitID, A.UnitID, A.Quantity AS Quantity, A.UnitPrice, A.Amount, a.PerVAT, A.WarehouseID, (SELECT BatchID FROM GoodReceipts AS GR WHERE GR.ID = A.GRID) AS BatchID
                    FROM GRDetails A with(nolock)
	                    LEFT JOIN Products B with(nolock) on B.ID =  a.MaterialID
	                    LEFT JOIN Units C with(nolock) on A.UnitID = C.ID
                    WHERE A.GRID = @ID";
                }

                viewModel.GRMores = _txngContext.Query<GRMore>(sql, new { ID = viewModel.ID }).ToList();
                // Get unit
                string materialIds = string.Join("','", viewModel.GRMores.Select(x => x.MaterialID).ToArray());

                resultJs.data = new
                {
                    goodsReceipt = viewModel,
                    materialUnits = (viewModel.GRType ?? 1) == 1 ? (object)_materialService.GetUnits(materialIds) : (object)_productService.GetUnits(materialIds)
                };

            Final:
                resultJs.status = 200;

                resultJs.message = "Lấy thông tin thành công";

                return Ok(resultJs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost("GetAll")]
        public IActionResult GetAll([FromBody] GoodReceiptFilterModel goodReceiptFilterModel)
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                User userCurrent = _userService.GetUserCurrent();

                goodReceiptFilterModel.Page = goodReceiptFilterModel.Page < 0 ? 0 : goodReceiptFilterModel.Page;
                goodReceiptFilterModel.Limit = goodReceiptFilterModel.Limit < 1 ? Constants.Num.LIMIT_GOODRECEIPT : goodReceiptFilterModel.Limit;

                //string select = @"A.ID, GRCode, GRTime, ReceiptPerson, PartnerName, IsLocked, TotalAmount";

                //string from = $@" GoodReceipts a with(nolock)
                //                left join (select ID, PartnerName from  Partners with(nolock) where CompanyID=@CompanyID)
                //                    b on a.PartnerID = b.ID";

                //string where = $@"CompanyID = @CompanyID and isnull(IsDisabled,0) = 0
                //                and (a.GRCode like N'%{model.search}%' 
                //                 or a.ReceiptPerson like N'%{model.search}%' 
                //                 or b.PartnerName like N'%{model.search}%' 
                //                )";

                //if (model.startDate != null)
                //{
                //    model.startDate = (model.startDate ?? DateTime.Now.GetFirstDayOfMonth()).Date;
                //    model.endDate = (model.endDate ?? DateTime.Now).AddDays(1).Date;
                //    where += " and A.GRTime >= @startDate AND A.GRTime < @endDate";
                //}

                //if (!string.IsNullOrWhiteSpace(model.filter))
                //{
                //    where += $" and MaterialType={model.filter}";
                //}

                //if (userCurrent.IsAdmin != true && _companyParaService.Warehouse == 2)
                //{
                //    where += $@" and ReceiptPerson='{userCurrent.Id}'";
                //}

                //List<GoodsReceiptViewModel> goodsReceipts = _txngContext.GetAll<GoodsReceiptViewModel>(select, from, where,
                //    new
                //    {
                //        CompanyID = userCurrent.CompanyID,
                //        startDate = model.startDate,
                //        endDate = model.endDate
                //    },
                //    "a.GRTime DESC", model.page, model.limit)
                //    .ToList();

                //int count = _txngContext.Count(from, where,
                //    new
                //    {
                //        CompanyID = userCurrent.CompanyID,
                //        startDate = model.startDate,
                //        endDate = model.endDate
                //    });

                List<GoodsReceiptViewModel> goodsReceiptViewModels = _txngContext.Query<GoodsReceiptViewModel>(" EXEC dbo.PROC_GETLISTGOODRECEIPT_MOBILE @COMPANYID, @STATUS, @FROMDATE, @TODATE, @PAGE, @LIMIT ", new
                {
                    COMPANYID = userCurrent.CompanyID,
                    STATUS = goodReceiptFilterModel.Status,
                    FROMDATE = goodReceiptFilterModel.FromDate,
                    TODATE = goodReceiptFilterModel.ToDate,
                    PAGE = goodReceiptFilterModel.Page,
                    LIMIT = goodReceiptFilterModel.Limit
                }).ToList();

                int totalCount = _txngContext.Query<int>(" EXEC dbo.PROC_GETTOTALCOUNTGOODRECEIPT_MOBILE @COMPANYID, @STATUS, @FROMDATE, @TODATE ", new
                {
                    COMPANYID = userCurrent.CompanyID,
                    STATUS = goodReceiptFilterModel.Status,
                    FROMDATE = goodReceiptFilterModel.FromDate,
                    TODATE = goodReceiptFilterModel.ToDate
                }).FirstOrDefault();

                resultJs.data = new
                {
                    goodsReceipts = goodsReceiptViewModels,
                    total = totalCount
                };

                resultJs.status = 200;

                resultJs.message = "Lấy thông tin thành công";

                return Ok(resultJs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
        #endregion

        #region Function
        [HttpPut("Lock/{id}")]
        [ClaimRequirement(FunctionCode.GoodReceipts, PermissionAction.Lock)]
        [ValidateModel]
        public async Task<IActionResult> Lock(string id)
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                bool confirmGR = _txngContext.Query<bool>(" SELECT ConfirmGR FROM CompanyConfig WHERE CompanyID = @COMPANYID ", new
                {
                    COMPANYID = userCurrent.CompanyID
                }).FirstOrDefault();

                bool isPassLock = false;

                if (!confirmGR)
                {
                    isPassLock = true;
                }

                GoodsReceipt goodsReceipt = _goodsReceiptService.Find(" ID = @ID AND CompanyID = @COMPANYID AND ISNULL(IsDisabled, 0) = 0 ",
                     new
                     {
                         ID = id,
                         COMPANYID = userCurrent.CompanyID
                     });

                #region Vaild

                if (goodsReceipt == null)
                {
                    resultJs.message = "Không tìm thấy phiếu nhập";

                    goto Final;
                }

                //if ((goodsReceipt.IsLocked ?? false) == true)
                //{
                //    resultJs.message = "Phiếu nhập đã khóa";

                //    goto Final;
                //}

                if (goodsReceipt.Status == 0)
                {
                    isPassLock = true;
                }

                if (!isPassLock)
                {
                    resultJs.message = "Bạn không thể khoá được phiếu nhập hàng này";

                    goto Final;
                }
                #endregion

                DateTime currentDateTime = DateTime.Now;
                string userId = userCurrent.Id;

                goodsReceipt.Status = 2;
                goodsReceipt.ConfirmedBy = userId;
                goodsReceipt.ConfirmedDate = currentDateTime;

                _txngContext.Update<GoodsReceipt>(goodsReceipt);

                UpdateInventoryRequestConfirm(goodsReceipt.ID, userCurrent.CompanyID, userCurrent.Id, userCurrent.FullName);

                HandleGRQuantity(goodsReceipt.ID, goodsReceipt.CompanyID, goodsReceipt.BatchID);

                //List<GRDetail> gRDetails = _txngContext.GetAll<GRDetail>("GRID = @ID", goodsReceipt).ToList();
                //string sql = "";
                //if ((goodsReceipt.GRType ?? 1) != 1)//sản phẩm
                //{
                //    if (!goodsReceipt.IsTransport)
                //    {
                //        List<Trace> traces = new List<Trace>();

                //        List<Field_ProductID> fields = _txngContext.Query<Field_ProductID>(
                //            $@"select A.FieldID AS ID , B.ID AS ProductID from ProductFields A with(nolock) 
                //            inner join Products B with(nolock) on A.ProductID = B.ID
                //            where B.ID in ('{string.Join("','", gRDetails.Select(x => x.MaterialID))}')").ToList();

                //        foreach (var item in gRDetails)
                //        {
                //            var count = _txngContext.Count("traces", $@"CompanyID='{userCurrent.CompanyID}' and CreatedDate>='{DateTime.Now.GetFirstDayOfMonth().Date}' and CreatedDate<='{DateTime.Now.GetFirstDayOfMonth().AddMonths(1).Date}'") + 1;

                //            bool isRequired = true;
                //            if (item.RefQRCode.StartsWith("ST."))
                //            {
                //                try
                //                {
                //                    if (item.RefQRCode.Split('.')[1] == _configsService.ServerID)
                //                    {
                //                        isRequired = false;
                //                    }
                //                }
                //                catch { }
                //            }

                //            _txngContext.Insert(new Trace
                //            {
                //                ID = _configsService.NewIDoC,
                //                CreatedBy = userCurrent.Id,
                //                CompanyID = userCurrent.CompanyID,
                //                CreatedDate = DateTime.Now,
                //                IsCompleted = false,
                //                IsRequired = isRequired,
                //                FieldID = fields.FirstOrDefault(x => x.ProductID == item.MaterialID)?.ID,
                //                ProductID = item.MaterialID,
                //                PlantingZoneID = item.WarehouseID,
                //                StampID = item.RefQRCode,
                //                InStore = item.Quantity1,
                //                InStoreTemp = item.Quantity1,
                //                GRID = item.GRID,
                //                GRDetailID = item.ID,
                //                NameCode = "NK." + DateTime.Now.ToString("yyyy.MM.") + count.ToString("D5")
                //            });

                //            _logService.SaveLog("Tạo nhật ký cho sản phẩm từ nhập sản phẩm");
                //        }
                //    }
                //}

                //_txngContext.Execute($@"p_Warehouse_Import @GRID, @GRType, @ReceiptPerson, @companyID",
                //    new
                //    {
                //        GRID = goodsReceipt.ID,
                //        GRType = goodsReceipt.GRType,
                //        ReceiptPerson = goodsReceipt.ReceiptPerson,
                //        companyID = userCurrent.CompanyID
                //    });
                //goodsReceipt.IsLocked = true;
                //_txngContext.Update(goodsReceipt);

                List<GRDetail> grDetails = _txngContext.Query<GRDetail>(" SELECT * FROM GRDetails WHERE GRID = @GRID ", new
                {
                    GRID = goodsReceipt.ID
                }).ToList();

                string companyId = userCurrent.CompanyID;

                string partnerName = _txngContext.Query<string>(" SELECT PartnerName FROM Partners WHERE ID = @ID ", new
                {
                    ID = goodsReceipt.PartnerID
                }).FirstOrDefault();

                List<Batch> batches = _txngContext.Query<Batch>(" SELECT ID, BatchNum FROM Batches WHERE ID IN (SELECT [VALUE] FROM dbo.FUNCTIONSPLIT(@IDS, ',')) ", new
                {
                    IDS = string.Join(",", grDetails.Select(p => p.BatchID))
                }).ToList();

                List<Warehouse> warehouses = _txngContext.Query<Warehouse>(" SELECT ID, [Name] FROM Warehouses WHERE ID IN (SELECT [VALUE] FROM dbo.FUNCTIONSPLIT(@IDS, ',')) ", new
                {
                    IDS = string.Join(",", grDetails.Select(p => p.WarehouseID))
                }).ToList();

                List<DescriptionProductMaterialHistoryModel> descriptionProductMaterialHistoryModels = null;
                Batch batch = null;
                Warehouse warehouse = null;

                List<ProductHistoriesModel> productHistoriesModel = new List<ProductHistoriesModel>();
                List<MaterialHistoriesModel> materialHistoriesModel = new List<MaterialHistoriesModel>();

                for (int i = 0; i < grDetails.Count; i++)
                {
                    batch = batches.FirstOrDefault(p => p.ID == grDetails[i].BatchID);
                    warehouse = warehouses.FirstOrDefault(p => p.ID == grDetails[i].WarehouseID);

                    descriptionProductMaterialHistoryModels = _productMaterialHistoryService.GenerateDescriptionProductMaterial(goodsReceipt.GRType == 2 ? ShowTypeProductMaterialHistory.GoodReceiptFromBatch : ShowTypeProductMaterialHistory.GoodReceiptFromProductMaterial, goodsReceipt.GRType == 1 ? IsProductMaterialHistory.Material : IsProductMaterialHistory.Product, new DescriptionDataProductMaterialHistoryModel
                    {
                        CreatedName = userCurrent.FullName,
                        WarehouseID = grDetails[i].WarehouseID,
                        WarehouseName = warehouse != null ? warehouse.Name : "",
                        Quantity = grDetails[i].Quantity ?? 0,
                        GRCode = goodsReceipt.GRCode,
                        GRID = goodsReceipt.ID,
                        SupplierID = goodsReceipt.PartnerID,
                        SupplierName = partnerName,
                        BatchID = grDetails[i].BatchID,
                        BatchNum = batch != null ? batch.BatchNum : "",
                        UnitName = grDetails[i].UnitName
                    });

                    if (goodsReceipt.GRType == 1)
                    {
                        materialHistoriesModel.Add(new MaterialHistoriesModel
                        {
                            ID = _configsService.NewIDoC,
                            CompanyID = companyId,
                            MaterialID = grDetails[i].MaterialID,
                            CreatedDate = DateTime.Now,
                            Description = JsonConvert.SerializeObject(descriptionProductMaterialHistoryModels),
                            ShowType = ShowTypeProductMaterialHistory.GoodReceiptFromProductMaterial
                        });
                    }
                    else
                    {
                        productHistoriesModel.Add(new ProductHistoriesModel
                        {
                            ID = _configsService.NewIDoC,
                            CompanyID = companyId,
                            ProductID = grDetails[i].MaterialID,
                            CreatedDate = DateTime.Now,
                            Description = JsonConvert.SerializeObject(descriptionProductMaterialHistoryModels),
                            ShowType = goodsReceipt.GRType == 2 ? ShowTypeProductMaterialHistory.GoodReceiptFromBatch : ShowTypeProductMaterialHistory.GoodReceiptFromProductMaterial
                        });
                    }
                }

                if (materialHistoriesModel.Count > 0)
                {
                    _txngContext.InsertMany<MaterialHistoriesModel>(materialHistoriesModel);
                }

                if (productHistoriesModel.Count > 0)
                {
                    _txngContext.InsertMany<ProductHistoriesModel>(productHistoriesModel);
                }

                _logService.SaveLog("Khóa phiếu nhập hàng " + goodsReceipt.GRCode);

                resultJs.status = 200;

                resultJs.message = "Khóa phiếu nhập hàng thành công";
            Final:
                return Ok(resultJs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }


        #endregion

        #region CRUD
        [HttpPost("Create")]
        [ClaimRequirement(FunctionCode.GoodReceipts, PermissionAction.Create)]
        [ValidateModel]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> Create([FromForm] GoodsReceiptJs model)
        {
            try
            {
                User _userCurrent = _userService.GetUserCurrent();

                ResultJs<object> resultJs = new ResultJs<object>();

                bool materialUnitIsNull = false;

                model = model.ConvertNull();

                #region Vaild
                #region Check Unit
                List<MUUModel> materialUnits = new List<MUUModel>();
                List<PUUModel> productUnits = new List<PUUModel>();

                string companyId = userCurrent.CompanyID;

                if (model.GRDetails == null || model.GRDetails.Count <= 0)
                {
                    var grDetailForms = Request.Form["grDetails"];

                    try
                    {
                        string json = grDetailForms.FirstOrDefault();

                        if (!string.IsNullOrEmpty(json))
                        {
                            if (!json.StartsWith("[") && !json.EndsWith("]"))
                            {
                                json = "[" + json + "]";
                            }

                            List<GRDetailJs> gRDetailJs = JsonConvert.DeserializeObject<List<GRDetailJs>>(json);

                            model.GRDetails = gRDetailJs;
                        }
                    }
                    catch (Exception ex)
                    { }
                }

                if (string.IsNullOrEmpty(model.PartnerID))
                {
                    resultJs.message = "Nhà cung cấp không được bỏ trống";

                    goto Final;
                }

                if (model.GRDetails == null || model.GRDetails.Count <= 0)
                {
                    resultJs.message = "Chi tiết phiếu nhập hàng không được bỏ trống";

                    goto Final;
                }

                bool checkWareHouse = model.GRDetails.Any(p => string.IsNullOrEmpty(p.WarehouseID));

                if (checkWareHouse)
                {
                    resultJs.message = "Kho hàng trong chi tiết phiếu nhập hàng không được bỏ trống";

                    goto Final;
                }

                if (model.GRType == 0) // Sản phẩm
                {
                    productUnits = _goodsProvider.GetProductUnit(model.GRDetails, companyId);
                    var isValid = true;
                    if (productUnits != null)
                    {
                        foreach (var item in model.GRDetails)
                        {
                            isValid = productUnits.Any(y => y.UnitID == item.UnitID && y.ProductID == item.MaterialID);
                            if (!isValid)
                            {
                                resultJs.message = "Đơn vị tính không hợp lệ";

                                goto Final;
                            }
                        }
                    }
                    else
                    {
                        resultJs.message = "Đơn vị tính không hợp lệ";

                        goto Final;
                    }

                    //if (model.GRDetails.Any(x => string.IsNullOrWhiteSpace(x.WarehouseID)))
                    //{
                    //    result.message = "Vị trí không được để trống";
                    //    goto Final;
                    //}
                }
                else if (model.GRType == 1)
                {
                    //List<MaterialUnit> materialProductUnits = _materialService.GetListMaterialProductUnit(model.GRDetails.Select(p => p.MaterialID).ToList(), companyId);

                    List<ProductMaterialUnitViewModel> productMaterialUnitViewModels = _productMaterialUnitService.GetListProductMaterialUnit(model.GRDetails.Select(p => p.MaterialID).ToList(), companyId);

                    for (int i = 0; i < model.GRDetails.Count; i++)
                    {
                        if (productMaterialUnitViewModels.Where(p => p.ProductID == model.GRDetails[i].MaterialID && p.UnitID == model.GRDetails[i].UnitID).Count() <= 0)
                        {
                            resultJs.message = "Đơn vị tính không hợp lệ";

                            goto Final;
                        }
                    }
                }
                #endregion
                #endregion

                int total = 1 + _txngContext.Query<int>($@"select count (1) from GoodReceipts 
                            where  DATEDIFF(MONTH,GRTime,GETDATE())=0  
                            and CompanyID = @CompanyID",
                    new
                    {
                        CompanyID = userCurrent.CompanyID
                    }).FirstOrDefault();

                GoodsReceipt goodsReceipt = new GoodsReceipt();
                PropertyCopier<GoodsReceiptJs, GoodsReceipt>.Copy(model, goodsReceipt);
                goodsReceipt.ID = _configsService.NewIDoC;

                Type qrCodeType = typeof(QRCodeType);

                QRCodeType qrCodeTypePN = QRCodeType.PN;

                string qrCodeString = StringHelper.GetEnumMemberAttrValue(qrCodeType, qrCodeTypePN);

                //goodsReceipt.GRCode = (string.IsNullOrEmpty(qrCodeString) ? "PN" : qrCodeString) + "." + DateTime.Now.ToString("yyyy.MM.") + total.ToString("D6"); // PNxx.ddMMyyyy.00001
                goodsReceipt.GRCode = _configsService.NewIDGoodReceiptCode(companyId);
                goodsReceipt.QRCode = _qRCodeProvider.Encryto(QRCodeType.PN, qrCodeString + "." + goodsReceipt.ID);
                goodsReceipt.CompanyID = _userCurrent.CompanyID;
                goodsReceipt.IsDisabled = false;
                //goodsReceipt.IsLocked = false;
                goodsReceipt.CreatedBy = _userCurrent.Id;
                goodsReceipt.CreatedDate = DateTime.Now;
                goodsReceipt.Amount = Convert.ToInt32(model.GRDetails.Sum(x => (x.UnitPrice * x.Quantity)));
                //goodsReceipt.PartnerType = 1;
                goodsReceipt.GRTime = model.GRTime ?? DateTime.Now;
                goodsReceipt.Status = 0;
                goodsReceipt.ReceiptPerson = model.ReceiptPerson;
                goodsReceipt.GRType = model.GRType == 2 ? 0 : model.GRType;

                _configsService.UpdateNewIDGoodReceiptCode(companyId);

                string traceId = "";
                string batchId = "";
                string productId = "";

                if (model.GRType == 2)
                {
                    GRDetailJs grDetailJs = model.GRDetails.FirstOrDefault();

                    if (grDetailJs != null)
                    {
                        traceId = grDetailJs.TraceID;
                        batchId = grDetailJs.BatchID;
                        productId = grDetailJs.MaterialID;

                        goodsReceipt.BatchID = batchId;

                        //int checkExistBatchFromGoodReceipt = _txngContext.Query<int>("SELECT 1 FROM GoodReceipts WHERE BatchID = @BATCHID", new
                        //{
                        //    BATCHID = batchId
                        //}).FirstOrDefault();

                        //if (checkExistBatchFromGoodReceipt > 0)
                        //{
                        //    resultJs.message = "Lô hàng này đã được nhập. Không thể nhập tiếp được nữa";

                        //    goto Final;
                        //}
                    }
                }

                if (string.IsNullOrEmpty(goodsReceipt.ReceiptPerson))
                {
                    goodsReceipt.ReceiptPerson = _userCurrent.Id;
                }

                if (model.FilesFiles != null)
                {
                    var resultFile = await _fileProvider.UploadFileAsync(model.FilesFiles, string.Format(Constants.Path.COMPANY_GR, userCurrent.CompanyID));

                    if (resultFile.status == 200)
                    {
                        goodsReceipt.Files = resultFile.data.ToString();
                    }
                    else
                    {
                        return Ok(resultFile);
                    }
                }

                //model.GRDetails.ForEach(x =>
                //{
                //    goodsReceipt.VAT = Convert.ToInt32(goodsReceipt.VAT ?? 0 + (x.UnitPrice / 100 * (x.PerVAT ?? 0)));
                //    // goodsReceipt.TotalAmount = x.UnitPrice + Convert.ToInt32(goodsReceipt.VAT ?? 0 + (x.UnitPrice / 100 * (x.PerVAT ?? 0)));
                //});

                decimal? vat = model.GRDetails.Sum(p => (p.PerVAT * (p.UnitPrice * p.Quantity)) / 100);

                goodsReceipt.VAT = Convert.ToInt32(vat);

                goodsReceipt.TotalAmount = goodsReceipt.Amount + goodsReceipt.VAT;

                int handleInventory = 0;

                #region Handle detail
                if (model.GRType == 1) // Nguyên vật liệu
                {
                    // CreateDetailByMaterial(goodsReceipt, model, materialUnits);

                    handleInventory = HandleInventoryMaterial(goodsReceipt.ID, goodsReceipt.GRType, _userCurrent.CompanyID, _userCurrent.Id, _userCurrent.FullName, model.GRDetails, true);
                }
                else if (model.GRType == 0)
                {
                    // CreateDetailByProduct(goodsReceipt, model, productUnits);

                    handleInventory = HandleInventoryProduct(goodsReceipt.ID, goodsReceipt.GRType, _userCurrent.CompanyID, _userCurrent.Id, _userCurrent.FullName, model.GRDetails, true);
                }
                else if (model.GRType == 2)
                {
                    // CreateDetailByProduct(goodsReceipt, model, productUnits);
                     
                    handleInventory = HandleInventoryProduct(goodsReceipt.ID, goodsReceipt.GRType, _userCurrent.CompanyID, _userCurrent.Id, _userCurrent.FullName, model.GRDetails, true);

                    if (handleInventory == 0)
                    {
                        if (!string.IsNullOrEmpty(traceId))
                        {
                            int existTraceCompany = _txngContext.Query<int>(" SELECT 1 FROM TracesCompanies WHERE TraceID = @TRACEID AND CompanyID = @COMPANYID ", new
                            {
                                COMPANYID = companyId,
                                TRACEID = traceId
                            }).FirstOrDefault();

                            if (existTraceCompany <= 0)
                            {
                                _txngContext.Execute(" INSERT INTO TracesCompanies (ID, TraceID, CompanyID, IsBelongTo) VALUES (@ID, @TRACEID, @COMPANYID, @ISBELONGTO) ", new
                                {
                                    ID = _configsService.NewID,
                                    TRACEID = traceId,
                                    COMPANYID = companyId,
                                    ISBELONGTO = false
                                });
                            }
                        }

                        if (!string.IsNullOrEmpty(productId))
                        {
                            string companyField = _txngContext.Query<string>(" SELECT FieldID FROM CompaniesFields WHERE CompanyID = @COMPANYID ", new
                            {
                                COMPANYID = companyId
                            }).FirstOrDefault();

                            if (!string.IsNullOrEmpty(companyField))
                            {
                                List<string> productFieldIds = _txngContext.Query<string>($" SELECT PF.FieldID FROM ProductFields AS PF WHERE PF.ProductID = @PRODUCTID AND PF.FieldID IN (SELECT ID FROM FUNC_GETFIELDCHILDREN('{companyField}') WHERE LEN(FieldCode) = 5) ", new
                                {
                                    PRODUCTID = productId
                                }).ToList();

                                List<string> fieldIds = _txngContext.Query<string>($" SELECT ID FROM FUNC_GETFIELDCHILDREN('{companyField}') WHERE LEN(FieldCode) = 5  ", new
                                {
                                   
                                }).ToList();

                                List<string> fieldIdExcepts = fieldIds.Except(productFieldIds).ToList();

                                List<string> productFields = new List<string>();

                                for (int i = 0; i < fieldIdExcepts.Count; i++)
                                {
                                    productFields.Add(string.Format(" INSERT INTO ProductFields (ID, ProductID, FieldID) VALUES (N'{0}', N'{1}', N'{2}') ", _configsService.NewIDoC, productId, fieldIdExcepts[i]));
                                }

                                if (productFields.Count > 0)
                                {
                                    _txngContext.Execute(string.Join(" ; ", productFields));
                                }
                            }
                        }
                    }
                }
                #endregion

                if (handleInventory != 0)
                {
                    if (handleInventory == -1)
                    {
                        resultJs.message = "Bạn vui lòng chọn 1 đơn vị tính quy đổi làm đơn vị báo cáo trước khi nhập hàng";

                        return Ok(resultJs);
                    }
                    else if (handleInventory == -2)
                    {
                        resultJs.message = "Sản phẩm/nguyên liệu này không tồn tại";

                        return Ok(resultJs);
                    }
                }

                _txngContext.Insert<GoodsReceipt>(goodsReceipt);

                if (model.GRType == 2)
                {
                    GRDetailJs grDetailJs = model.GRDetails.FirstOrDefault();

                    if (grDetailJs != null)
                    {
                        int checkExistProductCompany = _txngContext.Query<int>(" SELECT 1 FROM ProductCompany WHERE CompanyID = @COMPANYID AND PRODUCTID = @PRODUCTID ", new
                        {
                            COMPANYID = companyId,
                            PRODUCTID = grDetailJs.MaterialID
                        }).FirstOrDefault();

                        if (checkExistProductCompany <= 0)
                        {
                            _txngContext.Insert<ProductCompany>(new ProductCompany
                            {
                                ProductID = grDetailJs.MaterialID,
                                CompanyID = companyId,
                                InStore = 0,
                                InStoreTemp = 0,
                                OutStore = 0,
                                OutStoreTemp = 0,
                                QuantityInStore = 0,
                                IsMaterial = false
                            });
                        }
                    }
                }

                //_goodsReceiptService.Inserts(goodsReceipt);

                _logService.SaveLog($"Thêm phiếu nhập hàng {goodsReceipt.GRCode}");

                resultJs.status = 200;

                resultJs.message = "Tạo phiếu nhập hàng thành công";

                resultJs.data = new { id = goodsReceipt.ID };

                return Ok(resultJs);
            Final:
                return Ok(resultJs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost("Update")]
        [ClaimRequirement(FunctionCode.GoodReceipts, PermissionAction.Update)]
        //[Produces("multipart/form-data")]
        [ValidateModel]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> Update([FromForm] GoodsReceiptJs model)
        {
            try
            {
                HttpClient httpClient = new HttpClient();

                //httpClient.GetAsync("http://103.98.152.222:3000/log?message=GoodDeliveryUpdate_1");

                ResultJs<string> resultJs = new ResultJs<string>();

                GoodsReceipt goodsReceipt = new GoodsReceipt();

                string companyId = userCurrent.CompanyID;

                model = model.ConvertNull();

                if (model.GRDetails == null || model.GRDetails.Count <= 0)
                {
                    var grDetailForms = Request.Form["grDetails"];

                    try
                    {
                        string json = grDetailForms.FirstOrDefault();

                        if (!string.IsNullOrEmpty(json))
                        {
                            if (!json.StartsWith("[") && !json.EndsWith("]"))
                            {
                                json = "[" + json + "]";
                            }

                            List<GRDetailJs> gRDetailJs = JsonConvert.DeserializeObject<List<GRDetailJs>>(json);

                            model.GRDetails = gRDetailJs;
                        }
                    }
                    catch { }
                }

                httpClient.GetAsync("http://103.98.152.222:3000/log?message=GoodDeliveryUpdate_2");

                #region Vaild
                goodsReceipt = _goodsReceiptService.Find(" ID = @ID AND CompanyID = @COMPANYID AND ISNULL(IsDisabled, 0) = 0 ",
                new
                {
                    ID = model.ID,
                    COMPANYID = userCurrent.CompanyID
                });

                httpClient.GetAsync("http://103.98.152.222:3000/log?message=GoodDeliveryUpdate_3");

                if (goodsReceipt == null)
                {
                    resultJs.message = "Không tìm thấy phiếu nhập hàng";

                    goto Final;
                }

                //if ((goodsReceipt.IsLocked) ?? false == true)
                //{
                //    resultJs.message = "Phiếu nhập đã khóa không thể chỉnh sửa";

                //    goto Final;
                //}

                if (goodsReceipt.Status == 1 || goodsReceipt.Status == 2)
                {
                    resultJs.message = "Phiếu nhập yêu cầu duyệt/đã duyệt. Không được sửa";

                    goto Final;
                }

                if (goodsReceipt.CreatedBy != userCurrent.Id)
                {
                    resultJs.message = "Phiếu nhập không thuộc tài khoản hiện tại. Không được sửa";

                    goto Final;
                }

                if (string.IsNullOrEmpty(model.PartnerID))
                {
                    resultJs.message = "Nhà cung cấp không được bỏ trống";

                    goto Final;
                }

                if (model.GRDetails == null || model.GRDetails.Count <= 0)
                {
                    resultJs.message = "Chi tiết phiếu nhập hàng không được bỏ trống";

                    goto Final;
                }

                bool checkWareHouse = model.GRDetails.Any(p => string.IsNullOrEmpty(p.WarehouseID));

                if (checkWareHouse)
                {
                    resultJs.message = "Kho hàng trong chi tiết phiếu nhập hàng không được bỏ trống";

                    goto Final;
                }

                #region Check MaterialUnit
                List<MUUModel> materialUnits = new List<MUUModel>();
                List<PUUModel> productUnits = new List<PUUModel>();
                if ((goodsReceipt.GRType ?? 1) == 1)
                {
                    List<MaterialUnit> materialProductUnits = _materialService.GetListMaterialProductUnit(model.GRDetails.Select(p => p.MaterialID).ToList(), companyId);

                    List<ProductMaterialUnitViewModel> productMaterialUnitViewModels = _productMaterialUnitService.GetListProductMaterialUnit(model.GRDetails.Select(p => p.MaterialID).ToList(), companyId);

                    for (int i = 0; i < model.GRDetails.Count; i++)
                    {
                        if (productMaterialUnitViewModels.Where(p => p.ProductID == model.GRDetails[i].MaterialID && p.UnitID == model.GRDetails[i].UnitID).Count() <= 0)
                        {
                            resultJs.message = "Đơn vị tính không hợp lệ";

                            goto Final;
                        }
                    }
                }
                else
                {
                    productUnits = _goodsProvider.GetProductUnit(model.GRDetails, companyId);

                    var isValid = true;

                    if (materialUnits != null)
                    {
                        foreach (var item in model.GRDetails)
                        {
                            isValid = productUnits.Any(y => y.UnitID == item.UnitID && y.ProductID == item.MaterialID);

                            if (!isValid)
                            {
                                resultJs.message = "Đơn vị tính không hợp lệ";

                                goto Final;
                            }
                        }
                    }
                    else
                    {
                        resultJs.message = "Đơn vị tính không hợp lệ";

                        goto Final;
                    }

                    if (model.GRDetails.Any(x => string.IsNullOrWhiteSpace(x.WarehouseID)))
                    {
                        resultJs.message = "Kho không được để trống";

                        goto Final;
                    }
                }

                httpClient.GetAsync("http://103.98.152.222:3000/log?message=GoodDeliveryUpdate_4");

                #endregion
                #endregion

                DateTime currentDateTime = DateTime.Now;
                string fullName = userCurrent.FullName;

                int? status = goodsReceipt.Status;

                string fileOld = goodsReceipt.Files;
                model.GRType = goodsReceipt.GRType;
                PropertyCopier<GoodsReceiptJs, GoodsReceipt>.Copy(model, goodsReceipt);
                goodsReceipt.Files = model.StrFile;
                goodsReceipt.ModifiedBy = fullName;
                goodsReceipt.ModifiedDate = currentDateTime;
                goodsReceipt.Amount = Convert.ToInt32(model.GRDetails.Sum(x => (x.UnitPrice * x.Quantity)));
                goodsReceipt.GRTime = model.GRTime ?? currentDateTime;

                if (status == 3)
                {
                    goodsReceipt.Status = 4;
                    goodsReceipt.Content2 = model.Content2;
                    goodsReceipt.RequestedDate = currentDateTime;
                }

                bool confirmGR = _txngContext.Query<bool>(" SELECT ConfirmGR FROM CompanyConfig WHERE CompanyID = @COMPANYID ", new
                {
                    COMPANYID = userCurrent.CompanyID
                }).FirstOrDefault();

                if (confirmGR && status == 3)
                {
                    goodsReceipt.Status = 4;
                    goodsReceipt.RequestedDate = currentDateTime;
                }

                if (model.FilesFiles != null)
                {
                    ResultJs<string> resultJsFile = await _fileProvider.UploadFileAsync(model.FilesFiles, string.Format(Constants.Path.COMPANY_GR, userCurrent.CompanyID));

                    if (resultJsFile.status == 200)
                    {
                        goodsReceipt.Files = resultJsFile.data.ToString();
                    }
                    else
                    {
                        resultJs.message = "Tải tệp tin thất bại";

                        return Ok(resultJs);
                    }
                }

                httpClient.GetAsync("http://103.98.152.222:3000/log?message=GoodDeliveryUpdate_5");

                //model.GRDetails.ForEach(x =>
                //{
                //    goodsReceipt.VAT = Convert.ToInt32((goodsReceipt.VAT ?? 0) + (x.UnitPrice / 100 * (x.PerVAT ?? 0)));
                //    // goodsReceipt.TotalAmount = x.UnitPrice + Convert.ToInt32(goodsReceipt.VAT ?? 0 + (x.UnitPrice / 100 * (x.PerVAT ?? 0)));
                //});

                //goodsReceipt.TotalAmount = goodsReceipt.Amount ?? 0 + goodsReceipt.VAT;

                decimal? vat = model.GRDetails.Sum(p => (p.PerVAT * (p.UnitPrice * p.Quantity)) / 100);

                goodsReceipt.VAT = Convert.ToInt32(vat);

                goodsReceipt.TotalAmount = goodsReceipt.Amount + goodsReceipt.VAT;

                httpClient.GetAsync("http://103.98.152.222:3000/log?message=GoodDeliveryUpdate_6");

                int handleInventory = 0;

                #region Handle detail
                if ((goodsReceipt.GRType ?? 1) == 1)
                {
                    // UpdateDetailByMaterial(goodsReceipt, model, materialUnits);

                    handleInventory = HandleInventoryMaterial(goodsReceipt.ID, goodsReceipt.GRType, userCurrent.CompanyID, userCurrent.Id, userCurrent.FullName, model.GRDetails, false);
                }
                else
                {
                    // UpdateDetailByProduct(goodsReceipt, model, productUnits);

                    handleInventory = HandleInventoryProduct(goodsReceipt.ID, goodsReceipt.GRType, userCurrent.CompanyID, userCurrent.Id, userCurrent.FullName, model.GRDetails, false);
                }

                if (handleInventory != 0)
                {
                    if (handleInventory == -1)
                    {
                        resultJs.message = "Bạn vui lòng chọn 1 đơn vị tính quy đổi làm đơn vị báo cáo trước khi nhập hàng";

                        return Ok(resultJs);
                    }
                    else if (handleInventory == -2)
                    {
                        resultJs.message = "Sản phẩm/nguyên liệu này không tồn tại";

                        return Ok(resultJs);
                    }
                }

                _txngContext.Update<GoodsReceipt>(goodsReceipt);

                if (status == 3)
                {
                    _txngContext.Execute(" INSERT INTO GREvaluations (GRID, RequestedDate, RequestedBy, Content2) VALUES (@GIID, @REQUESTEDDATE, @REQUESTEDBY, @CONTENT2) ", new
                    {
                        GRID = goodsReceipt.ID,
                        REQUESTEDDATE = DateTime.Now,
                        REQUESTEDBY = userCurrent.Id,
                        CONTENT2 = model.Content2
                    });

                    string content = _alertTypeService.HandleTemplate(Constants.AlertType.ID.SendRequestVerifyRegainGoodReceipt, new DataAlertTypeTemplateViewModel
                    {
                        Data1 = fullName,
                        Data2 = goodsReceipt.GRCode
                    });

                    _alertService.SendToLocal(userCurrent.CompanyID, Constants.AlertType.ID.SendRequestVerifyRegainGoodReceipt, goodsReceipt.ID, content, fullName, DateTime.Now, HubServerType.App);
                }

                _fileProvider.Delete(fileOld, goodsReceipt.Files, string.Format(Constants.Path.COMPANY_GR, userCurrent.CompanyID));

                httpClient.GetAsync("http://103.98.152.222:3000/log?message=GoodDeliveryUpdate_7");
                #endregion

                _logService.SaveLog($"Sửa phiếu nhập hàng { goodsReceipt.GRCode}");

                resultJs.status = 200;

                resultJs.message = "Sửa phiếu nhập hàng thành công";
            Final:
                return Ok(resultJs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpDelete("Delete/{id}")]
        [ClaimRequirement(FunctionCode.GoodReceipts, PermissionAction.Delete)]
        public IActionResult Delete(string id)
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                resultJs.message = "Phiếu nhập hàng đã được sử dụng";

                GoodsReceipt goodsReceipt = _goodsReceiptService.Find(" ID = @ID AND CompanyID = @COMPANYID AND ISNULL(IsDisabled,0) = 0 ",
                    new
                    {
                        ID = id,
                        COMPANYID = userCurrent.CompanyID
                    });

                #region Valid
                if (goodsReceipt == null)
                {
                    resultJs.message = "Không tìm thấy phiếu nhập hàng";

                    goto Final;
                }

                //if ((goodsReceipt.IsLocked) ?? false == true)
                //{
                //    resultJs.message = "Phiếu nhập đã khóa. Không thể xóa";

                //    goto Final;
                //}

                if (!(goodsReceipt.Status == 0 || goodsReceipt.Status == 3))
                {
                    resultJs.message = "Phiếu nhập yêu cầu duyệt/đã duyệt. Không thể xóa";

                    goto Final;
                }
                #endregion

                goodsReceipt.IsDisabled = true;

                _txngContext.Update<GoodsReceipt>(goodsReceipt);

                UpdateInventoryDelete(goodsReceipt.ID, userCurrent.CompanyID, userCurrent.Id, userCurrent.FullName);

                if (goodsReceipt.GRType == 2)
                {
                    HandleBatchCompanyForUnConfirm(goodsReceipt.ID);
                }

                //  _goodsProvider.DeleteGR(goodsReceipt);

                _logService.SaveLog("Xoá phiếu nhập hàng " + goodsReceipt.GRCode);

                resultJs.status = 200;

                resultJs.message = "Xoá phiếu nhập hàng thành công";

            Final:
                return Ok(resultJs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut("RequireConfirm/{id}")]
        [ClaimRequirement(FunctionCode.GoodReceipts, PermissionAction.Create)]
        public IActionResult RequireConfirm(string id)
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                resultJs.message = "";

                GoodsReceipt goodsReceipt = _goodsReceiptService.Find(" ID = @ID AND CompanyID = @COMPANYID AND ISNULL(IsDisabled,0) = 0 ",
                    new
                    {
                        ID = id,
                        COMPANYID = userCurrent.CompanyID
                    });

                #region Valid
                if (goodsReceipt == null)
                {
                    resultJs.message = "Không tìm thấy phiếu nhập hàng";

                    goto Final;
                }

                //if ((goodsReceipt.IsLocked) ?? false == true)
                //{
                //    resultJs.message = "Phiếu nhập đã khóa. Không thể yêu cầu duyệt";

                //    goto Final;
                //}

                if (!(goodsReceipt.Status == 0 || goodsReceipt.Status == 3))
                {
                    resultJs.message = "Phiếu nhập yêu cầu duyệt/đã duyệt. Không thể yêu cầu duyệt";

                    goto Final;
                }

                bool confirmGR = _txngContext.Query<bool>(" SELECT ConfirmGR FROM CompanyConfig WHERE CompanyID = @COMPANYID ", new
                {
                     COMPANYID = userCurrent.CompanyID
                }).FirstOrDefault();

                if (!confirmGR)
                {
                    resultJs.message = "Không được phép yêu cầu duyệt";

                    goto Final;
                }
                #endregion

                string fullName = userCurrent.FullName;

                goodsReceipt.Status = 1;
                goodsReceipt.RequestedDate = DateTime.Now;

                _txngContext.Update<GoodsReceipt>(goodsReceipt);

                string content = _alertTypeService.HandleTemplate(Constants.AlertType.ID.SendRequestVerifyGoodReceipt, new DataAlertTypeTemplateViewModel
                {
                    Data1 = fullName,
                    Data2 = goodsReceipt.GRCode
                });

                _alertService.SendToLocal(userCurrent.CompanyID, Constants.AlertType.ID.SendRequestVerifyGoodReceipt, goodsReceipt.ID, content, fullName, DateTime.Now, HubServerType.App);

                _logService.SaveLog("Yêu cầu duyệt phiếu nhập hàng " + goodsReceipt.GRCode);

                resultJs.status = 200;

                resultJs.message = "Yêu cầu duyệt phiếu nhập hàng thành công";

            Final:
                return Ok(resultJs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut("RequestConfirm/{id}")]
        [ClaimRequirement(FunctionCode.GoodReceipts, PermissionAction.Confirm)]
        public IActionResult RequestConfirm(string id)
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                resultJs.message = "";

                GoodsReceipt goodsReceipt = _goodsReceiptService.Find(" ID = @ID AND CompanyID = @COMPANYID AND ISNULL(IsDisabled,0) = 0 ",
                    new
                    {
                        ID = id,
                        COMPANYID = userCurrent.CompanyID
                    });

                #region Valid
                if (goodsReceipt == null)
                {
                    resultJs.message = "Không tìm thấy phiếu nhập hàng";

                    goto Final;
                }

                //if ((goodsReceipt.IsLocked) ?? false == true)
                //{
                //    resultJs.message = "Phiếu nhập đã khóa. Không thể yêu cầu duyệt";
             
                //    goto Final;
                //}

                if (!(goodsReceipt.Status == 0 || goodsReceipt.Status == 3 || goodsReceipt.Status == 1 || goodsReceipt.Status == 4))
                {
                    resultJs.message = "Phiếu nhập yêu cầu duyệt/đã duyệt. Không thể duyệt";

                    goto Final;
                }
                #endregion

                DateTime currentDateTime = DateTime.Now;
                string userId = userCurrent.Id;
                string fullName = userCurrent.FullName;

                goodsReceipt.Status = 2;
                goodsReceipt.ConfirmedBy = userId;
                goodsReceipt.ConfirmedDate = currentDateTime;

                _txngContext.Update<GoodsReceipt>(goodsReceipt);

                _txngContext.Execute(" INSERT INTO GREvaluations (GRID, ConfirmedDate, ConfirmedBy, [Status]) VALUES (@GRID, @CONFIRMEDBY, @CONFIRMEDDATE, @STATUS) ", new
                {
                    GRID = goodsReceipt.ID,
                    CONFIRMEDBY = userId,
                    CONFIRMEDDATE = currentDateTime,
                    STATUS = 2
                });

                string content = _alertTypeService.HandleTemplate(Constants.AlertType.ID.VerifiedGoodReceipt, new DataAlertTypeTemplateViewModel
                {
                    Data1 = fullName,
                    Data2 = goodsReceipt.GRCode
                });

                _alertService.SendToLocal(userCurrent.CompanyID, Constants.AlertType.ID.VerifiedGoodReceipt, goodsReceipt.ID, content, fullName, DateTime.Now, HubServerType.App);

                UpdateInventoryRequestConfirm(goodsReceipt.ID, userCurrent.CompanyID, userCurrent.Id, userCurrent.FullName);

                HandleGRQuantity(goodsReceipt.ID, goodsReceipt.CompanyID, goodsReceipt.BatchID);

                //  _goodsProvider.DeleteGR(goodsReceipt);

                List<GRDetail> grDetails = _txngContext.Query<GRDetail>(" SELECT * FROM GRDetails WHERE GRID = @GRID ", new
                {
                    GRID = goodsReceipt.ID
                }).ToList();

                string companyId = userCurrent.CompanyID;

                string partnerName = _txngContext.Query<string>(" SELECT PartnerName FROM Partners WHERE ID = @ID ", new
                {
                    ID = goodsReceipt.PartnerID
                }).FirstOrDefault();

                List<Warehouse> warehouses = _txngContext.Query<Warehouse>(" SELECT ID, [Name] FROM Warehouses WHERE ID IN (SELECT [VALUE] FROM dbo.FUNCTIONSPLIT(@IDS, ',')) ", new
                {
                    IDS = string.Join(",", grDetails.Select(p => p.WarehouseID))
                }).ToList();

                List<Batch> batches = _txngContext.Query<Batch>(" SELECT ID, BatchNum FROM Batches WHERE ID IN (SELECT [VALUE] FROM dbo.FUNCTIONSPLIT(@IDS, ',')) ", new
                {
                    IDS = string.Join(",", grDetails.Select(p => p.BatchID))
                }).ToList();

                List<DescriptionProductMaterialHistoryModel> descriptionProductMaterialHistoryModels = null;
                Batch batch = null;
                Warehouse warehouse = null;

                List<ProductHistoriesModel> productHistoriesModel = new List<ProductHistoriesModel>();
                List <MaterialHistoriesModel> materialHistoriesModel = new List<MaterialHistoriesModel>();

                for (int i = 0; i < grDetails.Count; i++)
                {
                    batch = batches.FirstOrDefault(p => p.ID == grDetails[i].BatchID);
                    warehouse = warehouses.FirstOrDefault(p => p.ID == grDetails[i].WarehouseID);

                    descriptionProductMaterialHistoryModels = _productMaterialHistoryService.GenerateDescriptionProductMaterial(goodsReceipt.GRType == 2 ? ShowTypeProductMaterialHistory.GoodReceiptFromBatch : ShowTypeProductMaterialHistory.GoodReceiptFromProductMaterial, goodsReceipt.GRType == 1 ? IsProductMaterialHistory.Material : IsProductMaterialHistory.Product, new DescriptionDataProductMaterialHistoryModel
                    {
                        CreatedName = userCurrent.FullName,
                        WarehouseID = grDetails[i].WarehouseID,
                        WarehouseName = warehouse != null ? warehouse.Name : "",
                        Quantity = grDetails[i].Quantity ?? 0,
                        GRCode = goodsReceipt.GRCode,
                        GRID = goodsReceipt.ID,
                        SupplierID = goodsReceipt.PartnerID,
                        SupplierName = partnerName,
                        BatchID = grDetails[i].BatchID,
                        BatchNum = batch != null ? batch.BatchNum : "",
                        UnitName = grDetails[i].UnitName
                    });

                    if (goodsReceipt.GRType == 1)
                    {
                        materialHistoriesModel.Add(new MaterialHistoriesModel
                        {
                            ID = _configsService.NewIDoC,
                            CompanyID = companyId,
                            MaterialID = grDetails[i].MaterialID,
                            CreatedDate = DateTime.Now,
                            Description = JsonConvert.SerializeObject(descriptionProductMaterialHistoryModels),
                            ShowType = ShowTypeProductMaterialHistory.GoodReceiptFromProductMaterial
                        });
                    }
                    else
                    {
                        productHistoriesModel.Add(new ProductHistoriesModel
                        {
                            ID = _configsService.NewIDoC,
                            CompanyID = companyId,
                            ProductID = grDetails[i].MaterialID,
                            CreatedDate = DateTime.Now,
                            Description = JsonConvert.SerializeObject(descriptionProductMaterialHistoryModels),
                            ShowType = goodsReceipt.GRType == 2 ? ShowTypeProductMaterialHistory.GoodReceiptFromBatch :  ShowTypeProductMaterialHistory.GoodReceiptFromProductMaterial
                        });
                    }
                }

                if (productHistoriesModel.Count > 0)
                {
                    _txngContext.InsertMany<ProductHistoriesModel>(productHistoriesModel);
                }

                if (materialHistoriesModel.Count > 0)
                {
                    _txngContext.InsertMany<MaterialHistoriesModel>(materialHistoriesModel);
                }

                _logService.SaveLog("Duyệt phiếu nhập hàng " + goodsReceipt.GRCode);

                resultJs.status = 200;

                resultJs.message = "Duyệt phiếu nhập hàng thành công";

            Final:
                return Ok(resultJs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut("RequestUnConfirm/{id}")]
        [ClaimRequirement(FunctionCode.GoodReceipts, PermissionAction.Unconfirm)]
        public IActionResult RequestUnConfirm(string id, string reason, string content1)
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                resultJs.message = "";

                GoodsReceipt goodsReceipt = _goodsReceiptService.Find(" ID = @ID AND CompanyID = @COMPANYID AND ISNULL(IsDisabled,0) = 0 ",
                    new
                    {
                        ID = id,
                        COMPANYID = userCurrent.CompanyID
                    });

                #region Valid
                if (goodsReceipt == null)
                {
                    resultJs.message = "Không tìm thấy phiếu nhập hàng";

                    goto Final;
                }

                //if ((goodsReceipt.IsLocked) ?? false == true)
                //{
                //    resultJs.message = "Phiếu nhập đã khóa. Không thể yêu cầu duyệt";

                //    goto Final;
                //}

                if (!(goodsReceipt.Status == 1 || goodsReceipt.Status == 0 || goodsReceipt.Status == 4))
                {
                    resultJs.message = "Phiếu nhập không thuộc yêu cầu duyệt. Không thể xử lý";

                    goto Final;
                }

                if (string.IsNullOrEmpty(reason))
                {
                    resultJs.message = "Lý do không duyệt không được bỏ trống";

                    goto Final;
                }
                #endregion

                DateTime currentDateTime = DateTime.Now;
                string userId = userCurrent.Id;
                string fullName = userCurrent.FullName;

                goodsReceipt.Status = 3;
                goodsReceipt.ConfirmedBy = userCurrent.Id;
                goodsReceipt.ConfirmedDate = currentDateTime;
                goodsReceipt.ConfirmedReason = reason;
                goodsReceipt.Content1 = content1;

                _txngContext.Update<GoodsReceipt>(goodsReceipt);

                _txngContext.Execute(" INSERT INTO GREvaluations (GRID, ConfirmedDate, ConfirmedBy, ConfirmedReason, Content1, [Status]) VALUES (@GRID, @CONFIRMEDDATE, @CONFIRMEDBY, @CONFIRMEDREASON, @CONTENT1, @STATUS) ", new
                {
                    GRID = goodsReceipt.ID,
                    CONFIRMEDDATE = currentDateTime,
                    CONFIRMEDBY = userId,
                    CONFIRMEDREASON = reason,
                    CONTENT1 = content1,
                    STATUS = 3
                });

                string content = _alertTypeService.HandleTemplate(Constants.AlertType.ID.NotVerifiedGoodReceipt, new DataAlertTypeTemplateViewModel
                {
                    Data1 = fullName,
                    Data2 = goodsReceipt.GRCode
                });

                _alertService.SendToLocal(userCurrent.CompanyID, Constants.AlertType.ID.NotVerifiedGoodReceipt, goodsReceipt.ID, content, fullName, DateTime.Now, HubServerType.App);

                UpdateInventoryRequestUnConfirm(goodsReceipt.ID, userCurrent.CompanyID, userId, userCurrent.FullName);

                if (goodsReceipt.GRType == 2)
                {
                    HandleBatchCompanyForUnConfirm(goodsReceipt.ID);
                }

                //  _goodsProvider.DeleteGR(goodsReceipt);

                _logService.SaveLog("Không duyệt phiếu nhập hàng " + goodsReceipt.GRCode);

                resultJs.status = 200;

                resultJs.message = "Không duyệt phiếu nhập hàng thành công";

            Final:
                return Ok(resultJs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
        #endregion

        #region Private
        private void CreateDetailByMaterial(GoodsReceipt goodsReceipt, GoodsReceiptJs model, List<MUUModel> materialUnits)
        {
            List<Material> materials = _goodsProvider.GetMaterials(model.GRDetails);

            foreach (var item in model.GRDetails)
            {
                Material material = materials.FirstOrDefault(x => x.ID == item.MaterialID);
                material.InStoreTemp = material.InStoreTemp ?? 0;
                MUUModel muIndex = materialUnits.FirstOrDefault(x => x.MaterialID == item.MaterialID && x.UnitID == item.UnitID);
                MUUModel muReportIndex = materialUnits.FirstOrDefault(x => x.MaterialID == item.MaterialID && x.UnitID == material.UnitID && x.IsMain == true);

                GRDetail grDetail = new GRDetail();
                PropertyCopier<GRDetailJs, GRDetail>.Copy(item, grDetail);
                grDetail.ID = _configsService.NewIDoC;
                grDetail.GRID = goodsReceipt.ID;
                grDetail.UnitName = muIndex.UnitName;
                //grDetail.Value = muIndex.Value;
                //grDetail.Quantity1 = grDetail.Quantity * muIndex.Value;
                //grDetail.UnitID1 = muReportIndex.UnitID;
                //grDetail.UnitName1 = muReportIndex.UnitName;
                //(grDetail.VAT, grDetail.Amount) = _goodsProvider.MathAmount(grDetail.Value.Value, grDetail.UnitPrice, grDetail.PerVAT);
                //grDetail.QuantityOut = 0;
                //grDetail.CompanyID = userCurrent.CompanyID;
                _txngContext.Insert<GRDetail>(grDetail);

                // Update tồn kho
                //_goodsProvider.ImportMaterialTmp(material, goodsReceipt.ReceiptPerson, grDetail.Quantity1 ?? 0, grDetail.UnitID, grDetail.RefQRCode);
            }
        }

        private void CreateDetailByProduct(GoodsReceipt goodsReceipt, GoodsReceiptJs model, List<PUUModel> productUnits)
        {
            List<Product> products = _goodsProvider.GetProducts(model.GRDetails, goodsReceipt.CompanyID);

            foreach (var item in model.GRDetails)
            {
                Product product = products.FirstOrDefault(x => x.ID == item.MaterialID);
                product.InStoreTemp = product.InStoreTemp ?? 0;
                PUUModel muIndex = productUnits.FirstOrDefault(x => x.ProductID == item.MaterialID && x.UnitID == item.UnitID);
                PUUModel muReportIndex = productUnits.FirstOrDefault(x => x.ProductID == item.MaterialID && x.UnitID == product.UnitID && x.IsMain == true);

                GRDetail grDetail = new GRDetail();
                PropertyCopier<GRDetailJs, GRDetail>.Copy(item, grDetail);
                grDetail.ID = _configsService.NewIDoC;
                grDetail.GRID = goodsReceipt.ID;
                grDetail.UnitName = muIndex.UnitName;
                //grDetail.Value = muIndex.Value;
                //grDetail.Quantity1 = grDetail.Quantity * muIndex.Value;
                //grDetail.UnitID1 = muReportIndex.UnitID;
                //grDetail.UnitName1 = muReportIndex.UnitName;
                //(grDetail.VAT, grDetail.Amount) = _goodsProvider.MathAmount(grDetail.Value.Value, grDetail.UnitPrice, grDetail.PerVAT);
                //grDetail.QuantityOut = 0;
                //grDetail.CompanyID = userCurrent.CompanyID;
                _txngContext.Insert<GRDetail>(grDetail);

                //_goodsProvider.ImportProductTmp(product, goodsReceipt.ReceiptPerson, grDetail.Quantity1 ?? 0, muIndex.UnitID, grDetail.RefQRCode, userCurrent.CompanyID);
            }
        }

        private void UpdateDetailByMaterial(GoodsReceipt goodsReceipt, GoodsReceiptJs model, List<MUUModel> materialUnits)
        {
            //List<Material> materials = _goodsProvider.GetMaterials(model.GRDetails);

            //string grDetailIDs = "'" + string.Join("','", model.GRDetails.Where(x => !string.IsNullOrWhiteSpace(x.ID))
            //    .Select(x => x.ID).ToArray()) + "'";
            //List<GRDetail> gRDetails = _txngContext.GetAll<GRDetail>("*", "GRDetails", $"GRID = @ID", goodsReceipt).ToList();

            ////It is existed
            //var grDetailIdCurrent = model.GRDetails.Where(x => !string.IsNullOrWhiteSpace(x.ID)).ToList();

            //#region Delete Null

            //var grDetailLost = gRDetails.Where(x => !grDetailIdCurrent.Any(y => y.ID == x.ID)).ToList();
            //string materialIdsLost = "'" + string.Join("','", grDetailLost.Select(x => x.MaterialID).ToArray()) + "'";

            //if (grDetailLost.Count > 0)
            //{
            //    _goodsProvider.Rollback_Import_Lost(goodsReceipt.ID, goodsReceipt.GRType.Value, goodsReceipt.ReceiptPerson, string.Join(',', grDetailLost.Select(x => x.ID)), userCurrent.CompanyID);
            //}
            //#endregion

            //if (grDetailIdCurrent.Count > 0)
            //{
            //    _goodsProvider.Rollback_Import_Lost(goodsReceipt.ID, goodsReceipt.GRType.Value, goodsReceipt.ReceiptPerson, string.Join(',', grDetailIdCurrent.Select(x => x.ID)), userCurrent.CompanyID);
            //}

            //if (_companyParaService.Warehouse == 2 || string.IsNullOrWhiteSpace(goodsReceipt.ReceiptPerson))
            //{
            //    goodsReceipt.ReceiptPerson = userCurrent.Id;
            //}

            //// It is New
            //List<GRDetailJs> ls_Add = new List<GRDetailJs>();
            //ls_Add.AddRange(grDetailIdCurrent);
            //ls_Add.AddRange(model.GRDetails.Where(x => string.IsNullOrWhiteSpace(x.ID)).ToList());
            //foreach (var item in ls_Add)
            //{
            //    Material material = materials.FirstOrDefault(x => x.ID == item.MaterialID);
            //    material.InStoreTemp = material.InStoreTemp ?? 0;
            //    MUUModel muIndex = materialUnits.FirstOrDefault(x => x.MaterialID == item.MaterialID && x.UnitID == item.UnitID);
            //    MUUModel muReportIndex = materialUnits.FirstOrDefault(x => x.MaterialID == item.MaterialID && x.UnitID == material.UnitID && x.IsMain == true);

            //    GRDetail grDetail = new GRDetail();
            //    PropertyCopier<GRDetailJs, GRDetail>.Copy(item, grDetail);
            //    grDetail.ID = _configsService.NewIDoC;
            //    grDetail.GRID = goodsReceipt.ID;
            //    grDetail.UnitName = muIndex.UnitName;
            //    grDetail.Value = muIndex.Value;
            //    grDetail.Quantity1 = grDetail.Quantity * muIndex.Value;
            //    grDetail.UnitID1 = muReportIndex.UnitID;
            //    grDetail.UnitName1 = muReportIndex.UnitName;
            //    (grDetail.VAT, grDetail.Amount) = _goodsProvider.MathAmount(grDetail.Value.Value, grDetail.UnitPrice, grDetail.PerVAT);
            //    grDetail.QuantityOut = 0;
            //    grDetail.CompanyID = userCurrent.CompanyID;
            //    _txngContext.Insert<GRDetail>(grDetail);

            //    // Update tồn kho
            //    _goodsProvider.ImportMaterialTmp(material, goodsReceipt.ReceiptPerson, grDetail.Quantity1 ?? 0, grDetail.UnitID, grDetail.RefQRCode);
            //}
        }

        private void UpdateDetailByProduct(GoodsReceipt goodsReceipt, GoodsReceiptJs model, List<PUUModel> productUnits)
        {

            //List<Product> products = _goodsProvider.GetProducts(model.GRDetails, goodsReceipt.CompanyID);

            //string grDetailIDs = "'" + string.Join("','", model.GRDetails.Where(x => !string.IsNullOrWhiteSpace(x.ID))
            //    .Select(x => x.ID).ToArray()) + "'";
            //List<GRDetail> gRDetails = _txngContext.GetAll<GRDetail>("*", "GRDetails", $"GRID = @ID", goodsReceipt).ToList();

            ////It is existed
            //var grDetailIdCurrent = model.GRDetails.Where(x => !string.IsNullOrWhiteSpace(x.ID)).ToList();

            //#region Delete Null

            //var grDetailLost = gRDetails.Where(x => !grDetailIdCurrent.Any(y => y.ID == x.ID)).ToList();
            //string productIdsLost = "'" + string.Join("','", grDetailLost.Select(x => x.MaterialID).ToArray()) + "'";
            //// List<Product> productLosts = _txngContext.GetAll<Product>($@"ID in ({productIdsLost})").ToList();
            //if (grDetailLost.Count > 0)
            //{
            //    _goodsProvider.Rollback_Import_Lost(goodsReceipt.ID, goodsReceipt.GRType.Value, goodsReceipt.ReceiptPerson, string.Join(',', grDetailLost.Select(x => x.ID)), userCurrent.CompanyID);
            //}
            //#endregion

            //if (grDetailIdCurrent.Count > 0)
            //{
            //    _goodsProvider.Rollback_Import_Lost(goodsReceipt.ID, goodsReceipt.GRType.Value, goodsReceipt.ReceiptPerson, string.Join(',', grDetailIdCurrent.Select(x => x.ID)), userCurrent.CompanyID);
            //}

            //if (_companyParaService.Warehouse == 2 || string.IsNullOrWhiteSpace(goodsReceipt.ReceiptPerson))
            //{
            //    goodsReceipt.ReceiptPerson = userCurrent.Id;
            //}

            //// It is New
            //List<GRDetailJs> ls_Add = new List<GRDetailJs>();
            //ls_Add.AddRange(grDetailIdCurrent);
            //ls_Add.AddRange(model.GRDetails.Where(x => string.IsNullOrWhiteSpace(x.ID)).ToList());
            //foreach (var item in ls_Add)
            //{
            //    Product product = products.FirstOrDefault(x => x.ID == item.MaterialID);
            //    product.InStoreTemp = product.InStoreTemp ?? 0;
            //    PUUModel muIndex = productUnits.FirstOrDefault(x => x.ProductID == item.MaterialID && x.UnitID == item.UnitID);
            //    PUUModel muReportIndex = productUnits.FirstOrDefault(x => x.ProductID == item.MaterialID && x.UnitID == product.UnitID && x.IsMain == true);

            //    GRDetail grDetail = new GRDetail();
            //    PropertyCopier<GRDetailJs, GRDetail>.Copy(item, grDetail);
            //    grDetail.ID = _configsService.NewIDoC;
            //    grDetail.GRID = goodsReceipt.ID;
            //    grDetail.UnitName = muIndex.UnitName;
            //    grDetail.Value = muIndex.Value;
            //    grDetail.Quantity1 = grDetail.Quantity * muIndex.Value;
            //    grDetail.UnitID1 = muReportIndex.UnitID;
            //    grDetail.UnitName1 = muReportIndex.UnitName;
            //    (grDetail.VAT, grDetail.Amount) = _goodsProvider.MathAmount(grDetail.Value.Value, grDetail.UnitPrice, grDetail.PerVAT);
            //    grDetail.QuantityOut = 0;
            //    _txngContext.Insert<GRDetail>(grDetail);

            //    _goodsProvider.ImportProductTmp(product, goodsReceipt.ReceiptPerson, grDetail.Quantity1 ?? 0, m
            //    uIndex.UnitID, grDetail.RefQRCode, userCurrent.CompanyID);
            //}
        }

        private void UpdateInventoryDelete(string grId, string companyId, string userId, string fullName)
        {
            List<GRDetail> grDetails = _txngContext.Query<GRDetail>(" SELECT * FROM GRDetails WHERE GRID = @GRID ", new
            {
                GRID = grId
            }).ToList();

            List<InventoryModel> inventoryModels = _txngContext.Query<InventoryModel>(" SELECT * FROM Inventory WHERE CompanyID = @COMPANYID AND MaterialID IN (SELECT VALUE FROM dbo.splitstring(@MATERIALIDS)) AND WarehouseID IN (SELECT VALUE FROM dbo.splitstring(@WAREHOUSEIDS)) ", new
            {
                COMPANYID = companyId,
                MATERIALIDS = string.Join(",", grDetails.Select(p => p.MaterialID)),
                WAREHOUSEIDS = string.Join(",", grDetails.Select(p => p.WarehouseID)),
            }).ToList();

            InventoryModel inventoryModel = null;

            List<string> inventoryUpdates = new List<string>();

            for (int i = 0; i < grDetails.Count; i++)
            {
                inventoryModel = inventoryModels.FirstOrDefault(p => p.CompanyID == userCurrent.CompanyID && p.WarehouseID == grDetails[i].WarehouseID && p.MaterialID == grDetails[i].MaterialID);

                if (inventoryModel != null)
                {
                    inventoryUpdates.Add(string.Format(" UPDATE Inventory SET QuantityTemp = {0}, TrackedDate = GETDATE(), TrackedBy = N'{1}', TrackedName = N'{2}' WHERE ID = '{3}' ", inventoryModel.QuantityTemp - (grDetails[i].ReportQuantity ?? 0), userId, fullName, inventoryModel.ID));
                }
            }

            if (inventoryUpdates.Count > 0)
            {
                _txngContext.Execute(string.Join(" ; ", inventoryUpdates));
            }
        }

        private void UpdateInventoryRequestConfirm(string grId, string companyId, string userId, string fullName)
        {
            List<GRDetail> grDetails = _txngContext.Query<GRDetail>(" SELECT * FROM GRDetails WHERE GRID = @GRID ", new
            {
                GRID = grId
            }).ToList();

            List<InventoryModel> inventoryModels = _txngContext.Query<InventoryModel>(" SELECT * FROM Inventory WHERE CompanyID = @COMPANYID AND MaterialID IN (SELECT VALUE FROM dbo.splitstring(@MATERIALID)) AND WarehouseID IN (SELECT VALUE FROM dbo.splitstring(@WAREHOUSEID)) ", new
            {
                COMPANYID = userCurrent.CompanyID,
                MATERIALID = string.Join(",", grDetails.Select(p => p.MaterialID)),
                WAREHOUSEID = string.Join(",", grDetails.Select(p => p.WarehouseID)),
            }).ToList();

            List<string> inventoryUpdates = new List<string>();

            InventoryModel inventoryModel = null;

            for (int i = 0; i < grDetails.Count; i++)
            {
                inventoryModel = inventoryModels.FirstOrDefault(p => p.CompanyID == userCurrent.CompanyID && p.WarehouseID == grDetails[i].WarehouseID && p.MaterialID == grDetails[i].MaterialID);

                if (inventoryModel != null)
                {
                    inventoryUpdates.Add(string.Format(" UPDATE Inventory SET Quantity = {0}, TrackedDate = GETDATE(), TrackedBy = N'{1}', TrackedName = N'{2}' WHERE ID = '{3}' ", inventoryModel.Quantity + (grDetails[i].ReportQuantity ?? 0), userId, fullName, inventoryModel.ID));
                }
            }

            if (inventoryUpdates.Count > 0)
            {
                _txngContext.Execute(string.Join(" ; ", inventoryUpdates));
            }
        }

        private void HandleBatchCompanyForUnConfirm(string grId)
        {
            List<GRDetail> grDetailOlds = _txngContext.Query<GRDetail>(" SELECT * FROM GRDetails WHERE GRID = @GRID ", new
            {
                GRID = grId
            }).ToList();

            List<GIDetail> giDetails = _txngContext.Query<GIDetail>(" SELECT * FROM GIDetails WHERE BatchID IN (SELECT [VALUE] FROM dbo.FUNCTIONSPLIT(@BATCHIDS, ',')) AND GIID IN (SELECT [VALUE] FROM dbo.FUNCTIONSPLIT(@GIIDS, ',')) ", new
            {
                BATCHIDS = string.Join(",", grDetailOlds.Where(p => !string.IsNullOrEmpty(p.BatchID)).Select(p => p.BatchID)),
                GIIDS = string.Join(",", grDetailOlds.Where(p => !string.IsNullOrEmpty(p.GIID)).Select(p => p.GIID))
            }).ToList();

            GIDetail giDetail = null;
            List<string> updateGIDetails = new List<string>();

            for (int i = 0; i < grDetailOlds.Count; i++)
            {
                giDetail = giDetails.FirstOrDefault(p => p.BatchID == grDetailOlds[i].BatchID && p.GIID == grDetailOlds[i].GIID);

                if (giDetail != null)
                {
                    updateGIDetails.Add(string.Format(" UPDATE GIDetails SET QuantityRemain = QuantityRemain + {0},  ReportQuantityRemain = ReportQuantityRemain + {1} WHERE BatchID = N'{2}' AND GIID = N'{3}' ", grDetailOlds[i].Quantity, grDetailOlds[i].ReportQuantity, grDetailOlds[i].BatchID, grDetailOlds[i].GIID));
                }
            }

            if (updateGIDetails.Count > 0)
            {
                _txngContext.Execute(string.Join(";", updateGIDetails));
            }
        }

        private void UpdateInventoryRequestUnConfirm(string grId, string companyId, string userId, string fullName)
        {
            List<GRDetail> gRDetailOlds = _txngContext.Query<GRDetail>(" SELECT * FROM GRDetails WHERE GRID = @GRID ", new
            {
                GRID = grId
            }).ToList();

            decimal? quantity = gRDetailOlds.Sum(p => p.ReportQuantity);

            List<InventoryModel> inventoryModels = _txngContext.Query<InventoryModel>(" SELECT * FROM Inventory WHERE CompanyID = @COMPANYID AND MaterialID IN (SELECT VALUE FROM dbo.splitstring(@MATERIALID)) AND WarehouseID IN (SELECT VALUE FROM dbo.splitstring(@WAREHOUSEID)) ", new
            {
                COMPANYID = companyId,
                MATERIALID = string.Join(",", gRDetailOlds.Select(p => p.MaterialID)),
                WAREHOUSEID = string.Join(",", gRDetailOlds.Select(p => p.WarehouseID)),
            }).ToList();

            GRDetail grDetail = null;

            List<string> inventoryUpdates = new List<string>();

            for (int i = 0; i < inventoryModels.Count; i++)
            {
                grDetail = gRDetailOlds.FirstOrDefault(p => p.WarehouseID == inventoryModels[i].WarehouseID && p.MaterialID == inventoryModels[i].MaterialID);

                if (grDetail != null)
                {
                    inventoryUpdates.Add(string.Format(" UPDATE Inventory SET QuantityTemp = {0}, TrackedDate = GETDATE(), TrackedBy = N'{1}', TrackedName = N'{2}' WHERE ID = '{3}' ", inventoryModels[i].QuantityTemp - (grDetail.ReportQuantity ?? 0), userId, fullName, inventoryModels[i].ID));
                }
            }

            if (inventoryUpdates.Count > 0)
            {
                _txngContext.Execute(string.Join(" ; ", inventoryUpdates));
            }
        }

        private int HandleInventoryProduct(string grId, byte? grType, string companyId, string userId, string fullName, List<GRDetailJs> grDetailJs, bool isInsert)
        {
            List<GRDetail> gRDetailOlds = _txngContext.Query<GRDetail>(" SELECT * FROM GRDetails WHERE GRID = @GRID ", new {
                GRID = grId
            }).ToList();

            List<InventoryModel> inventoryModels = _txngContext.Query<InventoryModel>(" SELECT * FROM Inventory WHERE CompanyID = @COMPANYID AND MaterialID IN (SELECT VALUE FROM dbo.splitstring(@MATERIALIDS)) AND WarehouseID IN (SELECT VALUE FROM dbo.splitstring(@WAREHOUSEIDS)) ", new
            {
                COMPANYID = companyId,
                MATERIALIDS = string.Join(",", grDetailJs.Select(p => p.MaterialID)),
                WAREHOUSEIDS = string.Join(",", grDetailJs.Select(p => p.WarehouseID)),
            }).ToList();

            List<ProductMaterialUnitViewModel> productMaterialUnitViewModels = _productMaterialUnitService.GetListProductMaterialUnit(grDetailJs.Select(p => p.MaterialID).ToList(), companyId);

            List<Product> products = _txngContext.Query<Product>(" SELECT ID, ProductName, IsBoth FROM Products WHERE ID IN (SELECT VALUE FROM dbo.splitstring(@PRODUCTIDS)) UNION ALL SELECT ID, MaterialName AS ProductName, 0 AS IsBoth FROM Materials WHERE ID IN (SELECT VALUE FROM dbo.splitstring(@PRODUCTIDS)) ", new
            {
                PRODUCTIDS = string.Join(",", grDetailJs.Select(p => p.MaterialID))
            }).ToList();

            List<ProductMaterialUnitViewModel> productUnits = null;
            decimal? quantityTemp = 0;
            ProductMaterialUnitViewModel productUnitReport = null;
            GRDetail productUnitOld = null;
            ProductMaterialUnitViewModel productsUnitCurrent = null;
            Product product = null;

            List<InventoryModel> inventoryModelInserts = new List<InventoryModel>();
            List<GRDetail> grDetails = new List<GRDetail>();

            InventoryModel checkInventory = null;

            bool? isProduct = false;

            if (grType == 0)
            {
                isProduct = true;
            }

            string reportUnitId = "";
            string materialNameReport = "";

            List<string> inventoryUpdates = new List<string>();

            for (int i = 0; i < grDetailJs.Count; i++)
            {
                quantityTemp = 0;

                productUnits = productMaterialUnitViewModels.Where(p => p.ProductID == grDetailJs[i].MaterialID).ToList();

                productsUnitCurrent = productUnits.FirstOrDefault(p => p.UnitID == grDetailJs[i].UnitID);

                if (productUnits.Count == 1)
                {
                    productUnitReport = productUnits[0];
                }
                else if (productUnits.Count > 1)
                {
                    productUnitReport = productUnits.FirstOrDefault(p => p.IsReport == true);

                    if (productUnitReport == null)
                    {
                        productUnitReport = productUnits.FirstOrDefault(p => p.IsDefault == true);
                    }
                }

                if (productUnitReport == null)
                {
                    return -1;
                }

                product = products.FirstOrDefault(p => p.ID == grDetailJs[i].MaterialID);

                if (product == null)
                {
                    return -2;
                }

                if (product != null)
                {
                    materialNameReport = product.ProductName;
                }

                if (productUnitReport != null)
                {
                    reportUnitId = productUnitReport.UnitID;
                }

                if (productUnitReport != null && productsUnitCurrent != null)
                {
                    if (productUnitReport.UnitID != productsUnitCurrent.UnitID)
                    {
                        quantityTemp = (grDetailJs[i].Quantity / productsUnitCurrent.Value) * productUnitReport.Value;
                    }
                    else
                    {
                        quantityTemp = grDetailJs[i].Quantity;
                    }
                }

                checkInventory = inventoryModels.FirstOrDefault(p => p.CompanyID == companyId && p.WarehouseID == grDetailJs[i].WarehouseID && p.MaterialID == grDetailJs[i].MaterialID);

                if (checkInventory != null)
                {
                    productUnitOld = gRDetailOlds.FirstOrDefault(p => p.MaterialID == grDetailJs[i].MaterialID && p.WarehouseID == grDetailJs[i].WarehouseID);

                    decimal? quantityTempInventory = 0;

                    if (productUnitOld != null)
                    {
                        if (isInsert)
                        {
                            quantityTempInventory = checkInventory.QuantityTemp + productUnitOld.ReportQuantity;
                        }
                        else
                        {
                            quantityTempInventory = checkInventory.QuantityTemp - productUnitOld.ReportQuantity + quantityTemp;
                        }
                    }
                    else
                    {
                        quantityTempInventory = checkInventory.QuantityTemp + quantityTemp;
                    }

                    inventoryUpdates.Add(string.Format(" UPDATE Inventory SET QuantityTemp = {0}, TrackedDate = GETDATE(), TrackedBy = 'N{1}', TrackedName = N'{2}', IsProduct = {3}, UnitName = N'{4}', MaterialName = N'{5}' WHERE ID = '{6}' ", quantityTempInventory, userId, fullName, isProduct == true ? 1 : 0, productUnitReport.UnitName, materialNameReport, checkInventory.ID));
                }
                else
                {
                    inventoryModelInserts.Add(new InventoryModel
                    {
                        ID = _configsService.NewID,
                        CompanyID = companyId,
                        MaterialID = grDetailJs[i].MaterialID,
                        WarehouseID = grDetailJs[i].WarehouseID,
                        UnitID = reportUnitId,
                        Quantity = 0,
                        TrackedDate = DateTime.Now,
                        TrackedBy = userId,
                        TrackedName = fullName,
                        QuantityTemp = quantityTemp ?? 0,
                        IsProduct = isProduct,
                        UnitName = productUnitReport.UnitName,
                        MaterialName = materialNameReport,
                        IsBoth = product == null ? false : product.IsBoth
                    });
                }

                grDetails.Add(new GRDetail
                {
                    ID = _configsService.NewID,
                    GRID = grId,
                    MaterialID = grDetailJs[i].MaterialID,
                    WarehouseID = grDetailJs[i].WarehouseID,
                    UnitID = grDetailJs[i].UnitID,
                    UnitName = grDetailJs[i].UnitName,
                    Quantity = grDetailJs[i].Quantity,
                    UnitPrice = grDetailJs[i].UnitPrice,
                    PerVAT = grDetailJs[i].PerVAT,
                    VAT = (grDetailJs[i].PerVAT * Convert.ToInt32(grDetailJs[i].UnitPrice * grDetailJs[i].Quantity)) / 100,
                    Amount = (Convert.ToInt32(((grDetailJs[i].PerVAT * Convert.ToInt32((grDetailJs[i].UnitPrice * grDetailJs[i].Quantity))) / 100))) + Convert.ToInt32((grDetailJs[i].UnitPrice * grDetailJs[i].Quantity)),
                    MaterialName = grDetailJs[i].MaterialName,
                    ReportUnitID = productUnitReport != null ? productUnitReport.UnitID : "",
                    ReportQuantity = quantityTemp ?? 0,
                    IsBoth = product == null ? false : product.IsBoth,
                    BatchID = grDetailJs[i].BatchID,
                    GIID = grDetailJs[i].GIID
                });
            }

            _txngContext.Execute(" DELETE GRDetails WHERE GRID = @GRID ", new
            {
                GRID = grId
            });

            if (inventoryUpdates.Count > 0)
            {
                _txngContext.Execute(string.Join(" ; ", inventoryUpdates));
            }

            if (inventoryModelInserts.Count > 0)
            {
                _txngContext.InsertMany<InventoryModel>(inventoryModelInserts);
            }

            if (grDetails.Count > 0)
            {
                _txngContext.InsertMany<GRDetail>(grDetails);
            }

            return 0;
        }

        private int HandleInventoryMaterial(string grId, byte? grType, string companyId, string userId, string fullName, List<GRDetailJs> grDetailJs, bool isInsert)
        {
            List<GRDetail> gRDetailOlds = _txngContext.Query<GRDetail>(" SELECT * FROM GRDetails WHERE GRID = @GRID ", new
            {
                GRID = grId
            }).ToList();

            List<InventoryModel> inventoryModels = _txngContext.Query<InventoryModel>(" SELECT * FROM Inventory WHERE CompanyID = @COMPANYID AND MaterialID IN (SELECT VALUE FROM dbo.splitstring(@MATERIALID)) AND WarehouseID IN (SELECT VALUE FROM dbo.splitstring(@WAREHOUSEID)) ", new
            {
                COMPANYID = companyId,
                MATERIALID = string.Join(",", grDetailJs.Select(p => p.MaterialID)),
                WAREHOUSEID = string.Join(",", grDetailJs.Select(p => p.WarehouseID)),
            }).ToList();

            List<ProductMaterialUnitViewModel> productMaterialUnitViewModels = _productMaterialUnitService.GetListProductMaterialUnit(grDetailJs.Select(p => p.MaterialID).ToList(), companyId);

            List<Product> products = _txngContext.Query<Product>(" SELECT ID, ProductName, IsBoth FROM Products WHERE ID IN (SELECT VALUE FROM dbo.splitstring(@PRODUCTIDS)) UNION ALL SELECT ID, MaterialName AS ProductName, 0 AS IsBoth FROM Materials WHERE ID IN (SELECT VALUE FROM dbo.splitstring(@PRODUCTIDS)) ", new
            {
                PRODUCTIDS = string.Join(",", grDetailJs.Select(p => p.MaterialID))
            }).ToList();

            List<ProductMaterialUnitViewModel> productUnits = null;
            decimal? quantityTemp = 0;
            ProductMaterialUnitViewModel productUnitReport = null;
            GRDetail productUnitOld = null;
            ProductMaterialUnitViewModel productsUnitCurrent = null;
            Product product = null;

            List<InventoryModel> inventoryModelInserts = new List<InventoryModel>();
            List<GRDetail> grDetails = new List<GRDetail>();

            InventoryModel checkInventory = null;

            bool? isProduct = false;

            if (grType == 0)
            {
                isProduct = true;
            }

            string reportUnitId = "";
            string materialNameReport = "";

            List<string> inventoryUpdates = new List<string>();

            for (int i = 0; i < grDetailJs.Count; i++)
            {
                quantityTemp = 0;

                productUnits = productMaterialUnitViewModels.Where(p => p.ProductID == grDetailJs[i].MaterialID).ToList();

                productsUnitCurrent = productUnits.FirstOrDefault(p => p.UnitID == grDetailJs[i].UnitID);

                if (productUnits.Count == 1)
                {
                    productUnitReport = productUnits[0];
                }
                else if (productUnits.Count > 1)
                {
                    productUnitReport = productUnits.FirstOrDefault(p => p.IsReport == true);

                    if (productUnitReport == null)
                    {
                        productUnitReport = productUnits.FirstOrDefault(p => p.IsDefault == true);
                    }
                }

                if (productUnitReport == null)
                {
                    return -1;
                }

                product = products.FirstOrDefault(p => p.ID == grDetailJs[i].MaterialID);

                if (product == null)
                {
                    return -2;
                }

                if (product != null)
                {
                    materialNameReport = product.ProductName;
                }

                if (productUnitReport != null)
                {
                    reportUnitId = productUnitReport.UnitID;
                }

                if (productUnitReport != null && productsUnitCurrent != null)
                {
                    if (productUnitReport.UnitID != productsUnitCurrent.UnitID)
                    {
                        quantityTemp = (grDetailJs[i].Quantity / productsUnitCurrent.Value) * productUnitReport.Value;
                    }
                    else
                    {
                        quantityTemp = grDetailJs[i].Quantity;
                    }
                }

                checkInventory = inventoryModels.FirstOrDefault(p => p.CompanyID == companyId && p.WarehouseID == grDetailJs[i].WarehouseID && p.MaterialID == grDetailJs[i].MaterialID);

                if (checkInventory != null)
                {
                    productUnitOld = gRDetailOlds.FirstOrDefault(p => p.MaterialID == grDetailJs[i].MaterialID && p.WarehouseID == grDetailJs[i].WarehouseID);

                    decimal? quantityTempInventory = 0;

                    if (productUnitOld != null)
                    {
                        if (isInsert)
                        {
                            quantityTempInventory = checkInventory.QuantityTemp + productUnitOld.ReportQuantity;
                        }
                        else
                        {
                            quantityTempInventory = checkInventory.QuantityTemp - productUnitOld.ReportQuantity + quantityTemp;
                        }
                    }
                    else
                    {
                        quantityTempInventory = checkInventory.QuantityTemp + quantityTemp;
                    }

                    inventoryUpdates.Add(string.Format(" UPDATE Inventory SET QuantityTemp = {0}, TrackedDate = GETDATE(), TrackedBy = 'N{1}', TrackedName = N'{2}', IsProduct = {3}, UnitName = N'{4}', MaterialName = N'{5}' WHERE ID = '{6}' ", quantityTempInventory, userId, fullName, isProduct == true ? 1 : 0, productUnitReport.UnitName, materialNameReport, checkInventory.ID));
                }
                else
                {
                    inventoryModelInserts.Add(new InventoryModel
                    {
                        ID = _configsService.NewID,
                        CompanyID = companyId,
                        MaterialID = grDetailJs[i].MaterialID,
                        WarehouseID = grDetailJs[i].WarehouseID,
                        UnitID = reportUnitId,
                        Quantity = 0,
                        TrackedDate = DateTime.Now,
                        TrackedBy = userId,
                        TrackedName = fullName,
                        QuantityTemp = quantityTemp ?? 0,
                        IsProduct = isProduct,
                        MaterialName = materialNameReport,
                        UnitName = productUnitReport.UnitName,
                        IsBoth = product == null ? false : product.IsBoth
                    });
                }

                grDetails.Add(new GRDetail
                {
                    ID = _configsService.NewID,
                    GRID = grId,
                    MaterialID = grDetailJs[i].MaterialID,
                    WarehouseID = grDetailJs[i].WarehouseID,
                    UnitID = grDetailJs[i].UnitID,
                    UnitName = grDetailJs[i].UnitName,
                    Quantity = grDetailJs[i].Quantity,
                    UnitPrice = grDetailJs[i].UnitPrice,
                    PerVAT = grDetailJs[i].PerVAT,
                    VAT = (grDetailJs[i].PerVAT * Convert.ToInt32(grDetailJs[i].UnitPrice * grDetailJs[i].Quantity)) / 100,
                    Amount = (Convert.ToInt32(((grDetailJs[i].PerVAT * Convert.ToInt32((grDetailJs[i].UnitPrice * grDetailJs[i].Quantity))) / 100))) + Convert.ToInt32((grDetailJs[i].UnitPrice * grDetailJs[i].Quantity)),
                    MaterialName = grDetailJs[i].MaterialName,
                    ReportUnitID = productUnitReport != null ? productUnitReport.UnitID : "",
                    ReportQuantity = quantityTemp ?? 0,
                    IsBoth = product == null ? false : product.IsBoth
                });
            }

            _txngContext.Execute(" DELETE GRDetails WHERE GRID = @GRID ", new
            {
                GRID = grId
            });

            if (inventoryUpdates.Count > 0)
            {
                _txngContext.Execute(string.Join(" ; ", inventoryUpdates));
            }

            if (inventoryModelInserts.Count > 0)
            {
                _txngContext.InsertMany<InventoryModel>(inventoryModelInserts);
            }

            if (grDetails.Count > 0)
            {
                _txngContext.InsertMany<GRDetail>(grDetails);
            }

            return 0;
        }

        private void HandleGRQuantity(string grId, string companyId, string batchId)
        {
            List<GRDetail> grDetailOlds = _txngContext.Query<GRDetail>(" SELECT * FROM GRDetails WHERE GRID = @GRID ", new
            {
                GRID = grId
            }).ToList();

            //List<ProductsUnit> productMaterialUnits = _txngContext.Query<ProductsUnit>(" SELECT UnitID, ID AS ProductID, 1 AS [Value], 0 AS IsReport FROM Products WHERE ID IN (SELECT VALUE FROM dbo.splitstring(@PRODUCTIDS)) UNION ALL SELECT PU.UnitID, PU.ProductID, PU.[Value], PU.IsReport FROM ProductsUnits AS PU WHERE PU.ProductID IN (SELECT VALUE FROM dbo.splitstring(@PRODUCTIDS)) AND PU.CompanyID = @COMPANYID UNION ALL SELECT UnitID, ID AS ProductID, 1 AS [Value], 0 AS IsReport FROM Materials WHERE ID IN (SELECT VALUE FROM dbo.splitstring(@PRODUCTIDS)) UNION ALL SELECT UnitID, MaterialID AS ProductID, [Value], IsReport FROM MaterialsUnits WHERE MaterialID IN(SELECT VALUE FROM dbo.splitstring(@PRODUCTIDS)) ", new
            //{
            //    PRODUCTIDS = string.Join(",", grDetailOlds.Select(p => p.MaterialID)),
            //    COMPANYID = companyId
            //}).ToList();

            List<ProductMaterialUnitViewModel> productMaterialUnitViewModels = _productMaterialUnitService.GetListProductMaterialUnit(grDetailOlds.Select(p => p.MaterialID).ToList(), companyId);

            List<ProductMaterialUnitViewModel> productUnits = new List<ProductMaterialUnitViewModel>();
            ProductMaterialUnitViewModel productUnitReport = null;

            List<Model.GRQuantity.GRQuantityModel> grQuantities = new List<Model.GRQuantity.GRQuantityModel>();

            string batchNum = _txngContext.Query<string>(" SELECT BatchNum FROM Batches WHERE ID = @ID ", new
            {
                ID = batchId
            }).FirstOrDefault();

            for (int i = 0; i < grDetailOlds.Count; i++)
            {
                productUnits = productMaterialUnitViewModels.Where(p => p.ProductID == grDetailOlds[i].MaterialID).ToList();

                if (productUnits.Count == 1)
                {
                    productUnitReport = productUnits[0];
                }
                else if(productUnits.Count > 1)
                {
                    productUnitReport = productUnits.FirstOrDefault(p => p.IsReport == true);

                    if (productUnitReport == null)
                    {
                        productUnitReport = productUnits.FirstOrDefault(p => p.IsDefault == true);
                    }
                }

                grQuantities.Add(new Model.GRQuantity.GRQuantityModel
                {
                    ID = _configsService.NewID,
                    GRID = grId,
                    CompanyID = companyId,
                    MaterialID = grDetailOlds[i].MaterialID,
                    UnitID = productUnitReport != null ? productUnitReport.UnitID : "",
                    Quantity = grDetailOlds[i].ReportQuantity ?? 0,
                    CreatedDate = DateTime.Now,
                    WarehouseID = grDetailOlds[i].WarehouseID,
                    BatchID = batchId,
                    ProductName = grDetailOlds[i].MaterialName,
                    UnitName = productUnitReport != null ? productUnitReport.UnitName : "",
                    BatchNum = batchNum
                });
            }

            if (grQuantities.Count > 0)
            {
                _txngContext.InsertMany<Model.GRQuantity.GRQuantityModel>(grQuantities);
            }
        }
        #endregion
    }
}