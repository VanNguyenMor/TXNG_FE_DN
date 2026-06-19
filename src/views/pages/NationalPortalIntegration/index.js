import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Input,
  Button,
  Table,
  Spinner,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "components/Select";
import SelectSearch, { fuzzySearch } from "react-select-search";
import "react-select-search/style.css";
import { fetchData } from "helpers/fetchData";
import classes from "./index.module.css";

const flattenInformSelects = (parents = []) => {
  const result = [];

  const walk = (items) => {
    (items || []).forEach((item) => {
      if (item?.id) {
        result.push({
          id: item.id,
          name: item.name,
          sortOrder: item.sortOrder,
        });
      }

      if (item?.children?.length) {
        walk(item.children);
      }

      if (item?.informSelects?.length) {
        walk(item.informSelects);
      }
    });
  };

  walk(parents);
  return result;
};

const buildCongViecLabel = (item) => {
  if (item?.tenCongViecCha) {
    return `${item.tenCongViecCha} > ${item.ten}`;
  }
  return item?.ten || "";
};

const buildCongViecMappingsPayload = (congViecMappings = {}) =>
  Object.keys(congViecMappings)
    .filter((key) => congViecMappings[key])
    .map((informSelectId) => ({
      informSelectId,
      npCongViecId: congViecMappings[informSelectId],
    }));

