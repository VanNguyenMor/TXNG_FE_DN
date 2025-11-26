import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { routerReducer, routerMiddleware } from "react-router-redux";
import * as UserListStore from "./UserListStore";
import * as AuthenStore from "./AuthenStore";
import * as RoleStore from "./RoleStore";
import * as PriceStore from "./PriceStore";
import * as ZoneStore from "./ZoneStore";
import * as ZoneRoleStore from "./ZoneRoleStore";
import * as SearchDateHistoryStore from "./SearchDateHistoryStore";
import * as LocationStore from "./LocationStore";
import * as NewRegBusStore from "./NewRegBusStore";
import * as CompanyAwaitStore from "./CompanyAwaitStore";
import * as CompanyNotComfirmStore from "./CompanyNotComfirmStore";
import * as FieldStore from "./FieldStore";
import * as InformationStore from "./InformationStore";
import * as AccessStore from "./AccessStore";
import * as CompanyListRegisteredStore from "./CompanyListRegisteredStore";
import * as CompanyListAwaitExpiredStore from "./CompanyListAwaitExpiredStore";
import * as PermissionStore from "./PermissionStore";
import * as CompanyListExpiringStore from "./CompanyListExpiringStore";
import * as CompanyListLockStore from "./CompanyListLockStore";
import * as RegisteredListStore from "./RegisteredListStore";
import * as StampFeeListStore from "./StampFeeListStore";
import * as CompanyListRequestExtendStore from "./CompanyListRequestExtendStore";
import * as CompanyListRequestUnlockStore from "./CompanyListRequestUnlockStore";
import * as BlogListStore from "./BlogListStore";
import * as MenuListStore from "./MenuListStore";
import * as NewsListStore from "./NewsListStore";
import * as StampListStore from "./StampListStore";
import * as StampProvideStore from "./StampProvideStore";
import * as PlantingTypeStore from "./PlantingTypeStore";
import * as CompanyGetDetailsStore from "./CompanyGetDetailsStore";
import * as DashboardStore from "./DashboardStore";
import * as ConfigStore from "./ConfigStore";
import * as CompanyStore from "./CompanyStore";
import * as AreaDataStore from "./AreaDataStore";
import * as AreaRoleStore from "./AreaRoleStore";
import * as TypeZonePropertyStore from "./TypeZonePropertyStore";
import * as CompanyReportsStore from "./CompanyReportsStore";
import * as GrowthStampReportsStore from "./GrowthStampReportsStore";
import * as SaleRegisterReportsStore from "./SaleRegisterReportsStore";
import * as SaleStampReportsStore from "./SaleStampReportsStore";
import * as PlantingZoneStore from "./PlantingZoneStore";
import * as ConfigSystemStore from "./ConfigSystemStore";
import * as MaterialGroupStore from "./MaterialGroupStore";
import * as ConfigWebsiteStore from "./ConfigWebsiteStore";
import * as CompanyListCertifiedStore from "./CompanyListCertifiedStore";
import * as ProductGroupStore from "./ProductGroupStore";
import * as CompanyAreaReportsStore from "./CompanyAreaReportsStore";
import * as ProductReportsStore from "./ProductReportsStore";
import * as UnitStore from "./UnitStore";
import * as StampPlateStore from "./StampPlateStore";
import * as TraceStore from "./TraceStore";
import * as ProductsStore from "./ProductsStore";
import * as PartnerStore from "./PartnerStore";
import * as FieldTypeStore from "./FieldTypeStore";
import * as ReportSPStore from "./ReportSPStore";
import * as ReportSPManangerStore from "./ReportSPManangerStore";

// new
import * as RoleNewStore from "./RoleNewStore";
import * as AccountNewStore from "./AccountNewStore";

import signalRMiddleware from "../utils/signalr";

