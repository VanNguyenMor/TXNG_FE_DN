import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { bindActionCreators } from "redux";
import compose from 'recompose/compose';
import { connect } from "react-redux";
import { actionConfigWebsite } from "../../../actions/ConfigWebsiteAction";
import Select from "components/Select";
import '../../../assets/css/page/config_system.css';
import ButtonSave from "../../../assets/img/buttons/btnLuuLocBui.png";
import ButtomAdd from "../../../assets/img/buttons/btnThemMoiLocBui.png";
import ButtonEdit from "../../../assets/img/buttons/edit.svg";
import ButtonDelete from "../../../assets/img/buttons/delete.png";
import InsertOrUpdate from './InsertOrUpdate';
import Loading from '../../../components/loading';
import './WebConfig.css'
import { getErrorMessageServer } from 'utils/errorMessageServer';
import Message, { TYPES } from '../../../components/message';
import { validEmail } from 'bases/helper';
import { validPhone } from 'bases/helper';
import { numberWithCommas, replaceCommaDot } from 'bases/helper';
import { validExtensionFileImage } from 'bases/helper';
import { validSize } from 'bases/helper';
import { MAX_FILE_IMAGE_SIZE } from 'bases/helper';
import { EXTENSION_FILE_IMAGE } from 'bases/helper';
import classes from './index.module.css';
import MenuButton from "../../../assets/img/buttons/menu.png";
import moment from 'moment';
import SaveIcon1 from "../../../assets/img/buttons/save.svg";
import PlusImg from "../../../assets/img/buttons/chonhinh.svg";
import CloseIcon from "../../../assets/img/buttons/xoahinh.svg";
import PopupMessage from "../../../components/PopupMessage";
import { CONFIG_WEBSITE_UPDATE_IMG } from "../../../apis";
import axios from "axios";
import NoImg from "../../../assets/img/NoImg/NoImg.jpg"


import {
	Card,
	Table,
	Container,
	Row,
	Spinner,
	Button,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	InputGroup
} from "reactstrap";

