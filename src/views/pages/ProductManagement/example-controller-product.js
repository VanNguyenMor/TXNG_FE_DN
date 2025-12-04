using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TXNG.Consts;
using TXNG.Core.Authorize;
using TXNG.Core.Filters;
using TXNG.Core.Helpers;
using TXNG.Core.Providers;
using TXNG.Core.Services;
using TXNG.Core.Services.AlertRole;
using TXNG.Core.Services.Companies;
using TXNG.Core.Utilities.Interfaces;
using TXNG.Model;
using TXNG.Model.Categories;
using TXNG.Model.companies;
using TXNG.Model.Companies;
using TXNG.Model.Config;
using TXNG.Model.DBCenter.QRCodes;
using TXNG.Model.GRQuantity;
using TXNG.Model.js;
using TXNG.Model.js.Companies;
using TXNG.Model.js.Posts;
using TXNG.Model.js.Search;
using TXNG.Model.Papers;
using TXNG.Model.ProductField;
using TXNG.Model.Products;
using TXNG.Model.Stamps;
using TXNG.Model.Traces;
using TXNG.Model.Users;
using TXNG.Model.ViewModels.Companies;
using TXNG.Model.ViewModels.DataAlertTypeTemplate;
using static TXNG.Consts.Constants;
using System.IO;
using Path = System.IO.Path;
using TXNG.Core.Services.NationalPortal;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;

namespace TXNG.Website.Controllers.Companies
{
    [AuthorizeJWT(policy: PolicyConsts.COMPANY_POLICY)]
    public class ProductController : CMSController
    {
        #region Contructor
        private readonly IConfigsService _configsService;

        private readonly ITxngContext _txngContext;
        private readonly IProductService _productService;
        private readonly ILogService _logService;
        private readonly ICacheService _cacheService;
        private readonly IUserService _userService;
        private readonly ICompanyService _companyService;
        private readonly IAlertService _alertService;

        private readonly IQRCodeProvider _qRCodeProvider;
        private readonly IGoodsProvider _goodsProvider;
        private readonly IFileProvider _fileProvider;
        //private readonly ILacoClientProvider _lacoClientProvider;

        private readonly IAlertTypeService _alertTypeService;

        private readonly User userCurrent;

        private readonly ILacoClientProvider _lacoClientProvider;
        private readonly INationalPortalProductService _nationalPortalProductService;

        public ProductController(
            IConfigsService configsService,
            ITxngContext txngContext,
            IProductService productService,
            ILogService logService,
            ICacheService cacheService,
            IUserService userService,
            ICompanyService companyService,
            IAlertService alertService,
            IFileProvider fileProvider,
            IQRCodeProvider qRCodeProvider,
            IGoodsProvider goodsProvider,
            IAlertTypeService alertTypeService,
            ILacoClientProvider lacoClientProvider,
            INationalPortalProductService nationalPortalProductService)
        {
            _configsService = configsService;
            _txngContext = txngContext;
            _productService = productService;
            _logService = logService;
            _cacheService = cacheService;
            _userService = userService;
            _companyService = companyService;
            _alertService = alertService;
            _goodsProvider = goodsProvider;
            _fileProvider = fileProvider;
            _qRCodeProvider = qRCodeProvider;
            _alertTypeService = alertTypeService;
            _lacoClientProvider = lacoClientProvider;
            _nationalPortalProductService = nationalPortalProductService;

            userCurrent = _userService.GetUserCurrent();
        }
        #endregion

        [HttpGet("GetListWithMaterialInventoryByWarehouseComboBox")]
        [AllowAnonymous]
        public IActionResult GetListWithMaterialInventoryByWarehouseComboBox(string warehouseId)
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                string companyId = userCurrent.CompanyID;

                List<GRQuantityModel> grQuantityModels = _txngContext.Query<GRQuantityModel>(" SELECT DISTINCT ((CASE WHEN EXISTS (SELECT ID FROM Products AS P WHERE P.ID = GR.MaterialID) THEN N'SP' ELSE N'NVL' END) + ': ' + GR.ProductName + ' | ' + CAST(SUM(GR.Quantity) AS VARCHAR(255)) + ' ' + GR.UnitName) AS ProductName, GR.MaterialID, GR.UnitID, GR.Quantity, GR.UnitName FROM GRQuantity GR INNER JOIN GoodReceipts G ON G.ID = GR.GRID INNER JOIN Warehouses W ON W.ID = GR.WarehouseID WHERE GR.Quantity > 0 AND G.[Status] = 2 AND G.CompanyID = @COMPANYID AND GR.WarehouseID = @WAREHOUSEID AND W.ID = @WAREHOUSEID GROUP BY GR.ProductName, GR.UnitName, GR.MaterialID, GR.UnitID, GR.Quantity, GR.UnitName ", new
                {
                    COMPANYID = companyId,
                    WAREHOUSEID = warehouseId
                }).ToList();

                resultJs.data = new
                {
                    inventorys = grQuantityModels
                };

                resultJs.message = "Success";

                resultJs.status = 200;

                return Ok(resultJs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("GetListWithMaterialComboBox")]
        [AllowAnonymous]
        public IActionResult GetListWithMaterialComboBox()
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                string companyId = userCurrent.CompanyID;

                List<Product> products = _txngContext.Query<Product>(" SELECT DISTINCT P.ID, P.ProductName, (SELECT U.UnitName FROM Units AS U WHERE U.ID = ISNULL((SELECT TOP 1 PU.UnitID FROM ProductsUnits AS PU WHERE PU.ProductID = P.ID AND PU.IsReport = 1 AND PU.CompanyID = @COMPANYID), P.UnitID)) AS UnitName, (SELECT U.ID FROM Units AS U WHERE U.ID = ISNULL((SELECT TOP 1 PU.UnitID FROM ProductsUnits AS PU WHERE PU.ProductID = P.ID AND PU.IsReport = 1 AND PU.CompanyID = @COMPANYID), P.UnitID)) AS UnitID FROM Products AS P LEFT JOIN ProductCompany AS PC ON PC.ProductID = P.ID WHERE ISNULL(P.IsDisabled, 0) = 0 AND ISNULL(P.IsLocked, 0) = 1 AND PC.CompanyID = @COMPANYID UNION ALL SELECT DISTINCT M.ID, M.MaterialName AS ProductName, (SELECT U.UnitName FROM Units AS U WHERE U.ID = ISNULL((SELECT TOP 1 MU.UnitID FROM MaterialsUnits AS MU WHERE MU.MaterialID = M.ID AND MU.IsReport = 1 AND M.CompanyID = @COMPANYID), M.UnitID)) AS UnitName, (SELECT U.ID FROM Units AS U WHERE U.ID = ISNULL((SELECT TOP 1 MU.UnitID FROM MaterialsUnits AS MU WHERE MU.MaterialID = M.ID AND MU.IsReport = 1 AND M.CompanyID = @COMPANYID), M.UnitID)) AS UnitID FROM Materials AS M WHERE ISNULL(M.IsDisabled, 0) = 0 AND ISNULL(M.IsLocked, 0) = 1 AND M.CompanyID = @COMPANYID ", new
                {
                    COMPANYID = companyId
                }).ToList();

                resultJs.data = new
                {
                    products = products
                };

                resultJs.message = "Success";

                resultJs.status = 200;


                return Ok(resultJs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("GetListComboBox")]
        [AllowAnonymous]
        public IActionResult GetListComboBox()
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                string companyId = userCurrent.CompanyID;

                List<Product> products = _txngContext.Query<Product>(" SELECT P.ID, P.ProductName FROM Products AS P LEFT JOIN ProductCompany AS PC ON P.ID = PC.ProductID WHERE ISNULL(P.IsDisabled, 0) = 0 AND ISNULL(P.IsLocked, 0) = 1 AND PC.CompanyID = @COMPANYID ", new
                {
                    COMPANYID = companyId
                }).ToList(); 