export default function ConfigureStore(history, initialState) {
  const reducers = {
    UserListStore: UserListStore.reducer,
    AuthenStore: AuthenStore.reducer,
    RoleStore: RoleStore.reducer,
    PriceStore: PriceStore.reducer,
    SearchDateHistory: SearchDateHistoryStore.reducer,
    ZoneStore: ZoneStore.reducer,
    ZoneRoleStore: ZoneRoleStore.reducer,
    LocationStore: LocationStore.reducer,
    NewRegBusStore: NewRegBusStore.reducer,
    CompanyAwaitStore: CompanyAwaitStore.reducer,
    CompanyNotComfirmStore: CompanyNotComfirmStore.reducer,
    FieldStore: FieldStore.reducer,
    InformationStore: InformationStore.reducer,
    AccessStore: AccessStore.reducer,
    CompanyListRegisteredStore: CompanyListRegisteredStore.reducer,
    CompanyListAwaitExpiredStore: CompanyListAwaitExpiredStore.reducer,
    CompanyListExpiringStore: CompanyListExpiringStore.reducer,
    PermissionStore: PermissionStore.reducer,
    CompanyListLockStore: CompanyListLockStore.reducer,
    RegisteredListStore: RegisteredListStore.reducer,
    StampFeeListStore: StampFeeListStore.reducer,
    CompanyListRequestExtendStore: CompanyListRequestExtendStore.reducer,
    CompanyListRequestUnlockStore: CompanyListRequestUnlockStore.reducer,
    CompanyGetDetailsStore: CompanyGetDetailsStore.reducer,
    BlogListStore: BlogListStore.reducer,
    MenuListStore: MenuListStore.reducer,
    NewsListStore: NewsListStore.reducer,
    StampListStore: StampListStore.reducer,
    StampProvideStore: StampProvideStore.reducer,
    PlantingTypeStore: PlantingTypeStore.reducer,
    DashboardStore: DashboardStore.reducer,
    ConfigStore: ConfigStore.reducer,
    CompanyStore: CompanyStore.reducer,
    AreaDataStore: AreaDataStore.reducer,
    AreaRoleStore: AreaRoleStore.reducer,
    TypeZonePropertyStore: TypeZonePropertyStore.reducer,
    CompanyReportsStore: CompanyReportsStore.reducer,
    GrowthStampReportsStore: GrowthStampReportsStore.reducer,
    SaleRegisterReportsStore: SaleRegisterReportsStore.reducer,
    SaleStampReportsStore: SaleStampReportsStore.reducer,
    PlantingZoneStore: PlantingZoneStore.reducer,
    ConfigSystemStore: ConfigSystemStore.reducer,
    MaterialGroupStore: MaterialGroupStore.reducer,
    ConfigWebsiteStore: ConfigWebsiteStore.reducer,
    CompanyListCertifiedStore: CompanyListCertifiedStore.reducer,
    ProductGroupStore: ProductGroupStore.reducer,
    CompanyAreaReportsStore: CompanyAreaReportsStore.reducer,
    ProductReportsStore: ProductReportsStore.reducer,
    UnitStore: UnitStore.reducer,
    StampPlateStore: StampPlateStore.reducer,
    TraceStore: TraceStore.reducer,
    ProductsStore: ProductsStore.reducer,
    PartnerStore: PartnerStore.reducer,
    FieldTypeStore: FieldTypeStore.reducer,
    ReportSPStore: ReportSPStore.reducer,
    ReportSPManangerStore: ReportSPManangerStore.reducer,

    // new
    RoleNewStore: RoleNewStore.reducer,
    AccountNewStore: AccountNewStore.reducer,
  };

  const middleware = [thunk, routerMiddleware(history), signalRMiddleware];

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === "development";
  if (
    isDevelopment &&
    typeof window !== "undefined" &&
    window.devToolsExtension
  ) {
    enhancers.push(window.devToolsExtension());
  }

  const rootReducer = combineReducers({
    ...reducers,
    routing: routerReducer,
  });

  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
}