class WebConfig extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentTab: 0,
			mfileImg: '',
			pathImage: '',
			pathImageDefaul: '',
			ArrayFileAdd: '',
			fileImage: '',
			infoConfig: {
				aboutUs: '',
				banner: '',
				bigText: '',
				contentPage: '',
				contractUS: '',
				email: '',
				footer: '',
				mapLink: '',
				phoneNumber: '',
				smallText: '',
				timeUs: '',
				welcomeText: '',
				workTime: ''
			},
			errorsInfoConfig: {},
		}

		this.refEditorAboutUS = null;
		this.refEditorContactUS = null;
		this.refEditorTimeUS = null;
		this.refEditorContentPage = null;
		this.refFileImage = null;
	}

	componentDidMount() {
		this.getInfoConfig();
	}

	onChooseTab = tab => () => {
		const { infoConfig } = this.state;
		this.setState(previousState => {
			return {
				...previousState,
				currentTab: tab,
			}
		}
		);
		if (tab == 1) {
			infoConfig.contentPage = (this.refEditorContentPage) ? (this.refEditorContentPage.getContent()) : infoConfig.contentPage;
			infoConfig.timeUs = (this.refEditorTimeUS) ? (this.refEditorTimeUS.getContent()) : infoConfig.timeUs;
			infoConfig.aboutUs = (this.refEditorAboutUS) ? (this.refEditorAboutUS.getContent()) : infoConfig.aboutUs;
			infoConfig.contractUS = (this.refEditorContactUS) ? (this.refEditorContactUS.getContent()) : infoConfig.contractUS;

			this.setState(previousState => {
				return {
					...previousState,
					infoConfig
				}
			})
		} else if (tab == 0) {
			//console.log(this.state.infoConfig)
		}
	}

	// 2

	// 1
	getInfoConfig = async () => {
		const { requestGetConfigWebsite } = this.props;

		const infoConfig = await requestGetConfigWebsite();

		const data = (infoConfig.data || {}).data || {};
		//console.log(data)
		if (data.banner) {
			const pIm = data.banner;
			const spl = pIm.split(';')
			this.setState(previousState => {
				return {
					...previousState,
					pathImageDefaul: spl
				}
			})
		}
		this.setState(previousState => {

			return {
				...previousState,
				fileImage: data.banner,
				infoConfig: {
					aboutUs: data.aboutUs,
					contractUS: data.contractUS,
					banner: data.banner,
					bigText: data.bigText,
					contentPage: data.contentPage,
					email: data.email,
					footer: data.footer,
					mapLink: data.mapLink,
					phoneNumber: data.phoneNumber,
					smallText: data.smallText,
					timeUs: data.timeUs,
					welcomeText: data.welcomeText,
					workTime: data.workTime,
				},

			}
		});
	}

	checkValidateFormInfoConfig = () => {
		const { infoConfig, pathImageDefaul } = this.state;
		const errorsInfoConfig = {};
		const refAboutUS = this.refEditorAboutUS.getContent() || '';
		const refTimeUS = this.refEditorTimeUS.getContent() || '';
		const refContentPage = this.refEditorContentPage.getContent() || '';
		const refContactUS = this.refEditorContactUS.getContent() || '';
		const vlrefAboutUS = refAboutUS != "" ? refAboutUS : infoConfig.aboutUs
		const vlrefTimeUS = refTimeUS != "" ? refTimeUS : infoConfig.timeUs
		const vlrefContentPage = refContentPage != "" ? refContentPage : infoConfig.contentPage
		const vlrefContactUS = refContactUS != "" ? refContactUS : infoConfig.contractUS

		if (!infoConfig.phoneNumber) {
			errorsInfoConfig.phoneNumber = "Không được bỏ trống"
		}

		if (!infoConfig.workTime) {
			errorsInfoConfig.workTime = "Không được bỏ trống"
		}

		if (!infoConfig.welcomeText) {
			errorsInfoConfig.welcomeText = "Không được bỏ trống"
		}

		if (!infoConfig.smallText) {
			errorsInfoConfig.smallText = "Không được bỏ trống"
		}

		if (!infoConfig.footer) {
			errorsInfoConfig.footer = "Không được bỏ trống"
		}

		if (!infoConfig.email) {
			errorsInfoConfig.email = "Không được bỏ trống"
		}

		if (!infoConfig.mapLink) {
			errorsInfoConfig.mapLink = "Không được bỏ trống"
		}

		if (!infoConfig.bigText) {
			errorsInfoConfig.bigText = "Không được bỏ trống"
		}

		if (!vlrefAboutUS) {
			errorsInfoConfig.aboutUs = "Không được bỏ trống"
		}

		if (!vlrefTimeUS) {
			errorsInfoConfig.timeUs = "Không được bỏ trống"
		}

		if (!vlrefContentPage) {
			errorsInfoConfig.contentPage = "Không được bỏ trống"
		}

		if (!vlrefContactUS) {
			errorsInfoConfig.contactUs = "Không được bỏ trống"
		}

		return errorsInfoConfig;
	}

	onChangeFileImage = e => {
		const { id, pathImageDefaul } = this.state;
		const files = e.target.files || [];
		if (files.length > 0) {
			// const file = files[0] || null;
			const file = files || null;
			if (file) {
				const errorsInfoConfig = {};

				this.setState(previousState => {
					return {
						...previousState,
						errorsInfoConfig
					}
				});
				for (let i = 0; i < file.length; i++) {
					if (!validSize(file[i].size, MAX_FILE_IMAGE_SIZE)) {
						errorsInfoConfig.banner = 'Kích thước ảnh phải nhỏ hơn hoặc bằng ' + MAX_FILE_IMAGE_SIZE + ' mb';
					}
					if (!validExtensionFileImage(file[i].name)) {
						errorsInfoConfig.banner = 'File hình ảnh sai định dạng ' + EXTENSION_FILE_IMAGE.join(', ');
					}
				}
				this.setState(previousState => {
					return {
						...previousState,
						errorsInfoConfig
					}
				});

				if (Object.keys(errorsInfoConfig).length > 0) {
					return;
				}
				if (this.state.mfileImg != '') {
					let _mfileImg = [...this.state.mfileImg];
					for (let i = 0; i < files.length; i++) {
						_mfileImg.push(new File([files[i]], files[i].name, { type: files[i].type }));
					}
					this.setState(previousState => {
						return {
							...previousState,
							mfileImg: _mfileImg
						}
					})
				} else {
					this.setState({ mfileImg: files })
				}
				const pathImage = Array.from(files).map((ee) => URL.createObjectURL(ee));
				if (this.state.ArrayFileAdd != '') {
					let _ArrayFileAdd = this.state.ArrayFileAdd;
					for (let i = 0; i < files.length; i++) {
						_ArrayFileAdd.push(pathImage[i]);
					}
				} else {
					this.setState({ ArrayFileAdd: pathImage })
				}
				// if (id) {
				if (pathImageDefaul) {
					this.setState(previousState => {
						return {
							...previousState,
							pathImageDefaul: this.state.pathImageDefaul.concat(pathImage)
						}
					});
				} else {
					this.setState(previousState => {
						return {
							...previousState,
							pathImageDefaul: pathImage
						}
					});
				}
				// } else {
				//     this.setState(previousState => {
				//         return {
				//             ...previousState,
				//             pathImageDefaul: pathImage
				//         }
				//     });
				// }

			}
		}
	}

	onDeleteFileImage = (e) => {
		const { pathImageDefaul, fileImage, ArrayFileAdd } = this.state;
		var array = [...pathImageDefaul]
		var index = array.indexOf(e);
		if (index !== -1) {
			array.splice(index, 1);
			this.setState({
				pathImageDefaul: array,
			});
		}

		let flah = false;
		if (fileImage) {
			const spl = fileImage.split(';')
			Array.from(spl).filter(x => x === e).map(
				item => { flah = true }
			)

			if (flah == true) {
				spl.splice(spl.indexOf(e), 1);
				var fileImageSend = spl.join(';')
				this.setState(previousState => {
					return {
						...previousState,
						fileImage: fileImageSend
					}
				})
			}
		}

		let flag = false;
		if (ArrayFileAdd) {
			Array.from(ArrayFileAdd).filter(x => x === e).map(
				item => {
					flag = true
				}
			)

			if (flag == true) {
				ArrayFileAdd.splice(ArrayFileAdd.indexOf(e), 1);
				let _ArrayFileAdd = [];
				for (let i = 0; i < ArrayFileAdd.length; i++) {
					fetch(ArrayFileAdd[i]).then(res => res.blob()).then(blob => {
						_ArrayFileAdd.push(new File([blob], `${ArrayFileAdd[i].replace('blob:http://localhost:5000/')}.jpeg`,
							{ lastModified: new Date().getTime(), type: 'image/jpeg' }));
					});
				}

				this.setState(previousState => {
					return {
						...previousState,
						mfileImg: _ArrayFileAdd
					}
				})
			}

		}
	}

	onChangeValueInfoConfig = name => e => {
		const value = e.target.value;
		if (name === null || name === "null") { name = "" }
		this.setState(previousState => {
			return {
				...previousState,
				infoConfig: {
					...previousState.infoConfig,
					[name]: value
				}
			}
		});
	}

	onUpdateFileImage = () => {
		this.refFileImage.click();
	}



	onSaveInfoConfig = () => {
		const errorsInfoConfig = this.checkValidateFormInfoConfig();
		const { mfileImg, fileImage } = this.state;
		this.setState(previousState => {
			return {
				...previousState,
				errorsInfoConfig
			}
		});

		if (Object.keys(errorsInfoConfig).length > 0) {
			this.setState({ messageNoti: 'Vui lòng kiểm tra lại các ô nhập liệu' })
			this.toggleModal('popupMessage')
			return;
		}

		const { infoConfig } = this.state;

		const formData = new FormData();

		const refAboutUS = this.refEditorAboutUS.getContent();
		const refTimeUS = this.refEditorTimeUS.getContent();
		const refContentPage = this.refEditorContentPage.getContent();
		const refContactUS = this.refEditorContactUS.getContent();

		formData.append('BigText', (infoConfig.bigText) != "null" || (infoConfig.bigText) != null ? (infoConfig.bigText) : "");
		formData.append('Email', (infoConfig.email) != "null" || (infoConfig.email) != null ? (infoConfig.email) : "");
		formData.append('Footer', (infoConfig.footer) != "null" || (infoConfig.footer) != null ? (infoConfig.footer) : "");
		formData.append('MapLink', (infoConfig.mapLink) != "null" || (infoConfig.mapLink) != null ? (infoConfig.mapLink) : "");
		formData.append('PhoneNumber', (infoConfig.phoneNumber) != "null" || (infoConfig.phoneNumber) != null ? (infoConfig.phoneNumber) : "");
		formData.append('SmallText', (infoConfig.smallText) != "null" || (infoConfig.smallText) != null ? (infoConfig.smallText) : "");
		formData.append('WelcomeText', (infoConfig.welcomeText) != "null" || (infoConfig.welcomeText) != null ? (infoConfig.welcomeText) : "");
		formData.append('WorkTime', (infoConfig.workTime) != "null" || (infoConfig.workTime) != null ? (infoConfig.workTime) : "");
		formData.append('Banner', (fileImage) != "null" || (fileImage) != null ? (fileImage) : "");
		formData.append('AboutUs', (refAboutUS) == "" ? infoConfig.aboutUs : refAboutUS);
		formData.append('TimeUs', (refTimeUS) == "" ? infoConfig.timeUs : refTimeUS);
		formData.append('ContentPage', (refContentPage) == "" ? infoConfig.contentPage : refContentPage);
		formData.append('ContractUS', (refContactUS) == "" ? infoConfig.contractUS : refContactUS);

		if (mfileImg) {
			for (let i = 0; i < mfileImg.length; i++) {
				formData.append(`BannerFiles`, (this.refFileImage && this.refFileImage.files) ? mfileImg[i] : null)
			}
		}

		Loading.show();

		this.props.requestUpdateConfigWebsite(formData).then(res => {
			Loading.close();

			const data = (res.data || {});

			if (data.status == 200) {
				//Message.show(TYPES.SUCCESS, 'Cập nhật thông tin thành công');
				document.location.href = '/trang_chu/web_config'
			} else {
				const message = getErrorMessageServer(res);
				this.setState({ messageNoti: message || 'Hệ thống trục trặc' })
				this.toggleModal('popupMessage')
				//Message.show(TYPES.ERROR, 'Thông báo', message || 'Hệ thống trục trặc');
			}
		});
	}

	toggleModal = (state, type) => {
		if (this.state[state] && type == 1) {
			return;
		} else {
			this.setState({
				[state]: !this.state[state],
				detail: null,
				errorUpdate: {},
				errorInsert: {},

			});
		}
	};

	render() {
		const {
			errorsInfoConfig,
			currentTab,
			infoConfig,
			popupMessage,
			pathImageDefaul,
			messageNoti
		} = this.state;

		let isDisableEdit = true;
		let ACCOUNT_CLAIM_FF = [];
		if (JSON.parse(localStorage.getItem('IS_ADMIN'))) {
			isDisableEdit = false;
		} else {
			ACCOUNT_CLAIM_FF = localStorage.getItem('ACCOUNT_CLAIM_FF').split(',').filter(x => x != "");

			ACCOUNT_CLAIM_FF.filter(x => x == "WebConfig.Edit").map(y => isDisableEdit = false)
		}

		return (
			<div className='config-system'>
				<div className='config-system-tab'>
					<div onClick={this.onChooseTab(0)} className={`config-system-tab-item config-system-tab-item-button ${currentTab == 0 ? 'active' : ''}`}>CÀI ĐẶT NỘI DUNG WEBSITE</div>
					<div onClick={this.onChooseTab(1)} className={`config-system-tab-item config-system-tab-item-button ${currentTab == 1 ? 'active' : ''}`}>CÀI ĐẶT BANNER</div>
				</div>
				<div className='config-system-content'>
					{currentTab == 0 ? (
						<div className='config-system-content-info-company'>
							<h3>Header Website</h3>
							<div className='config-system-content-info-company-item'>
								<label className='config-system-content-info-company-item-label '>Chào mừng</label>
								<div className='config-system-content-info-company-item-box'>
									<InputGroup className="input-group-alternative css-border-input ">
										<input autoFocus={true} onChange={this.onChangeValueInfoConfig('welcomeText')} value={infoConfig.welcomeText} className='config-system-content-info-company-item-input css-border-webConfig' type="text" />
									</InputGroup>

									<p className='form-error-message'>{errorsInfoConfig.welcomeText}</p>
								</div>
							</div>
							<div className='config-system-content-info-company-item'>
								<label className='config-system-content-info-company-item-label'>Số điện thoại</label>
								<div className='config-system-content-info-company-item-box'>
									<InputGroup className="input-group-alternative css-border-input">
										<input onChange={this.onChangeValueInfoConfig('phoneNumber')} value={infoConfig.phoneNumber} className='config-system-content-info-company-item-input css-border-webConfig' type="text" />
									</InputGroup>

									<p className='form-error-message'>{errorsInfoConfig.phoneNumber}</p>
								</div>
							</div>
							<div className='config-system-content-info-company-item'>
								<label className='config-system-content-info-company-item-label'>Giờ làm việc</label>
								<div className='config-system-content-info-company-item-box'>
									<InputGroup className="input-group-alternative css-border-input">
										<input onChange={this.onChangeValueInfoConfig('workTime')} value={infoConfig.workTime} className='config-system-content-info-company-item-input css-border-webConfig' type="text" />
									</InputGroup>

									<p className='form-error-message'>{errorsInfoConfig.workTime}</p>
								</div>
							</div>
							<div className='config-system-content-info-company-item'>
								<label className='config-system-content-info-company-item-label'>Email</label>
								<div className='config-system-content-info-company-item-box'>
									<InputGroup className="input-group-alternative css-border-input">
										<input onChange={this.onChangeValueInfoConfig('email')} value={infoConfig.email} className='config-system-content-info-company-item-input css-border-webConfig' type="text" />
									</InputGroup>

									<p className='form-error-message'>{errorsInfoConfig.email}</p>
								</div>
							</div>

							<h3>Phần liên hệ</h3>
							<div className='config-system-content-info-company-item'>
								<label className='config-system-content-info-company-item-label'>Cột 1</label>
								<div className='config-system-content-config-system-item-box'>
									<InputGroup className="input-group-alternative css-border-input ">
										<Editor onInit={(_, editor) => {
											this.refEditorAboutUS = editor;
										}}
											initialValue={infoConfig.aboutUs}
											init={{
												width: '100%',
												height: 300,
												menubar: false,
												toolbar: 'undo redo | formatselect | image | link | code | ' +
													'bold italic forecolor backcolor | alignleft aligncenter ' +
													'alignright alignjustify | bullist numlist outdent indent | ' +
													'removeformat | help',
												content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
												selector: 'textarea#file-picker',
												plugins: 'image code link',
												image_title: true,

												automatic_uploads: true,
												file_picker_types: 'image',
												file_picker_callback: (cb, value, meta) => {
													let _this = this;

													var input = document.createElement('input');
													input.setAttribute('type', 'file');
													input.setAttribute('accept', 'image/*');
													input.onchange = async function () {
														var file = this.files[0];
														var reader = new FileReader();
														reader.onload = function () {
															var id = 'blobid' + (new Date()).getTime();
															var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
															var base64 = reader.result.split(',')[1];
															var blobInfo = blobCache.create(id, file, base64);
															blobCache.add(blobInfo);
															cb(blobInfo.blobUri(), { title: file.name });
														};
														let data = null;
														let imageFile = new FormData();
														let fileLink = null;
														imageFile.append('files', file);

														try {
															data = await axios({
																method: 'post',
																url: CONFIG_WEBSITE_UPDATE_IMG,
																headers: {
																	authorization: localStorage.getItem('TOKEN')
																},
																data: imageFile
															})
															if (data.data.status == 200) {
																fileLink = data.data.data;
																cb(fileLink);
															} else {
																_this.setState({ messageNoti: 'Lỗi hệ thống' })
																_this.toggleModal('popupMessage')
																return;
															}
														} catch (error) {
															_this.setState({ messageNoti: 'Lỗi hệ thống' })
															_this.toggleModal('popupMessage')
															return;
														}

														//reader.readAsDataURL(file);
													};

													input.click();

												},
											}}
										/>
									</InputGroup>

									<p className='form-error-message'>{errorsInfoConfig.aboutUs}</p>
								</div>
							</div>
							<div className='config-system-content-info-company-item'>
								<label className='config-system-content-info-company-item-label'>Cột 2</label>
								<div className='config-system-content-config-system-item-box'>
									<InputGroup className="input-group-alternative css-border-input">
										<Editor onInit={(_, editor) => {
											this.refEditorContactUS = editor;
										}}
											initialValue={infoConfig.contractUS}
											init={{
												width: '100%',
												height: 300,
												menubar: false,
												toolbar: 'undo redo | formatselect | image | link | code | ' +
													'bold italic forecolor backcolor | alignleft aligncenter ' +
													'alignright alignjustify | bullist numlist outdent indent | ' +
													'removeformat | help',
												content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
												selector: 'textarea#file-picker',
												plugins: 'image code link',
												image_title: true,

												automatic_uploads: true,
												file_picker_types: 'image',
												file_picker_callback: (cb, value, meta) => {
													let _this = this;

													var input = document.createElement('input');
													input.setAttribute('type', 'file');
													input.setAttribute('accept', 'image/*');
													input.onchange = async function () {
														var file = this.files[0];
														var reader = new FileReader();
														reader.onload = function () {
															var id = 'blobid' + (new Date()).getTime();
															var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
															var base64 = reader.result.split(',')[1];
															var blobInfo = blobCache.create(id, file, base64);
															blobCache.add(blobInfo);
															cb(blobInfo.blobUri(), { title: file.name });
														};
														let data = null;
														let imageFile = new FormData();
														let fileLink = null;
														imageFile.append('files', file);

														try {
															data = await axios({
																method: 'post',
																url: CONFIG_WEBSITE_UPDATE_IMG,
																headers: {
																	authorization: localStorage.getItem('TOKEN')
																},
																data: imageFile
															})
															if (data.data.status == 200) {
																fileLink = data.data.data;
																cb(fileLink);
															} else {
																_this.setState({ messageNoti: 'Lỗi hệ thống' })
																_this.toggleModal('popupMessage')
																return;
															}
														} catch (error) {
															_this.setState({ messageNoti: 'Lỗi hệ thống' })
															_this.toggleModal('popupMessage')
															return;
														}

														//reader.readAsDataURL(file);
													};

													input.click();

												},
											}}
										/>
									</InputGroup>

									<p className='form-error-message'>{errorsInfoConfig.contactUs}</p>
								</div>
							</div>
							<div className='config-system-content-info-company-item'>
								<label className='config-system-content-info-company-item-label'>Cột 3</label>
								<div className='config-system-content-config-system-item-box'>
									<InputGroup className="input-group-alternative css-border-input">
										<Editor onInit={(_, editor) => {
											this.refEditorTimeUS = editor;
										}}
											initialValue={infoConfig.timeUs}
											init={{
												width: '100%',
												height: 300,
												menubar: false,
												toolbar: 'undo redo | formatselect | image | link | code | ' +
													'bold italic forecolor backcolor | alignleft aligncenter ' +
													'alignright alignjustify | bullist numlist outdent indent | ' +
													'removeformat | help',
												content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
												selector: 'textarea#file-picker',
												plugins: 'image code link',
												image_title: true,

												automatic_uploads: true,
												file_picker_types: 'image',
												file_picker_callback: (cb, value, meta) => {
													let _this = this;

													var input = document.createElement('input');
													input.setAttribute('type', 'file');
													input.setAttribute('accept', 'image/*');
													input.onchange = async function () {
														var file = this.files[0];
														var reader = new FileReader();
														reader.onload = function () {
															var id = 'blobid' + (new Date()).getTime();
															var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
															var base64 = reader.result.split(',')[1];
															var blobInfo = blobCache.create(id, file, base64);
															blobCache.add(blobInfo);
															cb(blobInfo.blobUri(), { title: file.name });
														};
														let data = null;
														let imageFile = new FormData();
														let fileLink = null;
														imageFile.append('files', file);

														try {
															data = await axios({
																method: 'post',
																url: CONFIG_WEBSITE_UPDATE_IMG,
																headers: {
																	authorization: localStorage.getItem('TOKEN')
																},
																data: imageFile
															})
															if (data.data.status == 200) {
																fileLink = data.data.data;
																cb(fileLink);
															} else {
																_this.setState({ messageNoti: 'Lỗi hệ thống' })
																_this.toggleModal('popupMessage')
																return;
															}
														} catch (error) {
															_this.setState({ messageNoti: 'Lỗi hệ thống' })
															_this.toggleModal('popupMessage')
															return;
														}

														//reader.readAsDataURL(file);
													};

													input.click();

												},
											}} />
									</InputGroup>

									<p className='form-error-message'>{errorsInfoConfig.timeUs}</p>
								</div>
							</div>
							<h3>Maps</h3>
							<div className='config-system-content-info-company-item'>
								<label className='config-system-content-info-company-item-label'>Link embed</label>
								<div className='config-system-content-info-company-item-box'>
									<InputGroup className="input-group-alternative css-border-input">
										<input onChange={this.onChangeValueInfoConfig('mapLink')} value={infoConfig.mapLink} className='config-system-content-info-company-item-input css-border-webConfig' type="text" />
									</InputGroup>

									<p className='form-error-message'>{errorsInfoConfig.mapLink}</p>
								</div>
							</div>
							<h3>Footer Website</h3>
							<div className='config-system-content-info-company-item'>
								<label className='config-system-content-info-company-item-label'>Nội dung Footer</label>
								<div className='config-system-content-info-company-item-box'>
									<InputGroup className="input-group-alternative css-border-input">
										<input onChange={this.onChangeValueInfoConfig('footer')} value={infoConfig.footer} className='config-system-content-info-company-item-input css-border-webConfig' type="text" />
									</InputGroup>

									<p className='form-error-message'>{errorsInfoConfig.footer}</p>
								</div>
							</div>
							<h3>Page liên hệ</h3>
							<div className='config-system-content-info-company-item'>
								<label className='config-system-content-info-company-item-label'>Nội dung</label>
								<div className='config-system-content-config-system-item-box'>
									<InputGroup className="input-group-alternative css-border-input">
										<Editor onInit={(_, editor) => {
											this.refEditorContentPage = editor;
										}}
											initialValue={infoConfig.contentPage}
											init={{
												width: '100%',
												height: 300,
												menubar: false,
												toolbar: 'undo redo | formatselect | image | link | code | ' +
													'bold italic forecolor backcolor | alignleft aligncenter ' +
													'alignright alignjustify | bullist numlist outdent indent | ' +
													'removeformat | help',
												content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
												selector: 'textarea#file-picker',
												plugins: 'image code link',
												image_title: true,

												automatic_uploads: true,
												file_picker_types: 'image',
												file_picker_callback: (cb, value, meta) => {
													let _this = this;

													var input = document.createElement('input');
													input.setAttribute('type', 'file');
													input.setAttribute('accept', 'image/*');
													input.onchange = async function () {
														var file = this.files[0];
														var reader = new FileReader();
														reader.onload = function () {
															var id = 'blobid' + (new Date()).getTime();
															var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
															var base64 = reader.result.split(',')[1];
															var blobInfo = blobCache.create(id, file, base64);
															blobCache.add(blobInfo);
															cb(blobInfo.blobUri(), { title: file.name });
														};
														let data = null;
														let imageFile = new FormData();
														let fileLink = null;
														imageFile.append('files', file);

														try {
															data = await axios({
																method: 'post',
																url: CONFIG_WEBSITE_UPDATE_IMG,
																headers: {
																	authorization: localStorage.getItem('TOKEN')
																},
																data: imageFile
															})
															if (data.data.status == 200) {
																fileLink = data.data.data;
																cb(fileLink);
															} else {
																_this.setState({ messageNoti: 'Lỗi hệ thống' })
																_this.toggleModal('popupMessage')
																return;
															}
														} catch (error) {
															_this.setState({ messageNoti: 'Lỗi hệ thống' })
															_this.toggleModal('popupMessage')
															return;
														}

														//reader.readAsDataURL(file);
													};

													input.click();

												},
											}} />
									</InputGroup>

									<p className='form-error-message'>{errorsInfoConfig.contentPage}</p>
								</div>
							</div>
							<div className='config-system-content-config-system-item-function'>
								{isDisableEdit == true ? null : (
									<Button
										color="default"
										type="button"
										className={`btn-success-cs`}
										style={{ margin: "inherit" }}
										onClick={this.onSaveInfoConfig}
									>
										<img src={SaveIcon1} alt='Lưu lại' />
										<span>Lưu lại</span>
									</Button>
								)}
							</div>
						</div>
					) : null}
					{currentTab == 1 ? (
						<div className='config-system-content-config-system'>
							<div className='wrap-manage-company-body-item'>
								<input onChange={this.onChangeFileImage} multiple ref={ref => this.refFileImage = ref} id='image' type='file' className='hidden' style={{
									display: 'none'
								}} />
								<label className='wrap-manage-company-body-item-label wrap-manage-company-body-item-label-image'>Hình banner</label>
								<div className='wrap-manage-company-body-item-box'>
									<div className='wrap-manage-company-body-item-box-function'
										style={{ justifyContent: 'flex-start', padding: 5 }}>
										<Button
											type="button"
											size="lg"
											style={{ margin: 0 }}
											className='btn-primary-cs'
											onClick={this.onUpdateFileImage}>
											<img src={PlusImg} alt='Thêm mới' />
											<span>Chọn hình</span>
										</Button>
										<p className="form-error-message" style={{ marginLeft: 5 }}>{errorsInfoConfig.banner || ''}</p>
									</div>
									<div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
										{pathImageDefaul != '' ? (
											pathImageDefaul.map((e) => (
												e != "" ?
													(
														<div>
															<img className='wrap-manage-company-body-item-image' src={e} style={{ padding: 5 }} />
															<div style={{ padding: 5 }}>
																<Button
																	color="default"
																	data-dismiss="modal"
																	type="button"
																	className={`btn-danger-cs`}
																	onClick={() => this.onDeleteFileImage(e)}
																>
																	<img src={CloseIcon} alt='Thoát ra' />
																	<span>Xóa hình</span>
																</Button>
															</div>
														</div>
													)
													: null
											))
										) : (
											<img className='wrap-manage-company-body-item-image' style={{ padding: 5 }} src={NoImg} />
										)
										}
									</div>
								</div>
							</div>

							<div className='config-system-content-config-system-item'>
								<label className='config-system-content-config-system-item-label'>Chữ lớn</label>
								<div className='config-system-content-config-system-item-box'>
									<InputGroup className="input-group-alternative css-border-input">
										<textarea onChange={this.onChangeValueInfoConfig('bigText')} value={infoConfig.bigText} rows="3" type='text' className='config-system-content-config-system-item-textarea css-border-webConfig'></textarea>
									</InputGroup>

									<p className='form-error-message'>{errorsInfoConfig.bigText}</p>
								</div>
							</div>
							<div className='config-system-content-config-system-item'>
								<label className='config-system-content-config-system-item-label'>Chữ nhỏ</label>
								<div className='config-system-content-config-system-item-box'>
									<InputGroup className="input-group-alternative css-border-input">
										<textarea onChange={this.onChangeValueInfoConfig('smallText')} value={infoConfig.smallText} rows="3" type='text' className='config-system-content-config-system-item-textarea css-border-webConfig'></textarea>
									</InputGroup>

									<p className='form-error-message'>{errorsInfoConfig.smallText}</p>
								</div>
							</div>
							<div className='config-system-content-config-system-item-function'>
								{isDisableEdit == true ? null : (
									<Button
										color="default"
										type="button"
										className={`btn-success-cs`}
										style={{ margin: "inherit" }}
										onClick={this.onSaveInfoConfig}
									>
										<img src={SaveIcon1} alt='Lưu lại' />
										<span>Lưu lại</span>
									</Button>
								)}
							</div>
						</div>
					) : null}
					{/* <div className='config-system-content-config-system-item-function'>
						{isDisableEdit == true ? null : (
							<Button
								color="default"
								type="button"
								className={`btn-success-cs`}
								style={{ margin: "inherit" }}
								onClick={this.onSaveInfoConfig}
							>
								<img src={SaveIcon1} alt='Lưu lại' />
								<span>Lưu lại</span>
							</Button>
						)}
					</div> */}
				</div>

				{messageNoti ?
					<PopupMessage
						popupMessage={popupMessage}
						moduleTitle={'Thông báo'}
						moduleBody={messageNoti}
						toggleModal={this.toggleModal}
					/>
					: null}
			</div>

		)
	}
}

const mapStateToProps = state => {
	return {
		ConfigWebsiteStore: state.ConfigWebsiteStore,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		...bindActionCreators(actionConfigWebsite, dispatch),
	}
}

export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(WebConfig);