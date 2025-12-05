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
using TXNG.Core.Services.Companies;
using TXNG.Core.Utilities.Interfaces;
using TXNG.Model;
using TXNG.Model.companies;
using TXNG.Model.Companies;
using TXNG.Model.Config;
using TXNG.Model.js;
using TXNG.Model.js.Companies;
using TXNG.Model.js.ManageQR;
using TXNG.Model.Papers;
using TXNG.Model.Products;
using TXNG.Model.StampRequestHistory;
using TXNG.Model.Stamps;
using TXNG.Model.Users;
using TXNG.Model.ViewModels.BadStamp;
using TXNG.Model.ViewModels.Companies;
using TXNG.Model.ViewModels.StampRequestHistory;

namespace TXNG.Website.Controllers
{
    [AuthorizeJWT(policy: PolicyConsts.COMPANY_POLICY)]
    public class ManageQRController : CMSController
    {
        #region Contructor
        private readonly IConfigsService _configsService;
        private readonly ITxngContext _txngContext;
        private readonly ILogService _logService;
        private readonly ICacheService _cacheService;
        private readonly IUserService _userService;
        private readonly IFileProvider _fileProvider;

        private User _userCurrent;

        public ManageQRController(
            IConfigsService configsService,
            ITxngContext txngContext,
            ILogService logService,
            ICacheService cacheService,
            IUserService userService,
            IAlertService alertService,
            IFileProvider fileProvider)
        {

            _configsService = configsService;
            _txngContext = txngContext;
            _logService = logService;
            _cacheService = cacheService;
            _userService = userService;
            _fileProvider = fileProvider;

            _userCurrent = _userService.GetUserCurrent();
        }
        #endregion

        [HttpGet("GetList")]
        public IActionResult GetList(int page = 0, int limit = Constants.Num.LIMIT_MANAGE_QR)
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                try
                {
                    string companyId = _userCurrent.CompanyID;

                    page = page < 0 ? 0 : page;
                    limit = limit <= 0 ? Constants.Num.LIMIT_MANAGE_QR : limit;

                    List<ManageQRViewModel> manageQRViewModels = _txngContext.Query<ManageQRViewModel>(" EXEC dbo.SP_GET_LIST_MANAGE_QR_MOBILE @PAGE, @LIMIT, @COMPANYID ", new
                    {
                        PAGE = page,
                        LIMIT = limit,
                        COMPANYID = companyId
                    }).ToList();

                    int totalCount = _txngContext.Query<int>(" EXEC dbo.SP_GET_COUNT_MANAGE_QR_MOBILE @COMPANYID ", new
                    {
                        COMPANYID = companyId
                    }).FirstOrDefault();

                    resultJs.status = 200;

                    resultJs.message = "Lấy thông tin thành công";

                    resultJs.data = new
                    {
                        qrCodes = manageQRViewModels,
                        totalCount = totalCount
                    };

                    return Ok(resultJs);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("GetListStampRequestComboBox")]
        public IActionResult GetListStampRequestComboBox()
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                try                                     
                {
                    string companyId = _userCurrent.CompanyID;

                    List<StampRequest> manageQRViewModels = _txngContext.Query<StampRequest>(" EXEC dbo.SP_GET_LIST_MANAGE_QR_COMBOBOX_MOBILE @COMPANYID ", new
                    {
                        COMPANYID = companyId
                    }).ToList();

                    resultJs.status = 200;

                    resultJs.message = "Lấy thông tin thành công";

                    resultJs.data = new
                    {
                        stampRequests = manageQRViewModels
                    };

                    return Ok(resultJs);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("GetListHistory")]
        public IActionResult GetListHistory(string stampRequestId, string fromDate, string toDate, int page = 0, int limit = Constants.Num.LIMIT_MANAGE_QR)
        {
            try
            {
                ResultJs<object> resultJs = new ResultJs<object>();

                try
                {
                    string companyId = _userCurrent.CompanyID;

                    page = page < 0 ? 0 : page;
                    limit = limit <= 0 ? Constants.Num.LIMIT_MANAGE_QR : limit;

                    List<StampRequestHistoryViewModel> badStampModels = _txngContext.Query<StampRequestHistoryViewModel>(" EXEC dbo.SP_GET_LIST_HISTORY_STAMP_MOBILE @PAGE, @LIMIT, @COMPANYID, @STAMPREQUESTID, @FROMDATE, @TODATE ", new
                    {
                        PAGE = page,
                        LIMIT = limit,
                        COMPANYID = companyId,
                        STAMPREQUESTID = stampRequestId,
                        FROMDATE = fromDate,
                        TODATE = toDate
                    }).ToList();

                    int totalCount = _txngContext.Query<int>(" EXEC dbo.SP_GET_COUNT_HISTORY_STAMP_MOBILE @COMPANYID, @STAMPREQUESTID, @FROMDATE, @TODATE ", new
                    {
                        COMPANYID = companyId,
                        STAMPREQUESTID = stampRequestId,
                        FROMDATE = fromDate,
                        TODATE = toDate
                    }).FirstOrDefault();

                    resultJs.status = 200;

                    resultJs.message = "Lấy thông tin thành công";

                    resultJs.data = new
                    {
                        qrCodes = badStampModels,
                        totalCount = totalCount
                    };

                    return Ok(resultJs);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}