class NationalPortalIntegration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isSaving: false,
      isSavingMappings: false,
      isSyncing: false,
      isCreatingLocation: false,
      companyId: "",
      companyName: "",
      productId: null,
      fieldId: null,
      plantingZoneId: null,
      products: [],
      fields: [],
      provinces: [],
      wards: [],
      isLoadingWards: false,
      gtinCode: "",
      idChuoiCungUng: "",
      idToChuc: "",
      idSanPham: "",
      idNganhHang: "",
      idVungTrong: "",
      existingLocationText: "",
      tenChuoiCungUng: "",
      tenSanPham: "",
      glnCode: "",
      provinceId: null,
      provinceName: "",
      provinceIdRoot: "",
      wardId: null,
      wardName: "",
      street: "",
      lat: "",
      lng: "",
      congViecOptions: [],
      informSelects: [],
      congViecMappings: {},
      isIntegrationConfigured: false,
      isLoadingConfig: false,
    };
  }

  componentDidMount() {
    this.loadInitialData();
  }

  loadInitialData = async () => {
    this.setState({ isLoading: true });

    try {
      const [company, fields, products, provinces] = await Promise.all([
          fetchData.account.getCurrentCompany(),
          fetchData.productManagement.getListFieldComboBox(),
          fetchData.product.getListComboBox(),
          fetchData.nationalPortalIntegration.getProvinces(),
        ]);

      this.setState({
        companyId: company?.company?.id || company?.id || "",
        companyName: company?.company?.companyName || company?.companyName || "",
        fields: fields?.fields || [],
        products: products || [],
        provinces: provinces || [],
      });
    } catch (error) {
      toast.error("Không thể tải dữ liệu ban đầu.");
    } finally {
      this.setState({ isLoading: false });
    }
  };

  resetPortalInfo = () => {
    this.setState({
      isIntegrationConfigured: false,
      fieldId: null,
      plantingZoneId: null,
      gtinCode: "",
      idChuoiCungUng: "",
      idToChuc: "",
      idSanPham: "",
      idNganhHang: "",
      idVungTrong: "",
      glnCode: "",
      tenChuoiCungUng: "",
      tenSanPham: "",
      congViecOptions: [],
      informSelects: [],
      congViecMappings: {},
      existingLocationText: "",
      provinceId: null,
      provinceName: "",
      provinceIdRoot: "",
      wardId: null,
      wardName: "",
      wards: [],
      isLoadingWards: false,
      street: "",
      lat: "",
      lng: "",
    });
  };

  loadInformSelects = async (fieldId, productId, { updateState = true } = {}) => {
    if (!fieldId || !productId) {
      this.setState({ informSelects: [], congViecMappings: {} });
      return { informSelects: [], congViecMappings: {} };
    }

    try {
      const data = await fetchData.nationalPortalIntegration.getInformSelects(
        fieldId,
        productId
      );
      const parents = data?.informSelectParents || [];
      const informSelects = flattenInformSelects(parents).sort(
        (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
      );

      const congViecMappings = {};
      informSelects.forEach((item) => {
        congViecMappings[item.id] = "";
      });

      if (updateState) {
        this.setState({ informSelects, congViecMappings });
      }
      return { informSelects, congViecMappings };
    } catch (error) {
      toast.error("Không thể tải danh sách kê khai.");
      this.setState({ informSelects: [], congViecMappings: {} });
      return { informSelects: [], congViecMappings: {} };
    }
  };

  applyCongViecMappingsFromConfig = (config, informSelects = []) => {
    const congViecMappings = {};
    (informSelects || []).forEach((item) => {
      congViecMappings[item.id] = "";
    });
    (config.congViecMappings || []).forEach((item) => {
      const informSelectId = item.informSelectId || item.InformSelectId;
      const npCongViecId = item.npCongViecId || item.NpCongViecId;
      if (informSelectId) {
        congViecMappings[informSelectId] = npCongViecId || "";
      }
    });
    return congViecMappings;
  };

  loadFieldMappingConfig = async (productId, fieldId, informSelects = []) => {
    const { companyId } = this.state;

    if (!companyId || !productId || !fieldId) {
      return;
    }

    try {
      const result = await fetchData.nationalPortalIntegration.getConfig({
        companyId,
        productId,
        fieldId,
      });
      const config = result?.data || {};
      const congViecMappings = this.applyCongViecMappingsFromConfig(
        config,
        informSelects
      );

      this.setState({
        fieldId,
        informSelects,
        congViecMappings,
      });

      if (!this.state.congViecOptions?.length) {
        const gtinCode = this.state.gtinCode || config.gtinCode || "";
        const idChuoiCungUng =
          this.state.idChuoiCungUng || config.idChuoiCungUng || "";

        if (gtinCode && idChuoiCungUng) {
          await this.runSyncPreview({
            silent: true,
            preserveVungTrong: true,
            preserveCongViecOptions: true,
          });
        }
      }
    } catch (error) {
      toast.error("Không thể tải map công việc đã lưu.");
    }
  };

  loadIntegrationConfig = async (productId) => {
    const { companyId } = this.state;

    if (!companyId || !productId) {
      return;
    }

    this.setState({ isLoadingConfig: true });

    try {
      const result = await fetchData.nationalPortalIntegration.getConfig({
        companyId,
        productId,
      });
      const config = result?.data || {};

      const hasSavedProductInfo =
        config.isConfigured ||
        config.gtinCode ||
        config.idSanPham ||
        config.idToChuc;

      if (!hasSavedProductInfo) {
        return;
      }

      const resolvedFieldId = config.fieldId || config.FieldId || null;

      let informSelectsToUse = [];
      if (resolvedFieldId) {
        const informData = await this.loadInformSelects(resolvedFieldId, productId, {
          updateState: false,
        });
        informSelectsToUse = informData?.informSelects || [];
      }

      const congViecMappings = resolvedFieldId
        ? this.applyCongViecMappingsFromConfig(config, informSelectsToUse)
        : {};

      const gtinCode = (config.gtinCode || "").trim();
      const idChuoiCungUng = (config.idChuoiCungUng || "").trim();

      await new Promise((resolve) =>
        this.setState(
          {
            isIntegrationConfigured: !!config.isConfigured,
            fieldId: resolvedFieldId,
            gtinCode,
            idChuoiCungUng,
            idToChuc: config.idToChuc || "",
            idSanPham: config.idSanPham || "",
            idNganhHang: config.idNganhHang || "",
            idVungTrong: config.idVungTrong || "",
            glnCode: gtinCode,
            plantingZoneId: config.plantingZoneId || null,
            informSelects: informSelectsToUse,
            congViecMappings,
          },
          resolve
        )
      );

      if (gtinCode && idChuoiCungUng) {
        await this.runSyncPreview({
          silent: true,
          preserveVungTrong: true,
          gtinCode,
          idChuoiCungUng,
        });
      }

      if (gtinCode && config.idToChuc) {
        await this.loadLocationByGln(gtinCode, config.idToChuc, false, true);
      }
    } catch (error) {
      toast.error("Không thể tải cấu hình đấu nối đã lưu.");
    } finally {
      this.setState({ isLoadingConfig: false });
    }
  };

  loadPortalInfoForSelection = async () => {
    const { productId } = this.state;

    this.resetPortalInfo();

    if (!productId) {
      return;
    }

    await this.loadIntegrationConfig(productId);
  };

  runSyncPreview = async ({
    silent = false,
    preserveVungTrong = false,
    preserveCongViecOptions = false,
    gtinCode: gtinOverride,
    idChuoiCungUng: idChuoiOverride,
  } = {}) => {
    const gtinCode = (gtinOverride ?? this.state.gtinCode)?.trim();
    const idChuoiCungUng = (idChuoiOverride ?? this.state.idChuoiCungUng)?.trim();
    const { idVungTrong } = this.state;

    if (!gtinCode || !idChuoiCungUng) {
      if (!silent) {
        toast.warning("Vui lòng nhập Mã GTIN và idChuoiCungUng.");
      }
      return false;
    }

    this.setState({ isSyncing: true });

    try {
      const result = await fetchData.nationalPortalIntegration.syncPreview({
        gtinCode: gtinCode.trim(),
        idChuoiCungUng: idChuoiCungUng.trim(),
      });

      if (result?.status !== 200) {
        if (!silent) {
          toast.error(result?.message || "Không đồng bộ được thông tin từ cổng.");
        }
        return false;
      }

      const preview = result?.data || {};
      const trimmedGtin = gtinCode.trim();
      const nextCongViecOptions = (preview.congViecList || []).map((item) => ({
        ...item,
        displayLabel: buildCongViecLabel(item),
      }));

      const nextState = {
        idToChuc: preview.idToChuc || this.state.idToChuc || "",
        idSanPham: preview.idSanPham || this.state.idSanPham || "",
        idNganhHang: preview.idNganhHang || this.state.idNganhHang || "",
        tenChuoiCungUng: preview.tenChuoiCungUng || "",
        tenSanPham: preview.tenSanPham || "",
        glnCode: trimmedGtin,
      };

      if (
        nextCongViecOptions.length ||
        !preserveCongViecOptions ||
        !(this.state.congViecOptions || []).length
      ) {
        nextState.congViecOptions = nextCongViecOptions;
      }

      if (!preserveVungTrong) {
        nextState.idVungTrong = "";
        nextState.existingLocationText = "";
      }

      this.setState(nextState);

      if (!preserveVungTrong && preview.idToChuc) {
        await this.loadLocationByGln(trimmedGtin, preview.idToChuc, false);
      }

      if (!silent) {
        toast.success(result?.message || "Đồng bộ thông tin từ cổng thành công.");
      }

      return true;
    } catch (error) {
      if (!silent) {
        toast.error("Không đồng bộ được thông tin từ cổng.");
      }
      return false;
    } finally {
      this.setState({ isSyncing: false });
    }
  };

  onChangeSelect = (name) => (value) => {
    if (name === "provinceId") {
      this.handleProvinceChange(value);
      return;
    }

    if (name === "wardId") {
      this.handleWardChange(value);
      return;
    }

    this.setState({ [name]: value }, async () => {
      if (name === "productId") {
        await this.loadPortalInfoForSelection();
      }

      if (name === "fieldId") {
        const { productId, fieldId } = this.state;
        if (!productId || !fieldId) {
          this.setState({ informSelects: [], congViecMappings: {} });
          return;
        }
        const informData = await this.loadInformSelects(fieldId, productId);
        await this.loadFieldMappingConfig(
          productId,
          fieldId,
          informData?.informSelects || []
        );
      }
    });
  };

  handleProvinceChange = async (value) => {
    const province = (this.state.provinces || []).find(
      (item) => String(item.id) === String(value)
    );

    this.setState({
      provinceId: value || null,
      provinceName: province?.name || "",
      provinceIdRoot: province?.idRoot || "",
      wardId: null,
      wardName: "",
      wards: [],
      isLoadingWards: !!(province?.idRoot),
    });

    if (!province?.idRoot) {
      if (value) {
        toast.warning("Không xác định được mã tỉnh/thành trên cổng.");
      }
      return;
    }

    try {
      const wards = await fetchData.nationalPortalIntegration.getWards(
        province.idRoot
      );
      this.setState({ wards, isLoadingWards: false });

      if (!wards.length) {
        toast.warning("Không tìm thấy phường/xã cho tỉnh/thành đã chọn.");
      }
    } catch (error) {
      this.setState({ isLoadingWards: false });
      toast.error("Không thể tải danh sách phường/xã từ cổng.");
    }
  };

  handleWardChange = (value) => {
    const ward = (this.state.wards || []).find(
      (item) => String(item.id) === String(value)
    );

    this.setState({
      wardId: value || null,
      wardName: ward?.name || "",
    });
  };

  onChangeInput = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  onChangeCongViecMapping = (informSelectId) => (value) => {
    const { congViecMappings } = this.state;
    this.setState({
      congViecMappings: {
        ...congViecMappings,
        [informSelectId]: value,
      },
    });
  };

  applyLocationResult = (locationData, toastMessage) => {
    const idVungTrong =
      locationData?.idVungTrong || locationData?.IdVungTrong || "";
    const existingLocationText =
      locationData?.diaChiText ||
      locationData?.DiaChiText ||
      locationData?.ten ||
      locationData?.Ten ||
      "";
    const alreadyExists =
      locationData?.alreadyExists || locationData?.AlreadyExists;

    this.setState({
      idVungTrong,
      existingLocationText,
    });

    if (toastMessage) {
      if (alreadyExists) {
        toast.info(toastMessage);
      } else {
        toast.success(toastMessage);
      }
    }
  };

  loadLocationByGln = async (glnCode, idToChuc, showNotFound = false, silent = false) => {
    if (!glnCode?.trim()) {
      return false;
    }

    const result = await fetchData.nationalPortalIntegration.getLocationByGln({
      glnCode: glnCode.trim(),
      idToChuc: idToChuc || "",
    });

    if (result?.status === 200 && (result?.data?.idVungTrong || result?.data?.IdVungTrong)) {
      this.applyLocationResult(
        result.data,
        silent ? null : (result.message || "Đã lấy vùng trồng hiện có trên cổng.")
      );
      return true;
    }

    if (showNotFound) {
      toast.warning(
        result?.message || "Không tìm thấy vùng trồng trên cổng với mã GLN này."
      );
    }

    return false;
  };

  handleSyncPreview = async () => {
    await this.runSyncPreview({ silent: false, preserveVungTrong: false });
  };

  handleCreateLocation = async () => {
    const {
      idToChuc,
      gtinCode,
      glnCode,
      provinceId,
      provinceName,
      wardId,
      wardName,
      street,
      lat,
      lng,
    } = this.state;

    if (!idToChuc) {
      toast.warning("Hãy lấy thông tin cổng trước khi tạo vùng trồng.");
      return;
    }

    const effectiveGln = (glnCode || gtinCode || "").trim();

    if (!effectiveGln || !provinceId || !wardId || !street?.trim()) {
      toast.warning("Vui lòng nhập đủ mã GLN, tỉnh, phường/xã và ấp/đường.");
      return;
    }

    this.setState({ isCreatingLocation: true, glnCode: effectiveGln });

    try {
      const result = await fetchData.nationalPortalIntegration.createLocation({
        idToChuc,
        glnCode: effectiveGln,
        provinceId,
        provinceName,
        wardId,
        wardName,
        street: street.trim(),
        lat: lat ? Number(lat) : null,
        lng: lng ? Number(lng) : null,
      });

      if (result?.status !== 200) {
        toast.error(result?.message || "Không tạo được vùng trồng trên cổng.");
        return;
      }

      this.applyLocationResult(
        result.data,
        result?.message || "Tạo vùng trồng trên cổng thành công."
      );
    } catch (error) {
      toast.error("Không tạo được vùng trồng trên cổng.");
    } finally {
      this.setState({ isCreatingLocation: false });
    }
  };

  handleLoadLocationByGln = async () => {
    const { gtinCode, glnCode, idToChuc } = this.state;
    const effectiveGln = (glnCode || gtinCode || "").trim();

    if (!idToChuc) {
      toast.warning("Hãy lấy thông tin cổng trước.");
      return;
    }

    if (!effectiveGln) {
      toast.warning("Vui lòng nhập mã GTIN trước.");
      return;
    }

    this.setState({ isCreatingLocation: true, glnCode: effectiveGln });

    try {
      await this.loadLocationByGln(effectiveGln, idToChuc, true);
    } finally {
      this.setState({ isCreatingLocation: false });
    }
  };

  validateForm = () => {
    const { companyId, productId, gtinCode, idChuoiCungUng, idVungTrong } =
      this.state;

    if (!companyId) return "Không xác định được doanh nghiệp hiện tại.";
    if (!productId) return "Vui lòng chọn sản phẩm.";
    if (!gtinCode?.trim()) return "Vui lòng nhập mã GTIN.";
    if (!idChuoiCungUng?.trim()) return "Vui lòng nhập idChuoiCungUng.";
    if (!idVungTrong?.trim()) {
      return "Vui lòng tạo vùng trồng trên cổng trước khi lưu.";
    }

    return null;
  };

  handleSave = async () => {
    const validationMessage = this.validateForm();
    if (validationMessage) {
      toast.warning(validationMessage);
      return;
    }

    const {
      companyId,
      productId,
      fieldId,
      plantingZoneId,
      gtinCode,
      idChuoiCungUng,
      idToChuc,
      idSanPham,
      idNganhHang,
      idVungTrong,
      congViecMappings,
    } = this.state;

    const payload = {
      companyId,
      productId,
      fieldId: fieldId || null,
      plantingZoneId: plantingZoneId || null,
      gtinCode: gtinCode.trim(),
      idChuoiCungUng: idChuoiCungUng.trim(),
      idToChuc: idToChuc.trim(),
      idSanPham: idSanPham.trim(),
      idNganhHang: idNganhHang.trim(),
      idVungTrong: idVungTrong.trim(),
      congViecMappings: fieldId
        ? buildCongViecMappingsPayload(congViecMappings)
        : [],
    };

    this.setState({ isSaving: true });

    try {
      const result = await fetchData.nationalPortalIntegration.save(payload);

      if (result?.status === 200) {
        toast.success(result?.message || "Lưu cấu hình đấu nối thành công.");
        this.setState({ isIntegrationConfigured: true });
      } else {
        toast.error(result?.message || "Lưu cấu hình đấu nối thất bại.");
      }
    } catch (error) {
      toast.error("Lưu cấu hình đấu nối thất bại.");
    } finally {
      this.setState({ isSaving: false });
    }
  };

  handleSaveCongViecMappings = async () => {
    const { companyId, productId, fieldId, congViecMappings } = this.state;

    if (!productId) {
      toast.warning("Vui lòng chọn sản phẩm.");
      return;
    }

    if (!fieldId) {
      toast.warning("Vui lòng chọn ngành hàng để map công việc.");
      return;
    }

    const mappings = buildCongViecMappingsPayload(congViecMappings);
    if (!mappings.length) {
      toast.warning("Vui lòng chọn ít nhất một công việc cổng để map.");
      return;
    }

    this.setState({ isSavingMappings: true });

    try {
      const result = await fetchData.nationalPortalIntegration.saveCongViecMappings({
        companyId,
        productId,
        fieldId,
        congViecMappings: mappings,
      });

      if (result?.status === 200) {
        toast.success(result?.message || "Lưu map công việc thành công.");
      } else {
        toast.error(result?.message || "Lưu map công việc thất bại.");
      }
    } catch (error) {
      toast.error("Lưu map công việc thất bại.");
    } finally {
      this.setState({ isSavingMappings: false });
    }
  };

  renderInput = (label, name, placeholder, type = "text") => (
    <div className={classes.formItem}>
      <label className={classes.label}>{label}</label>
      <Input
        type={type}
        value={this.state[name] || ""}
        placeholder={placeholder}
        onChange={this.onChangeInput(name)}
      />
    </div>
  );

  renderAddressSelectSearch = (
    label,
    value,
    placeholder,
    options,
    onChange,
    disabled = false,
    hint = ""
  ) => (
    <div className={classes.formItem}>
      <label className={classes.label}>{label}</label>
      <div className={classes.addressSelect}>
        <SelectSearch
          options={options}
          value={value || ""}
          onChange={onChange}
          search
          filterOptions={fuzzySearch}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
      {hint ? <p className={classes.wardLoading}>{hint}</p> : null}
    </div>
  );

  render() {
    const {
      isLoading,
      isSaving,
      isSavingMappings,
      isSyncing,
      isCreatingLocation,
      companyName,
      products,
      fields,
      provinces,
      wards,
      isLoadingWards,
      isIntegrationConfigured,
      isLoadingConfig,
      productId,
      fieldId,
      provinceId,
      wardId,
      informSelects,
      congViecMappings,
      congViecOptions,
      tenChuoiCungUng,
      tenSanPham,
      gtinCode,
      idChuoiCungUng,
      glnCode,
      idVungTrong,
      existingLocationText,
    } = this.state;

    const effectiveGln = (glnCode || gtinCode || "").trim();

    const provinceOptions = (provinces || []).map((item) => ({
      name: item.name,
      value: item.id,
    }));
    const wardOptions = (wards || []).map((item) => ({
      name: item.name,
      value: item.id,
    }));

    const mappedCount = (informSelects || []).filter(
      (item) => congViecMappings[item.id]
    ).length;

    return (
      <>
        <Container fluid className={classes.page}>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <h3 className="mb-0">Quản lý tích hợp TXNG Quốc gia</h3>
                </CardHeader>
                <CardBody className={classes.cardBody}>
                  {isLoading && (
                    <div className="text-center py-4">
                      <Spinner color="primary" />
                    </div>
                  )}

                  <div className={classes.sectionTitle}>
                    1. Thông tin liên kết nội bộ
                  </div>
                  <div className={classes.formRowTwoCol}>
                    <div className={classes.formItem}>
                      <label className={classes.label}>Doanh nghiệp</label>
                      <div className={classes.readonlyValue}>
                        {companyName || "—"}
                      </div>
                    </div>
                    <div className={classes.formItem}>
                      <label className={classes.label}>Sản phẩm</label>
                      <Select
                        value={productId}
                        className="wrap-insert-or-update-zone-item-select"
                        name="productId"
                        title="Chọn sản phẩm"
                        data={products}
                        labelName="productName"
                        val="id"
                        handleChange={this.onChangeSelect("productId")}
                      />
                    </div>
                  </div>

                  <div className={classes.sectionTitle}>
                    2. Thông tin trên Cổng TXNG Quốc gia
                  </div>
                  {isIntegrationConfigured && (
                    <p className={classes.configuredBadge}>
                      Đã đấu nối — đang hiển thị cấu hình đã lưu
                    </p>
                  )}
                  {isLoadingConfig && (
                    <p className={classes.hint}>Đang tải cấu hình đấu nối...</p>
                  )}
                  <div className={classes.formRow}>
                    {this.renderInput(
                      "Mã GTIN",
                      "gtinCode",
                      "Ví dụ: 8939636000813"
                    )}
                    {this.renderInput(
                      "ID chuỗi cung ứng",
                      "idChuoiCungUng",
                      "Nhập ID chuỗi cung ứng do Cổng TXNG cung cấp"
                    )}
                  </div>
                  <div className={classes.inlineActions}>
                    <Button
                      color="info"
                      disabled={isSyncing || isLoading}
                      onClick={this.handleSyncPreview}
                    >
                      {isSyncing ? "Đang lấy thông tin..." : "Lấy thông tin từ cổng"}
                    </Button>
                  </div>
                  {(tenSanPham || tenChuoiCungUng || gtinCode || isIntegrationConfigured) && (
                    <div className={classes.previewBox}>
                      {tenSanPham && <div>Sản phẩm cổng: {tenSanPham}</div>}
                      {tenChuoiCungUng && (
                        <div>Chuỗi cung ứng: {tenChuoiCungUng}</div>
                      )}
                      {(gtinCode || isIntegrationConfigured) && (
                        <>
                          <div>GTIN: {gtinCode || "—"}</div>
                          <div>idChuoiCungUng: {idChuoiCungUng || "—"}</div>
                          <div>idSanPham: {this.state.idSanPham || "—"}</div>
                          <div>idToChuc: {this.state.idToChuc || "—"}</div>
                        </>
                      )}
                    </div>
                  )}

                  <div className={classes.sectionTitle}>
                    3. Thông tin vùng sản xuất
                  </div>
                  <p className={classes.hint}>
                    Tỉnh/thành và phường/xã lấy từ Cổng TXNG Quốc gia. Mã GLN
                    dùng chung với mã GTIN.
                  </p>
                  <div className={classes.formRowTwoCol}>
                    {this.renderAddressSelectSearch(
                      "Tỉnh/thành phố",
                      provinceId,
                      "Chọn tỉnh/thành phố",
                      provinceOptions,
                      this.onChangeSelect("provinceId")
                    )}
                    {this.renderAddressSelectSearch(
                      "Phường/xã",
                      wardId,
                      provinceId
                        ? "Tìm và chọn phường/xã"
                        : "Vui lòng chọn tỉnh/thành phố trước",
                      wardOptions,
                      this.onChangeSelect("wardId"),
                      !provinceId || isLoadingWards,
                      isLoadingWards ? "Đang tải phường/xã..." : ""
                    )}
                  </div>
                  <div className={classes.formRowTwoCol}>
                    {this.renderInput(
                      "Ấp/đường/thôn",
                      "street",
                      "Ví dụ: Ấp Mỹ Lương"
                    )}
                    <div className={classes.formItem}>
                      <label className={classes.label}>
                        Mã GLN vùng sản xuất
                      </label>
                      <div className={classes.readonlyValue}>
                        {effectiveGln || "Tự động lấy theo mã GTIN"}
                      </div>
                    </div>
                  </div>
                  <div className={classes.formRowTwoCol}>
                    {this.renderInput("Vĩ độ", "lat", "Ví dụ: 10.3756", "number")}
                    {this.renderInput("Kinh độ", "lng", "Ví dụ: 106.3604", "number")}
                  </div>
                  <div className={classes.inlineActions}>
                    <Button
                      color="info"
                      className="mr-2"
                      disabled={isCreatingLocation || isLoading || !effectiveGln}
                      onClick={this.handleLoadLocationByGln}
                    >
                      {isCreatingLocation
                        ? "Đang tra cứu..."
                        : "Lấy vùng sản xuất từ GLN"}
                    </Button>
                    <Button
                      color="secondary"
                      disabled={isCreatingLocation || isLoading}
                      onClick={this.handleCreateLocation}
                    >
                      {isCreatingLocation
                        ? "Đang tạo vùng sản xuất..."
                        : "Tạo vùng sản xuất trên cổng"}
                    </Button>
                  </div>
                  {idVungTrong && (
                    <div className={classes.previewBox}>
                      <div>idVungTrong: {idVungTrong}</div>
                      {existingLocationText ? (
                        <div>Địa chỉ cổng: {existingLocationText}</div>
                      ) : null}
                    </div>
                  )}

                  <div className={classes.sectionTitle}>
                    4. Liên kết công việc thực hiện
                  </div>
                  <p className={classes.hint}>
                    Chọn ngành hàng để hiển thị danh sách kê khai nội bộ, sau đó
                    liên kết từng kê khai với công việc tương ứng trên Cổng TXNG
                    Quốc gia.
                  </p>
                  <div className={classes.formRow}>
                    <div className={classes.formItem}>
                      <label className={classes.label}>Ngành hàng</label>
                      <Select
                        value={fieldId}
                        className="wrap-insert-or-update-zone-item-select"
                        name="fieldId"
                        title="Chọn ngành hàng"
                        data={fields}
                        labelName="fieldName"
                        val="id"
                        handleChange={this.onChangeSelect("fieldId")}
                      />
                    </div>
                  </div>
                  {fieldId && informSelects.length > 0 && congViecOptions.length > 0 && (
                    <div className={classes.mappingSummary}>
                      Đã map {mappedCount}/{informSelects.length} kê khai nội bộ
                      {" · "}
                      {congViecOptions.length} công việc cổng
                    </div>
                  )}
                  {fieldId && (informSelects.length > 0 || congViecOptions.length > 0) && (
                    <div className={classes.formRowTwoCol}>
                      <div className={classes.referencePanel}>
                        <div className={classes.referencePanelTitle}>
                          Kê khai nội bộ ({informSelects.length})
                        </div>
                        <ul className={classes.referenceList}>
                          {(informSelects || []).map((item, index) => (
                            <li key={`internal-${item.id}`}>
                              {index + 1}. {item.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={classes.referencePanel}>
                        <div className={classes.referencePanelTitle}>
                          Công việc cổng ({congViecOptions.length})
                        </div>
                        <ul className={classes.referenceList}>
                          {(congViecOptions || []).map((item, index) => (
                            <li key={`portal-${item.id}`}>
                              {index + 1}. {item.displayLabel || item.ten}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  {!fieldId ? (
                    <p className={classes.hint}>
                      Chọn ngành hàng để hiển thị danh sách kê khai nội bộ và liên
                      kết với công việc tương ứng trên Cổng TXNG Quốc gia.
                    </p>
                  ) : !congViecOptions.length ? (
                    <p className={classes.hint}>
                      Nhấn &quot;Lấy thông tin từ cổng&quot; ở mục 2 để tải danh sách
                      công việc cổng.
                    </p>
                  ) : informSelects.length === 0 ? (
                    <p className={classes.hint}>
                      Không có dữ liệu kê khai cho sản phẩm và ngành hàng đã chọn.
                    </p>
                  ) : (
                    <>
                    <div className={classes.mappingTableWrap}>
                    <Table responsive bordered className={classes.mappingTable}>
                      <thead className={classes.mappingTableHead}>
                        <tr>
                          <th style={{ width: 60 }}>STT</th>
                          <th>Kê khai nội bộ</th>
                          <th>Công việc cổng (chọn map)</th>
                          <th style={{ width: 100 }}>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {informSelects.map((item, index) => {
                          const mappedId = congViecMappings[item.id];
                          const isMapped = !!mappedId;
                          return (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>
                              <Select
                                value={mappedId || null}
                                className="wrap-insert-or-update-zone-item-select"
                                name={`congViec-${item.id}`}
                                title="Chọn công việc cổng"
                                data={congViecOptions}
                                labelName="displayLabel"
                                val="id"
                                handleChange={this.onChangeCongViecMapping(item.id)}
                              />
                            </td>
                            <td>
                              <span
                                className={
                                  isMapped
                                    ? classes.mappingBadgeDone
                                    : classes.mappingBadgePending
                                }
                              >
                                {isMapped ? "Đã map" : "Chưa map"}
                              </span>
                            </td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    </div>
                    <div className={classes.inlineActions}>
                      <Button
                        color="success"
                        disabled={isSavingMappings || isLoading || !mappedCount}
                        onClick={this.handleSaveCongViecMappings}
                      >
                        {isSavingMappings
                          ? "Đang lưu map..."
                          : "Lưu map công việc"}
                      </Button>
                    </div>
                    </>
                  )}

                  <div className={classes.actions}>
                    <Button
                      color="primary"
                      disabled={isSaving || isLoading}
                      onClick={this.handleSave}
                    >
                      {isSaving ? "Đang lưu..." : "Lưu cấu hình đấu nối"}
                    </Button>
                  </div>
                  <div className={classes.pageBottomSpacer} aria-hidden="true" />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
      </>
    );
  }
}

export default NationalPortalIntegration;