                resultJs.data = new
                {
                    products = products
                };

                resultJs.message = "Success";

                resultJs.status = 200;

                return Ok(resultJs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        #region Get
        [HttpGet("Get")]
        [AllowAnonymous]
        //[AuthorizeJWT]
        public IActionResult Get(string id)
        {
            try
            {
                ResultJs<object> result = new ResultJs<object>();

                // Product product = _productService.GetList(id, userCurrent.CompanyID, null).FirstOrDefault();

                Product product = _txngContext.Query<Product>(" SELECT P.ID, P.MaterialGroupID, P.ProductGroupID, P.QRCode, P.ProductName, P.ProductCodeYCTC as ProductCode, P.ProductCode as ProductCodeOriginal, P.Origin, P.UnitID, P.ExpiredNum, P.ExpiredUnit, P.ExpiredType, P.Avatar, P.Introduce, P.Ingredient, P.Storage, P.Usage, P.Packing, P.Images, P.Accreditation, P.Certification, P.Market, P.ProductionProcess, P.Barcode, P.QualityNum, P.ScanNum, P.Rating, P.VerifiedImage, P.VerifiedImageBy, P.VerifiedImageDate, P.VerifiedStatus, P.VerifyID, P.VerifiedBy, P.VerifiedDate, P.VerifiedName, P.ConfirmedBy, P.ConfirmedDate, P.ConfirmedStatus, P.ConfirmedReason, P.IsBoth, P.IsDisabled, P.IsLocked, P.CreatedBy, P.CreatedDate, P.ModifiedBy, P.ModifiedDate, P.InStore, P.InStoreTemp, P.OutStore, P.OutStoreTemp, P.QuantityInStore, P.SupplierID, P.ManufactID, P.Weight, P.IsTypical, P.TypicalNum, P.WarningUsage, U.UnitName, P.IsBoth AS IsMaterial FROM Products AS P LEFT JOIN Units AS U ON U.ID = P.UnitID WHERE P.ID = @ID ", new
                {
                    ID = id
                }).FirstOrDefault();

                ProductCompany productCompany = _txngContext.Query<ProductCompany>($" SELECT * FROM ProductCompany WHERE ProductID = @PRODUCTID AND CompanyID = @COMPANYID ", new
                {
                    PRODUCTID = product.ID,
                    COMPANYID = userCurrent.CompanyID
                }).FirstOrDefault();

                if (string.IsNullOrEmpty(product.QRCode))
                {
                    product.QRCode = _qRCodeProvider.Encryto(QRCodeType.SP, product.ID);
                }

                result.data = new
                {
                    product = product,
                    productCompany = productCompany,
                    productsUnits = _productService.GetUnits(id),
                    productFields = _productService.GetFields(id)
                };

                result.status = 200;

                result.message = "Lấy thông tin thành công";

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("GetForList")]
        [ClaimRequirement(FunctionCode.Products, PermissionAction.View)]
        //[AuthorizeJWT]
        public IActionResult GetForList(string id)
        {
            try
            {
                ResultJs<object> result = new ResultJs<object>();

                // Product product = _productService.GetList(id, userCurrent.CompanyID, null).FirstOrDefault();

                Product product = _txngContext.Query<Product>(" SELECT P.*, U.UnitName, P.IsBoth AS IsMaterial FROM Products AS P LEFT JOIN Units AS U ON U.ID = P.UnitID WHERE P.ID = @ID ", new
                {
                    ID = id
                }).FirstOrDefault();

                ProductCompany productCompany = _txngContext.Query<ProductCompany>($" SELECT * FROM ProductCompany WHERE ProductID = @PRODUCTID AND CompanyID = @COMPANYID ", new
                {
                    PRODUCTID = product.ID,
                    COMPANYID = userCurrent.CompanyID
                }).FirstOrDefault();

                if (string.IsNullOrEmpty(product.QRCode))
                {
                    product.QRCode = _qRCodeProvider.Encryto(QRCodeType.SP, product.ID);
                }

                result.data = new
                {
                    product = product,
                    productCompany = productCompany,
                    productsUnits = _productService.GetUnits(id),
                    productFields = _productService.GetFields(id)
                };

                result.status = 200;

                result.message = "Lấy thông tin thành công";

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost("GetAll")]
        [ClaimRequirement(FunctionCode.Products, PermissionAction.View)]
        //[AuthorizeJWT]
        public IActionResult GetAll([FromBody] ProductSearch model)
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                string select = $@" A.VerifiedStatus, A.ID, a.ProductCode,A.ProductName, A.Avatar,C.UnitName, A.Islocked, A.ConfirmedStatus, (SELECT TOP 1 U2.UnitName FROM ProductsUnits AS PU INNER JOIN Units AS U2 ON U2.ID = PU.UnitID WHERE PU.ProductID = A.ID AND PU.IsReport = 1) AS UnitNameReport ";

                string from = @" Products A With(nolock)
                                inner join Units C With(nolock) on A.UnitID = C.ID
                                inner join ProductCompany D with(nolock) on A.ID = D.ProductID and D.CompanyID=@companyID ";

                //LEFT JOIN ProductFields AS PF WITH(NOLOCK) ON PF.ProductID = A.ID
                //left join Fields B With(nolock) on PF.FieldID = B.ID

                string where = $@"isnull(IsDisabled,0) = 0";

                if (!string.IsNullOrEmpty(model.Status))
                {
                    where += $@" AND A.ConfirmedStatus = CONVERT(INT, {model.Status}) ";
                }

                if (!string.IsNullOrWhiteSpace(model.FieldID))
                {
                    where += $@" and FieldID in (select [value] from f_Field_ChildIDs('{model.FieldID}'))";
                }

                if (!string.IsNullOrWhiteSpace(model.ProductCode))
                {
                    where += $@" and ProductCode like N'%{model.ProductCode}%'";
                }

                if (!string.IsNullOrWhiteSpace(model.ProductName))
                {
                    where += $@" and ProductName like N'%{model.ProductName}%')";
                }
                if (model.Islocked != null)
                {
                    where += $@" and A.IsLocked={model.Islocked}";
                }

                List<ProductViewModel> products = _txngContext
                    .GetAll<ProductViewModel>(select, from, where,
                    new { CompanyID = userCurrent.CompanyID },
                    string.IsNullOrEmpty(model.OrderBy) ? " A.IsLocked, A.ProductName " : model.OrderBy,
                    model.Page, model.Limit)
                    .ToList();

                int count = _txngContext.Count(from, where, new { CompanyID = userCurrent.CompanyID });

                resultJs.data = new
                {
                    products = products,
                    total = count
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

        [HttpPost("getAllProductFeedbacks")]
        //[AuthorizeJWT]
        public IActionResult GetAllProductFeedbacks([FromBody] ProductSearch model)
        {
            ResultJs<object> result = new ResultJs<object>();
            try
            {
                string select = $@" * ";

                string from = @" Products";

                string where = $@" ID IN
                                (SELECT ProductID FROM Feedbacks 
                                WHERE CompanyID = @companyID)";

                if (!string.IsNullOrWhiteSpace(model.FieldID))
                {
                    where += $@" and FieldID in (select [value] from f_Field_ChildIDs('{model.FieldID}'))";
                }
                if (!string.IsNullOrWhiteSpace(model.ProductCode))
                {
                    where += $@" and ProductCode like N'%{model.ProductCode}%'";
                }
                if (!string.IsNullOrWhiteSpace(model.ProductName))
                {
                    where += $@" and ProductName like N'%{model.ProductName}%')";
                }

                List<ProductViewModel> products = _txngContext
                    .GetAll<ProductViewModel>(select, from, where,
                    new { CompanyID = userCurrent.CompanyID },
                    string.IsNullOrWhiteSpace(model.OrderBy) ? "ProductName" : model.OrderBy,
                    model.Page, model.Limit)
                    .ToList();

                int count = _txngContext.Count(from, where, new { CompanyID = userCurrent.CompanyID });

                result.data = new
                {
                    products = products,
                    total = count
                };

                result.status = 200;

                result.message = "Lấy thông tin thành công";

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost("GetAllLock")]
        //[AuthorizeJWT]
        public IActionResult GetAllLock([FromBody] ProductSearch model)
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                string select = $@" DISTINCT A.ID, A.ProductCode, A.ProductName, A.ProductGroupID, A.Avatar, C.UnitName ";

                string from = @" Products A WITH(NOLOCK)
                                INNER JOIN ProductFields AS PF WITH(NOLOCK) ON PF.ProductID = A.ID
                                LEFT JOIN Units C WITH(NOLOCK) ON A.UnitID = C.ID
                                INNER JOIN ProductCompany D WITH(NOLOCK) ON A.ID = D.ProductID AND D.CompanyID = @companyID ";

                string where = $@" ISNULL(A.IsDisabled, 0) = 0 AND A.IsLocked = 1 ";

                if (!string.IsNullOrWhiteSpace(model.FieldID))
                {
                    where += $@" AND PF.FieldID = '{model.FieldID}' ";
                }
                if (!string.IsNullOrWhiteSpace(model.ProductCode))
                {
                    where += $@" and ProductCode like N'%{model.ProductCode}%'";
                }
                if (!string.IsNullOrWhiteSpace(model.ProductName))
                {
                    where += $@" and ProductName like N'%{model.ProductName}%')";
                }

                List<ProductViewModel> products = _txngContext
                    .GetAll<ProductViewModel>(select, from, where,
                    new { CompanyID = userCurrent.CompanyID },
                    string.IsNullOrWhiteSpace(model.OrderBy) ? " A.ProductCode " : model.OrderBy,
                    model.Page, model.Limit)
                    .ToList();

                int count = _txngContext.Count(from, where, new { CompanyID = userCurrent.CompanyID });

                resultJs.data = new
                {
                    products = products,
                    total = count
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

        [HttpGet("GetForGoodDelivery")]
        //[AuthorizeJWT]
        public IActionResult GetForGoodDelivery()
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                string companyId = userCurrent.CompanyID;

                //int? inStore = _txngContext.Query<int>(" SELECT InStore FROM CompanyConfig WHERE CompanyID = @COMPANYID ", new
                //{
                //    COMPANYID = companyId
                //}).FirstOrDefault();

                string sql = "";

                //if (inStore == 1)
                //{
                //    sql = @" SELECT DISTINCT P.ID, P.ProductName FROM Products AS P WITH(NOLOCK) INNER JOIN ProductFields AS PF WITH(NOLOCK) ON PF.ProductID = P.ID INNER JOIN ProductCompany AS PC WITH(NOLOCK) ON P.ID = PC.ProductID                                INNER JOIN Inventory AS I ON I.MaterialID = P.ID WHERE I.Quantity > 0 AND PC.CompanyID = @COMPANYID AND ISNULL(P.IsDisabled, 0) = 0 AND P.IsLocked = 1 ";
                //}
                //else
                //{
                //    sql = @" SELECT DISTINCT P.ID, P.ProductName FROM Products AS P WITH(NOLOCK)
                //                INNER JOIN ProductFields AS PF WITH(NOLOCK) ON PF.ProductID = P.ID
                //                INNER JOIN ProductCompany AS PC WITH(NOLOCK) ON P.ID = PC.ProductID AND PC.CompanyID = @COMPANYID AND ISNULL(P.IsDisabled, 0) = 0 AND P.IsLocked = 1 ";
                //}

                sql = @" SELECT DISTINCT P.ID, P.ProductName FROM Products AS P WITH(NOLOCK) INNER JOIN ProductFields AS PF WITH(NOLOCK) ON PF.ProductID = P.ID INNER JOIN ProductCompany AS PC WITH(NOLOCK) ON P.ID = PC.ProductID INNER JOIN Inventory AS I ON I.MaterialID = P.ID WHERE I.Quantity > 0 AND PC.CompanyID = @COMPANYID AND ISNULL(P.IsDisabled, 0) = 0 AND P.IsLocked = 1 AND P.ID NOT IN (SELECT GRD.MaterialID FROM GRDetails AS GRD WHERE GRD.BatchID IS NOT NULL AND GRD.BatchID != '')";

                List<Product> products = _txngContext.Query<Product>(sql, new
                {
                    COMPANYID = companyId
                }).ToList();

                resultJs.data = new
                {
                    products = products
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

        [HttpPost("GetListLockInventory")]
        //[AuthorizeJWT]
        public IActionResult GetListLockInventory([FromBody] ProductSearch model)
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                string select = $@" DISTINCT A.ID, A.ProductCode, A.ProductName, A.ProductGroupID, A.Avatar, C.UnitName ";

                string from = @" Products A WITH(NOLOCK)
                                INNER JOIN ProductFields AS PF WITH(NOLOCK) ON PF.ProductID = A.ID
                                LEFT JOIN Units C WITH(NOLOCK) ON A.UnitID = C.ID
                                INNER JOIN ProductCompany D WITH(NOLOCK) ON A.ID = D.ProductID AND D.CompanyID = @companyID INNER JOIN Inventory AS I ON I.MaterialID = A.ID ";

                string where = $@" ISNULL(A.IsDisabled, 0) = 0 AND A.IsLocked = 1 ";

                if (!string.IsNullOrWhiteSpace(model.FieldID))
                {
                    where += $@" AND PF.FieldID = '{model.FieldID}' ";
                }
                if (!string.IsNullOrWhiteSpace(model.ProductCode))
                {
                    where += $@" and ProductCode like N'%{model.ProductCode}%'";
                }
                if (!string.IsNullOrWhiteSpace(model.ProductName))
                {
                    where += $@" and ProductName like N'%{model.ProductName}%')";
                }

                List<ProductViewModel> products = _txngContext
                    .GetAll<ProductViewModel>(select, from, where,
                    new { CompanyID = userCurrent.CompanyID },
                    string.IsNullOrWhiteSpace(model.OrderBy) ? "A.ProductCode" : model.OrderBy,
                    model.Page, model.Limit)
                    .ToList();

                int count = _txngContext.Count(from, where, new { CompanyID = userCurrent.CompanyID });

                resultJs.data = new
                {
                    products = products,
                    total = count
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

        /// <summary>
        ///  danh sách nhóm sản phẩm
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("GetListGroup")]
        public IActionResult GetListGroup([FromBody] SearchModel model)
        {
            ResultJs<object> result = new ResultJs<object>();
            try
            {
                model.search = model.search ?? "";

                string sql = $@"select A.*, C.FieldName
                                from ProductsGroups A with(nolock)
                                inner join MaterialGroups B with(nolock) on A.MaterialGroupID = B.ID
                                inner join Fields C with(nolock) on B.FieldID = C.ID
                                inner join CompaniesFields D with(nolock) on D.FieldID = C.FieldCode and D.CompanyID = '{userCurrent.CompanyID}'
                                where A.Name like N'%{model.search}%' and isnull(A.IsDeleted,0) = 0 and A.IsLocked=1 ";

                if (!string.IsNullOrWhiteSpace(model.filter))
                {
                    sql += $@" and MaterialGroupID='{model.filter}'";
                }

                result.status = 200;
                result.message = "get thông tin thành công";

                result.data = new
                {
                    ProductGroups = _txngContext
                    .Query<ProductGroup>(sql, null,
                     string.IsNullOrWhiteSpace(model.orderBy) ? "Name" : model.orderBy, model.page, model.limit)
                    .ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        /// <summary>
        /// lấy danh sách đơn vị tính của sản phẩm
        /// </summary>
        /// <param name="productID"></param>
        /// <returns></returns>
        [HttpGet("GetUnits")]
        //[AuthorizeJWT]
        public IActionResult GetUnits(string productID)
        {
            ResultJs<object> result = new ResultJs<object>();
            try
            {
                result.data = new
                {
                    productsUnits = _productService.GetUnits(productID)
                };
                result.status = 200;
                result.message = "lấy thông tin thành công";
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        /// <summary>
        /// Chỉ lấy những sản phẩm đang có nhật ký truy xuất hoạt động
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpGet("GetByTrace")]
        //[AuthorizeJWT]
        public IActionResult GetByTrace(string FieldId)
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                //string select = $@"distinct A.ID, a.ProductCode, A.ProductName, A.Avatar";

                //string from = @" Products A With(nolock)
                //                inner join Traces C With(nolock) on A.ID = C.ProductID and isnull(IsCompleted,0) = 0";

                //string where = $@" A.CompanyID = @CompanyID and isnull(IsDisabled,0) = 0 ";

                //string select = $@" DISTINCT A.ID, A.ProductCode, A.ProductName, A.Avatar ";

                //string from = @" Products A WITH(NOLOCK)
                //                INNER JOIN ProductFields AS PF WITH(NOLOCK) ON PF.ProductID = A.ID
                //                INNER JOIN ProductCompany AS D WITH(NOLOCK) ON A.ID = D.ProductID INNER JOIN Traces AS T WITH(NOLOCK) ON A.ID = T.ProductID ";

                //string where = $@" D.CompanyID = @COMPANYID AND PF.FieldID = @FIELDID AND ISNULL(A.IsDisabled, 0) = 0 AND A.IsLocked = 1 ";

                //List<ProductViewModel> products = _txngContext
                //.GetAll<ProductViewModel>(select, from, where,
                //new
                //{
                //    COMPANYID = userCurrent.CompanyID,
                //    FIELDID = FieldId
                //})
                //.ToList();

                List<ProductViewModel> products = _txngContext.Query<ProductViewModel>(" SELECT * FROM Products WHERE ID IN (SELECT DISTINCT ProductID FROM Traces WHERE CompanyID = @COMPANYID AND FieldID = @FIELDID) ORDER BY ProductName ", new
                {
                    COMPANYID = userCurrent.CompanyID,
                    FIELDID = FieldId
                }).ToList();

                resultJs.data = new
                {
                    products = products
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

        [HttpPost("GetListForAddTrace")]
        [AuthorizeJWT(policy: PolicyConsts.COMPANY_POLICY)]
        public IActionResult GetListForAddTrace(string fieldId)
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                resultJs.status = 200;

                resultJs.message = "Lấy thông tin thành công";

                resultJs.data = new
                {
                    products = _txngContext.Query<Product>($@" SELECT P.ID, P.ProductName FROM ProductFields AS PF INNER JOIN Products AS P ON P.ID = PF.ProductID WHERE ISNULL(P.IsDisabled, 0) = 0 AND PF.FieldID = @FIELDID ORDER BY P.ProductName ", new
                    {
                        FIELDID = fieldId
                    }).ToList()
                };

                return Ok(resultJs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet(nameof(GetByProductCode))]
        public async Task<IActionResult> GetByProductCode(string productCode)
        {
            try
            {
                ResultJs<List<Product>> resultJs = new ResultJs<List<Product>>();

                var ls_productEx = _txngContext.GetAll<Product>("ProductCode like @ProductCode and isnull(IsDisabled,0) = 0 and IsLocked=1",
                          new
                          {
                              ProductCode = productCode
                          }).ToList();

                resultJs.data = ls_productEx;

                resultJs.status = 200;

                resultJs.message = "Success";

                return Ok(resultJs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet(nameof(GetByBarcode))]
        public async Task<IActionResult> GetByBarcode(string barcode)
        {
            try
            {
                ResultJs<List<Product>> resultJs = new ResultJs<List<Product>>();

                var ls_productEx = _txngContext.GetAll<Product>($@"Barcode like @Barcode isnull(IsDisabled,0) = 0 and IsLocked=1",
                         new
                         {
                             Barcode = barcode,
                         }).ToList();

                resultJs.data = ls_productEx;

                resultJs.status = 200;

                resultJs.message = "Success";

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
        //[AllowAnonymous]
        [ClaimRequirement(FunctionCode.Products, PermissionAction.Create)]
        [ValidateModel]
        //[RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> Create([FromForm] ProductJs model)
        {
            _logService.SaveLog($"model_input:  {model}");
            ResultJs<object> result = new ResultJs<object>();
            
            List<Product> ls_productEx;

            Product productEx;

            string productId;

            try
            {
                #region Vaild
                if (!string.IsNullOrEmpty(model.Barcode))
                {
                    bool isCheckExistProductBarcode = await _lacoClientProvider.CheckExistProductBarcode(model.Barcode);
                    _logService.SaveLog($"isCheckExistProductBarcode:  {isCheckExistProductBarcode}");
                    if (!isCheckExistProductBarcode)
                    {
                        result.message = "Mã vạch đã được sử dụng";

                        goto Final;
                    }
                }

                if (!string.IsNullOrEmpty(model.ProductCode))
                {
                    ls_productEx = _txngContext.GetAll<Product>(" ProductCode LIKE @ProductCode AND ISNULL(IsDisabled, 0) = 0 ",
                         new
                         {
                             ProductCode = model.ProductCode,
                             CompanyID = userCurrent.CompanyID
                         }).ToList();
                    _logService.SaveLog($"ls_productEx:  {ls_productEx}");
                    if (ls_productEx != null)
                    {
                        if (ls_productEx.Count > 0)
                        {
                            if (await _productService.isExist(ls_productEx.First().ID, userCurrent.CompanyID))
                            {
                                result.message = "Mã sản phẩm đã có";

                                goto Final;
                            }
                            else
                            {
                                //productEx = ls_productEx.Where(x => x.ConfirmedStatus == ConfirmedStatusConst.Confirmed).FirstOrDefault();

                                //if (productEx?.ConfirmedStatus == ConfirmedStatusConst.Confirmed)
                                //{
                                //    productId = productEx.ID;
                                //    goto Mapping;
                                //}
                            }
                        }
                    }
                }

                int checkExistProductCode = _txngContext.Query<int>(" SELECT COUNT(P.ID) FROM Products AS P INNER JOIN ProductCompany AS PC ON P.ID = PC.ProductID AND PC.CompanyID = @COMPANYID AND P.ProductCode = @PRODUCTCODE AND ISNULL(P.IsDisabled, 0) = 0 ", new
                {
                    COMPANYID = userCurrent.CompanyID,
                    PRODUCTCODE = model.ProductCode
                }).FirstOrDefault();
                _logService.SaveLog($"checkExistProductCode:  {checkExistProductCode}");
                if (checkExistProductCode > 0)
                {
                    result.message = "Mã sản phẩm này đã tồn tại";

                    goto Final;
                }

                int checkExistProductName = _txngContext.Query<int>(" SELECT COUNT(P.ID) FROM Products AS P INNER JOIN ProductCompany AS PC ON P.ID = PC.ProductID AND PC.CompanyID = @COMPANYID AND P.ProductName = @PRODUCTNAME AND ISNULL(P.IsDisabled, 0) = 0 ", new
                {
                    COMPANYID = userCurrent.CompanyID,
                    PRODUCTNAME = model.ProductName
                }).FirstOrDefault();
                _logService.SaveLog($"checkExistProductName:  {checkExistProductName}");
                if (checkExistProductName > 0)
                {
                    result.message = "Tên sản phẩm này đã tồn tại";

                    goto Final;
                }

                //if (!string.IsNullOrWhiteSpace(model.Barcode))
                //{
                //    ls_productEx = _txngContext.GetAll<Product>($@"Barcode like @Barcode and isnull(IsDisabled,0) = 0",
                //        new
                //        {
                //            ProductCode = model.ProductCode,
                //            CompanyID = userCurrent.CompanyID,
                //            Barcode = model.Barcode
                //        }).ToList();
                //    if (ls_productEx != null)
                //    {
                //        if (ls_productEx.Count > 0)
                //        {
                //            if (await _productService.isExist(ls_productEx.FirstOrDefault().ID, userCurrent.CompanyID))
                //            {
                //                result.message = "Mã vạch sản phẩm đã có";
                //                goto Final;
                //            }
                //            else
                //            {
                //                //productEx = ls_productEx.Where(x => x.ConfirmedStatus == ConfirmedStatusConst.Confirmed).FirstOrDefault();

                //                //if (productEx?.ConfirmedStatus == ConfirmedStatusConst.Confirmed)
                //                //{
                //                //    productId = productEx.ID;
                //                //    goto Mapping;
                //                //}
                //            }
                //        }
                //    }
                //}

                ProductGroup productGroup = _txngContext.Get<ProductGroup>(model.ProductGroupID);
                _logService.SaveLog($"productGroup:  {productGroup}");
                if (productGroup == null)
                {
                    result.message = "Nhóm sản phẩm không tồn tại";

                    goto Final;
                }


                if (!string.IsNullOrEmpty(model.Weight) && string.IsNullOrEmpty(model.UnitID))
                {
                    result.message = "Chưa chọn đơn vị tính";

                    goto Final;
                }

                if (model.ExpiredNum != null)
                {
                    if (model.ExpiredNum > 256)
                    {
                        result.message = "Thời hạn sử dụng không được lớn hơn 256";

                        goto Final;
                    }

                    if (model.ExpiredUnit == null)
                    {
                        result.message = "Đơn vị tính thời hạn sử dụng chưa được chọn";

                        goto Final;
                    }
                }

                if (model.Fields == null)
                {
                    result.message = "Ngành nghề không được bỏ trống";

                    goto Final;
                }

                if (model.Fields.Count <= 0)
                {
                    result.message = "Ngành nghề không được bỏ trống";

                    goto Final;
                }

                string companyId = userCurrent.CompanyID;

                #endregion

                Product product = new Product();
                PropertyCopier<ProductJs, Product>.Copy(model, product);
                product.ID = _configsService.NewIDoC;
                product.Barcode = product.Barcode ?? "";
                product.QRCode = _qRCodeProvider.Encryto(QRCodeType.SP, product.ID);
                // product.CompanyID = userCurrent.CompanyID;
                // product.CompanyID = null;
                product.CreatedBy = userCurrent.FullName;
                product.CreatedDate = DateTime.Now;
                product.VerifiedStatus = ProductVerifiedStatus.Unauthenticated;
                product.IsDisabled = false;
                product.IsLocked = false;
                product.ScanNum = 0;
                product.IsBoth = model.IsMaterial;

                // Get default value
                MaterialGroup materialGroup = _txngContext.Get<MaterialGroup>(productGroup.MaterialGroupID);
                // product.FieldID = materialGroup.FieldID;

                #region ProductsUnit
                if (model.ProductUnits != null)
                {
                    if (model.ProductUnits.Any(x => x.UnitID == model.UnitID))
                    {
                        result.message = "Đơn vị tính bị trùng lặp";

                        goto Final;
                    }

                    if (model.ProductUnits.GroupBy(x => x.UnitID).Any(x => x.Count() > 1))
                    {
                        result.message = "Đơn vị tính bị trùng lặp";

                        goto Final;
                    }

                    foreach (var item in model.ProductUnits)
                    {
                        ProductsUnit productsUnitIndex = new ProductsUnit();

                        PropertyCopier<ProductUnitJs, ProductsUnit>.Copy(item, productsUnitIndex);

                        productsUnitIndex.ID = _configsService.NewIDoC;
                        productsUnitIndex.ProductID = product.ID;
                        productsUnitIndex.CompanyID = companyId;

                        _txngContext.Insert(productsUnitIndex);
                    }
                }
                #endregion

                #region files
                ResultJs<string> resultFile;
                if (model.AvatarFile != null)
                {
                    resultFile = await _fileProvider
                        .UploadFileAsync(model.AvatarFile,
                            string.Format(Constants.Path.COMPANY_PRODUCT, userCurrent.CompanyID));

                    if (resultFile.status == 200)
                    {
                        product.Avatar = resultFile.data.ToString();
                    }
                    else
                    {
                        return Ok(resultFile);
                    }
                }

                if (model.files != null)
                {
                    resultFile = await _fileProvider
                        .UploadFileAsync(model.files,
                        string.Format(Constants.Path.COMPANY_PRODUCT_IMGS, userCurrent.CompanyID));

                    if (resultFile.status == 200)
                    {
                        product.Images = resultFile.data.ToString();
                    }
                    else
                    {
                        return Ok(resultFile);
                    }
                }

                if (model.AccreditationFile != null)
                {
                    resultFile = await _fileProvider
                        .UploadFileAsync(model.AccreditationFile,
                        string.Format(Constants.Path.COMPANY_PRODUCT_ACCREDITATION, userCurrent.CompanyID));

                    if (resultFile.status == 200)
                    {
                        product.Accreditation = resultFile.data.ToString();
                    }
                    else
                    {
                        return Ok(resultFile);
                    }
                }

                if (model.CertificationFile != null)
                {
                    resultFile = await _fileProvider
                        .UploadFileAsync(model.CertificationFile,
                        string.Format(Constants.Path.COMPANY_PRODUCT_CERTIFICATION, userCurrent.CompanyID));

                    if (resultFile.status == 200)
                    {
                        product.Certification = resultFile.data.ToString();
                    }
                    else
                    {
                        return Ok(resultFile);
                    }
                }

                #endregion

                string sql = " SELECT COUNT(1) FROM Products WHERE DATEDIFF(MONTH, CreatedDate, GETDATE()) = 0 ";
                
                int total = _txngContext.Query<int>(sql, new { CompanyID = userCurrent.CompanyID }).FirstOrDefault();
                _logService.SaveLog($"total:  {total}");
                // product.ProductCode = $"SP.{_configsService.ServerID}.{DateTime.Now.ToString("yyyy.MM")}.{(total + 1).ToString("D5")}";

                product.ProductCode = _configsService.NewIDProductCode(companyId);
                
                var productCodeYCTC13274 = _configsService.NewIDProductCodeYCTC13274(companyId);
                _logService.SaveLog($"productCodeYCTC13274:  {productCodeYCTC13274}");

                product.ProductCodeYCTC = _configsService.NewIDProductCodeYCTC13274(companyId);

                _configsService.UpdateNewIDProductCode(companyId);

                List<ProductFieldModel> productFields = model.Fields.Select(p => new ProductFieldModel
                {
                    ID = _configsService.NewID,
                    ProductID = product.ID,
                    FieldID = p
                }).ToList();

                _productService.Inserts(product);

                _txngContext.InsertMany<ProductFieldModel>(productFields);

                #region National Portal Product
                if(!string.IsNullOrEmpty(product.Certification))
                    await _nationalPortalProductService.UpdateImageNationalPortalProductAsync(product);
                #endregion


                _logService.SaveLog($"Thêm sản phẩm {product.ProductName}");

                result.data = new { id = product.ID };

                productId = product.ID;

            Mapping:
                _productService.Mapping(productId, userCurrent.CompanyID, model.IsMaterial, true);

                result.status = 200;

                result.message = "Tạo sản phẩm thành công";
            Final:
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    InnerException = ex.InnerException?.Message
                });
            }
        }

        [HttpPost("Update")]
        [ClaimRequirement(FunctionCode.Products, PermissionAction.Update)]
        [ValidateModel]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> Update([FromForm] ProductJs model)
        {
            ResultJs<object> result = new ResultJs<object>();
            List<Product> ls_productEx;
            Product productEx;
            Product product = new Product();
            string productId;

            string companyId = userCurrent.CompanyID;

            try
            {
                #region Vaild
                product = _productService.Find("ID = @ID",
                    new
                    {
                        ID = model.ID,
                        CompanyID = userCurrent.CompanyID
                    });
                if (product == null)
                {
                    result.message = "Không tìm thấy sản phẩm";

                    goto Final;
                }
                //else if ((product.IsLocked ?? false) == true)
                //{
                //    result.message = "Sản phẩm đã khoá";
                //    goto Final;
                //}

                ProductVerifiedStatus verifiedStatus = product.VerifiedStatus;

                int checkExistProductCode = _txngContext.Query<int>(" SELECT COUNT(P.ID) FROM Products AS P INNER JOIN ProductCompany AS PC ON P.ID = PC.ProductID AND PC.CompanyID = @COMPANYID AND P.ProductCode = @PRODUCTCODE AND ISNULL(P.IsDisabled, 0) = 0 AND ID != @ID ", new
                {
                    COMPANYID = userCurrent.CompanyID,
                    PRODUCTCODE = model.ProductCode,
                    ID = model.ID
                }).FirstOrDefault();

                if (checkExistProductCode > 0)
                {
                    result.message = "Mã sản phẩm này đã tồn tại";

                    goto Final;
                }

                int checkExistProductName = _txngContext.Query<int>(" SELECT COUNT(P.ID) FROM Products AS P INNER JOIN ProductCompany AS PC ON P.ID = PC.ProductID AND PC.CompanyID = @COMPANYID AND P.ProductName = @PRODUCTNAME AND ISNULL(P.IsDisabled, 0) = 0 AND ID != @ID ", new
                {
                    COMPANYID = userCurrent.CompanyID,
                    PRODUCTNAME = model.ProductName,
                    ID = model.ID
                }).FirstOrDefault();

                if (checkExistProductName > 0)
                {
                    result.message = "Tên sản phẩm này đã tồn tại";

                    goto Final;
                }

                if (checkExistProductName >= 1)
                {
                    result.message = "Tên sản phẩm này đã tồn tại";

                    goto Final;
                }

                //if (!(product.ConfirmedStatus == ConfirmedStatusConst.NewCreate || product.ConfirmedStatus == ConfirmedStatusConst.Unconfirm))
                //{
                //    result.message = "Sản phẩm đang trong trạng thái không được chỉnh sửa";
                //    goto Final;
                //}

                ProductGroup productGroup = _txngContext.Get<ProductGroup>(model.ProductGroupID);
                if (productGroup == null)
                {
                    result.message = "Nhóm sản phẩm không tồn tại";

                    goto Final;
                }

                ls_productEx = _txngContext.GetAll<Product>("ID <> @ID and  ProductCode like @ProductCode  and isnull(IsDisabled,0) = 0",
                  new
                  {
                      ID = model.ID,
                      ProductCode = model.ProductCode,
                      CompanyID = userCurrent.CompanyID
                  }).ToList();

                //if (ls_productEx != null)
                //{
                //    productEx = ls_productEx.Where(x => x.ConfirmedStatus == ConfirmedStatusConst.Confirmed).FirstOrDefault();

                //    if (productEx?.ConfirmedStatus == ConfirmedStatusConst.Confirmed)
                //    {
                //        _productService.Mapping(productEx.ID, userCurrent.CompanyID, model.IsMaterial);

                //        _productService.RemoveMapping(product.ID, userCurrent.CompanyID);
                //        _productService.RemoveRelationship(product.ID, userCurrent.CompanyID);

                //        result.status = 200;
                //        result.message = "Kế thừa sản phẩm thành công";
                //        goto Final;
                //    }
                //}

                if (!string.IsNullOrEmpty(model.Barcode))
                {
                    productEx = _txngContext.Find<Product>(" ID <> @ID AND Barcode LIKE @BARCODE AND ISNULL(IsDisabled, 0) = 0",
                        new
                        {
                            ID = model.ID,
                            BARCODE = model.Barcode,
                            COMPANYID = userCurrent.CompanyID
                        });

                    //if (ls_productEx != null)
                    //{
                    //    productEx = ls_productEx.Where(x => x.ConfirmedStatus == ConfirmedStatusConst.Confirmed).FirstOrDefault();

                    //    if (productEx?.ConfirmedStatus == ConfirmedStatusConst.Confirmed)
                    //    {
                    //        _productService.Mapping(productEx.ID, userCurrent.CompanyID, model.IsMaterial);

                    //        _productService.RemoveMapping(product.ID, userCurrent.CompanyID);
                    //        _productService.RemoveRelationship(product.ID, userCurrent.CompanyID);

                    //        result.status = 200;
                    //        result.message = "Kế thừa sản phẩm thành công";
                    //        goto Final;
                    //    }
                    //}
                }

                if (!string.IsNullOrWhiteSpace(model.Weight) && string.IsNullOrWhiteSpace(model.UnitID))
                {
                    result.message = "Chưa chọn ĐVT";

                    goto Final;
                }

                if (model.ExpiredNum != null)
                {
                    if (model.ExpiredNum > 256)
                    {
                        result.message = "Thời hạn sử dụng không được lớn hơn 256";

                        goto Final;
                    }
                }

                if (model.Fields == null)
                {
                    result.message = "Ngành nghề không được bỏ trống";

                    goto Final;
                }

                if (model.Fields.Count <= 0)
                {
                    result.message = "Ngành nghề không được bỏ trống";

                    goto Final;
                }

                #region Check ProductUnit
                List<ProductsUnit> productUnits = _txngContext.GetAll<ProductsUnit>("ProductID = @ID",
                    new
                    {
                        ID = model.ID
                    }).ToList();

                bool checkMUValid = true;
                foreach (var materialUnit in productUnits)
                {
                    if ((materialUnit.IsLocked ?? false) == true)
                    {
                        var modelValue = model.ProductUnits.Where(x => x.ID == materialUnit.ID).FirstOrDefault();
                        if (modelValue == null)
                        {
                            checkMUValid = false;
                            break;
                        }
                        if (materialUnit.Value != modelValue.Value.Value)
                        {
                            checkMUValid = false;
                            break;
                        }
                    }
                }

                if (!checkMUValid)
                {
                    result.message = "Không sửa được vì dữ liệu đã được sử dụng";

                    goto Final;
                }

                var materialUnitLock = productUnits.Where(x => (x.IsLocked ?? false) == true).FirstOrDefault();
                //var isUse = materialUnitLock == null ? false : true;
                #endregion

                //if (!isUse)
                //{
                //    var giDetail = _txngContext.Query<GIDetail>("select top 1 ID from GIDetails where MaterialID = @ID ", product).FirstOrDefault();
                //    if (giDetail != null)
                //    {
                //        result.message = "Dữ liệu đã được sử dụng. Chỉ có thể sửa xoá đơn vị quy đổi chưa được sử dụng";
                //        isUse = true;
                //        goto Used;
                //    }

                //    var grDetail = _txngContext.Query<GRDetail>("select top 1 ID from GRDetails where MaterialID = @ID ", product).FirstOrDefault();
                //    if (grDetail != null)
                //    {
                //        result.message = "Dữ liệu đã được sử dụng. Chỉ có thể sửa xoá đơn vị quy đổi chưa được sử dụng";
                //        isUse = true;
                //        goto Used;
                //    }
                //}

                if (model.ProductUnits != null)
                {
                    if (model.ProductUnits.Any(x => x.UnitID == model.UnitID))
                    {
                        result.message = "Đơn vị tính bị trùng lặp";

                        goto Final;
                    }

                    if (model.ProductUnits.GroupBy(x => x.UnitID).Any(x => x.Count() > 1))
                    {
                        result.message = "Đơn vị tính bị trùng lặp";

                        goto Final;
                    }
                }
                else
                    model.ProductUnits = new List<ProductUnitJs>();
                #endregion

                string avartar = product.Avatar;
                string imgs = product.Images;
                string accreditation = product.Accreditation;
                string certifocation = product.Certification;
                string productCode = product.ProductCode;
                PropertyCopier<ProductJs, Product>.Copy(model, product);
                product.ProductCode = productCode;
                //product.ConfirmedStatus = ConfirmedStatusConst.NewCreate;

                #region National Portal Transport
                var currentImg = _txngContext.Query<Product>($"select * from Products WHERE ID = '{product.ID}'").FirstOrDefault();
                #endregion

                if (string.IsNullOrWhiteSpace(product.QRCode))
                {
                    product.QRCode = _qRCodeProvider.Encryto(QRCodeType.SP, product.ID);
                }

                #region files
                ResultJs<string> resultFile;
                if (model.AvatarFile != null)
                {
                    resultFile = await _fileProvider
                        .UploadFileAsync(model.AvatarFile,
                        string.Format(Constants.Path.COMPANY_PRODUCT, userCurrent.CompanyID));
                    if (resultFile.status == 200)
                    {
                        product.Avatar = resultFile.data.ToString();

                    }
                    else
                    {
                        return Ok(resultFile);
                    }
                }

                _fileProvider.Delete(avartar, product.Avatar, string.Format(Constants.Path.COMPANY_PRODUCT, userCurrent.CompanyID));

                if (model.files != null)
                {
                    resultFile = await _fileProvider
                        .UploadFileAsync(model.files,
                        string.Format(Constants.Path.COMPANY_PRODUCT_IMGS, userCurrent.CompanyID));
                    if (resultFile.status == 200)
                    {
                        product.Images = (string.IsNullOrWhiteSpace(product.Images) ? "" : product.Images + ";") + resultFile.data.ToString();
                    }
                    else
                    {
                        return Ok(resultFile);
                    }
                }
                _fileProvider.Delete(imgs, product.Images, string.Format(Constants.Path.COMPANY_PRODUCT_IMGS, userCurrent.CompanyID));

                if (model.AccreditationFile != null)
                {
                    resultFile = await _fileProvider
                        .UploadFileAsync(model.AccreditationFile,
                        string.Format(Constants.Path.COMPANY_PRODUCT_ACCREDITATION, userCurrent.CompanyID));
                    if (resultFile.status == 200)
                    {
                        product.Accreditation = (string.IsNullOrWhiteSpace(product.Accreditation) ? "" : product.Accreditation + ";") + resultFile.data.ToString();

                    }
                    else
                    {
                        return Ok(resultFile);
                    }
                }
                _fileProvider.Delete(accreditation, product.Accreditation, string.Format(Constants.Path.COMPANY_PRODUCT_ACCREDITATION, userCurrent.CompanyID));

                if (model.CertificationFile != null)
                {
                    resultFile = await _fileProvider
                        .UploadFileAsync(model.CertificationFile,
                        string.Format(Constants.Path.COMPANY_PRODUCT_CERTIFICATION, userCurrent.CompanyID));
                    if (resultFile.status == 200)
                    {
                        product.Certification = (string.IsNullOrWhiteSpace(product.Certification) ? "" : product.Certification + ";") + resultFile.data.ToString();
                    }
                    else
                    {
                        return Ok(resultFile);
                    }
                }
                _fileProvider.Delete(certifocation, product.Certification, string.Format(Constants.Path.COMPANY_PRODUCT_CERTIFICATION, userCurrent.CompanyID));
                #endregion

                //get default value
                MaterialGroup materialGroup = _txngContext.Get<MaterialGroup>(productGroup.MaterialGroupID);
            //product.FieldID = materialGroup.FieldID;
            Used:
                #region ProductsUnit
                List<string> idsCutrent = model.ProductUnits?.Select(x => x.ID).ToList();
                List<string> deletes = productUnits.Where(x => idsCutrent.Any(y => y == x.ID) == false)
                    .Select(x => x.ID).ToList();
                productUnits = productUnits.Where(x => idsCutrent.Any(y => y == x.ID)).ToList();

                //delete item lost 
                if (deletes != null)
                {
                    deletes.ForEach(x =>
                    {
                        _txngContext.Delete<ProductsUnit>(x);
                    });
                }

                if (model.ProductUnits != null)
                {
                    // update or create item
                    foreach (var item in model.ProductUnits)
                    {
                        var muIndex = productUnits.Where(x => x.UnitID == item.UnitID).FirstOrDefault();
                        if (muIndex == null)
                        {
                            ProductsUnit ProductsUnitIndex = new ProductsUnit();
                            PropertyCopier<ProductUnitJs, ProductsUnit>.Copy(item, ProductsUnitIndex);
                            ProductsUnitIndex.ID = _configsService.NewIDoC;
                            ProductsUnitIndex.ProductID = product.ID;
                            ProductsUnitIndex.CompanyID = companyId;

                            _txngContext.Insert(ProductsUnitIndex);
                        }
                        else
                        {
                            PropertyCopier<ProductUnitJs, ProductsUnit>.Copy(item, muIndex);
                            _txngContext.Update(muIndex);
                        }
                    }
                }
                #endregion

                product.ModifiedBy = userCurrent.FullName;
                product.ModifiedDate = DateTime.Now;
                product.IsBoth = model.IsMaterial;
                // product.ConfirmedStatus = 0;

                if (verifiedStatus == ProductVerifiedStatus.Authenticated)
                {
                    product.VerifiedBy = "";
                    product.VerifyID = "";
                    product.VerifiedDate = null;
                    product.VerifiedStatus = ProductVerifiedStatus.Unauthenticated;
                    product.VerifiedName = "";
                }

                _txngContext.Execute(" DELETE ProductFields WHERE ProductID = @ProductID ", new { ProductID = model.ID });

                List<ProductFieldModel> productFields = model.Fields.Select(p => new ProductFieldModel
                {
                    ID = _configsService.NewID,
                    ProductID = product.ID,
                    FieldID = p
                }).ToList();

                _productService.Updates(product);

                _txngContext.InsertMany<ProductFieldModel>(productFields);

                #region National Portal Transport
                if (currentImg.Certification != certifocation)
                    await _nationalPortalProductService.UpdateImageNationalPortalProductAsync(product);
                #endregion

                Product_Collection productCollection = new Product_Collection();

                PropertyCopier<Product, Product_Collection>.Copy(product, productCollection);

                productCollection.ProductsUnits = _txngContext.Query<ProductsUnit>(" SELECT * FROM ProductsUnits WHERE ProductID = @PRODUCTID AND CompanyID = @COMPANYID ", new
                {
                    PRODUCTID = product.ID,
                    COMPANYID = companyId
                }).ToList();

                productCollection.Partner = _txngContext.Query<Partner>(" SELECT * FROM Partners WHERE ID = @ID ", new
                {
                    ID = product.ManufactID
                }).FirstOrDefault();

                await _lacoClientProvider.ProductUpdateClone(productCollection);

                _logService.SaveLog($"Sửa sản phẩm { product.ProductName}");

                //result.status = isUse ? 201 : 200;

                //result.message = isUse ? result.message : "Sửa sản phẩm thành công";

                result.status = 200;

                result.message = "Sửa sản phẩm thành công";
            Final:
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpDelete("delete/{id}")]
        [ClaimRequirement(FunctionCode.Products, PermissionAction.Delete)]
        public IActionResult Delete(string id)
        {
            try
            {
                ResultJs<object> result = new ResultJs<object>();

                result.message = "Sản phẩm đã được sử dụng";

                Product product = _productService.Find("ID = @ID AND ISNULL(IsDisabled,0) = 0",
                new
                {
                    ID = id,
                    CompanyID = userCurrent.CompanyID
                });

                #region Valid
                if (product == null)
                {
                    result.message = "Không tìm thấy sản phẩm";
                    goto Error;
                }
                else if ((product.IsLocked ?? false) == true)
                {
                    result.message = "Sản phẩm đã khoá";
                    goto Final;
                }

                //if (!(product.ConfirmedStatus == ConfirmedStatusConst.NewCreate || product.ConfirmedStatus == ConfirmedStatusConst.Unconfirm))
                //{
                //    result.message = "Sản phẩm đang trong trạng thái không được chỉnh sủa";
                //    goto Final;
                //}
                #endregion

                var batch = _txngContext.Find<Batch>(@"ProductID = @ID", new { ID = id });
                if (batch != null)
                {
                    product.IsDisabled = true;
                    _productService.Updates(product);
                    goto Final;
                }

                var informSelect = _txngContext.Find<InformSelect>(@"ProductID = @ID", new { ID = id });
                if (informSelect != null)
                {
                    product.IsDisabled = true;
                    _productService.Updates(product);
                    goto Final;
                }

                var scanInfo = _txngContext.Find<ScanInfo>(@"ProductID = @ID", new { ID = id });
                if (scanInfo != null)
                {
                    product.IsDisabled = true;
                    _productService.Updates(product);
                    goto Final;
                }

                var trace = _txngContext.Find<Trace>(@"ProductID = @ID", new { ID = id });
                if (scanInfo != null)
                {
                    product.IsDisabled = true;
                    _productService.Updates(product);
                    goto Final;
                }

                var gi = _txngContext.Find<GIDetail>(@"MaterialID = @ID", new { ID = id });
                if (scanInfo != null)
                {
                    product.IsDisabled = true;
                    _productService.Updates(product);
                    goto Final;
                }

                var gr = _txngContext.Find<GRDetail>(@"MaterialID = @ID", new { ID = id });
                if (scanInfo != null)
                {
                    product.IsDisabled = true;
                    _productService.Updates(product);
                    goto Final;
                }

                product.IsDisabled = true;

                _txngContext.Update<Product>(product);
            Final:
                _logService.SaveLog("Xoá sản phẩm " + product.ProductName);

                result.status = 200;

                result.message = "Xoá sản phẩm thành công";

            Error:
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("Lock/{id}")]
        [ClaimRequirement(FunctionCode.Products, PermissionAction.Lock)]
        public async Task<IActionResult> Lock(string id)
        {
            try
            {
                string companyId = userCurrent.CompanyID;

                ResultJs<object> result = new ResultJs<object>();

                Product product = _productService.Find("ID = @ID AND ISNULL(IsDisabled,0) = 0",
                new
                {
                    ID = id,
                    CompanyID = companyId
                });

                #region Valid
                if (product == null)
                {
                    result.message = "Không tìm thấy sản phẩm";
                    goto Error;
                }

                #endregion

                product.IsLocked = true;

                _txngContext.Update<Product>(product);

                Product_Collection productCollection = new Product_Collection();

                PropertyCopier<Product, Product_Collection>.Copy(product, productCollection);

                productCollection.ProductsUnits = _txngContext.Query<ProductsUnit>(" SELECT * FROM ProductsUnits WHERE ProductID = @PRODUCTID AND CompanyID = @COMPANYID ", new
                {
                    PRODUCTID = product.ID,
                    COMPANYID = companyId
                }).ToList();

                productCollection.Partner = _txngContext.Query<Partner>(" SELECT * FROM Partners WHERE ID = @ID ", new
                {
                    ID = product.ManufactID
                }).FirstOrDefault();

                await _lacoClientProvider.ProductClone(productCollection);

                ProductCompany productCompany = _txngContext.Query<ProductCompany>(" SELECT * FROM ProductCompany WHERE ProductID = @PRODUCTID AND CompanyID = @COMPANYID ", new
                {
                    PRODUCTID = productCollection.ID,
                    COMPANYID = companyId
                }).FirstOrDefault();

                await _lacoClientProvider.ProductCompanyClone(productCompany);
            Final:
                _logService.SaveLog("Khóa " + product.ProductName);

                Company company = _txngContext.Get<Company>(userCurrent.CompanyID);

                string content = _alertTypeService.HandleTemplate(Constants.AlertType.ID.RequestExtendUse, new DataAlertTypeTemplateViewModel
                {
                    Data1 = company.CompanyName
                });

                _alertService.SendToGlobal(HubServerType.Admin, company.ID, Constants.AlertType.ID.RequestConfirmProduct, product.ID, content, userCurrent.Id, DateTime.Now);

                //_alertService.SaveAlert("", company.CompanyName + @$" yêu cầu duyệt sản phẩm {product.ProductName}", company.WardID, Constants.AlertType.CONFIRM_PRODUCT, true);

                //_alertService.SaveAlert("", company.CompanyName + @$" yêu cầu duyệt sản phẩm {product.ProductName}", company.WardID, Constants.AlertType.CONFIRM_PRODUCT, true, true);

                //_alertService.SaveAlert("", company.CompanyName + @$" yêu cầu duyệt sản phẩm {product.ProductName}", company.WardID, Constants.AlertType.CONFIRM_PRODUCT, true, true);

                string templateAlert = _alertTypeService.HandleTemplate(Constants.AlertType.ID.RequestConfirmProduct, new DataAlertTypeTemplateViewModel
                {
                    Data1 = company.CompanyName,
                    Data2 = product.ProductName
                });

                _alertService.SendToGlobal(HubServerType.Admin, company.ID, Constants.AlertType.ID.RequestConfirmProduct, product.ID, templateAlert, userCurrent.Id, DateTime.Now);

                _logService.SaveLog($"Yêu cầu duyệt sản phẩm {product.ProductName}");

                result.data = new { id = product.ID };

                result.status = 200;

                result.message = "Khóa sản phẩm thành công";
            Error:
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        //[HttpGet(nameof(RequestConfirm))]
        //[ClaimRequirement(new string[] {
        //    FunctionCode.Products + "." + PermissionAction.Create,
        //    FunctionCode.Products + "." + PermissionAction.Update,
        //})]
        //public async Task<IActionResult> RequestConfirm(string id)
        //{
        //    ResultJs<object> result = new ResultJs<object>();

        //    try
        //    {
        //        #region Vaild
        //        Product product = _txngContext.Get<Product>(id);

        //        if (product == null)
        //        {
        //            result.message = "Sản phẩm không tồn tại";

        //            goto Final;
        //        }
        //        #endregion

        //        //product.ConfirmedStatus = ConfirmedStatusConst.Request;

        //        _productService.Updates(product);

        //        Company company = _txngContext.Get<Company>(userCurrent.CompanyID);

        //        //_alertService.SaveAlert("", company.CompanyName + @$" yêu cầu duyệt sản phẩm {product.ProductName}", company.WardID, Constants.AlertType.CONFIRM_PRODUCT, true, true);

        //        string content = _alertTypeService.HandleTemplate(Constants.AlertType.ID.RequestConfirmProduct, new DataAlertTypeTemplateViewModel
        //        {
        //            Data1 = company.CompanyName,
        //            Data2 = product.ProductName
        //        });

        //        _alertService.SendToGlobal(HubServerType.Admin, null, Constants.AlertType.ID.RequestConfirmProduct, product.ID, content, userCurrent.FullName, DateTime.Now);

        //        _logService.SaveLog($"Yêu cầu duyệt sản phẩm {product.ProductName}");

        //        result.data = new { id = product.ID };

        //        result.status = 200;

        //        result.message = "Yêu cầu duyệt sản phẩm thành công";

        //    Final:
        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex);
        //    }
        //}

        #region File
        [HttpPost("UpLoad")]
        [ClaimRequirement(FunctionCode.Products, PermissionAction.Update)]
        [RequestSizeLimit(100000000)]
        public async Task<IActionResult> uploadFile([FromForm] PostImgVdoJs model)
        {
            ResultJs<string> result = new ResultJs<string>();
            try
            {
                if (model == null)
                {
                    result.message = "file rỗng";
                    return Ok(result);
                }
                else
                {
                    if (model.files == null)
                    {
                        result.message = "file rỗng";
                        return Ok(result);
                    }
                }

                result = await _fileProvider.UploadFileAsync(model.files, string.Format(Constants.Path.COMPANY_PRODUCT_IMGS, userCurrent.CompanyID));

                result.status = 200;
                result.message = "Tải file thành công";
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
        #endregion
    }
    #endregion
}