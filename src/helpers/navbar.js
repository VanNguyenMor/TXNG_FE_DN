import React, { Component } from "react";
import SettingsIcon from '@material-ui/icons/Settings';
import { NAVBAR_ITEM, NAVBAR_PARENT_ITEM } from "./constant";

export const menuTop = [
    {
        open: true,
        menuName: NAVBAR_PARENT_ITEM.SYSTEM,
        menuItem: [
            { label: NAVBAR_ITEM.USER_ACCOUNT, icon: null, url: '/tai_khoan_nguoi_dung' },
            { label: NAVBAR_ITEM.ROLE_GROUP, icon: null, url: '/nhom_quyen' },
            { label: NAVBAR_ITEM.DATA_ZONE, icon: null, url: '/vung_du_lieu' },
            { label: NAVBAR_ITEM.FUNCTION_ROLE, icon: null, url: '/phan_vung_chuc_nang' },
            { label: NAVBAR_ITEM.DATA_ROLE, icon: null, url: '/phan_vung_du_lieu' },
            { label: NAVBAR_ITEM.PRICES, icon: null, url: '/bang_gia' },
            { label: NAVBAR_ITEM.HISTORY, icon: null, url: '/nhat_ky_he_thong' },
            { label: NAVBAR_ITEM.LOGGING_INFORMATION, icon: null, url: '/nhat_ky' },
            { label: NAVBAR_ITEM.DECLARE_INFORMATION, icon: null, url: '/ke_khai_thong_tin' },
        ]
    },
    {
        open: true,
        menuName: NAVBAR_PARENT_ITEM.COMPANY,
        menuItem: [
            { label: NAVBAR_ITEM.NEWREGBUS, icon: null, url: '/danh_sach_moi_dang_ky' },
            { label: NAVBAR_ITEM.COMPANY_AWAIT, icon: null, url: '/danh_sach_dang_cho_duyet' },
            { label: NAVBAR_ITEM.COMPANY_NOT_COMFIRM, icon: null, url: '/danh_sach_khong_duoc_duyet' },
            { label: NAVBAR_ITEM.COMPANY_LIST_REGISTER, icon: null, url: '/danh_sach_da_dang_ky' },
            { label: NAVBAR_ITEM.COMPANY_LIST_AWAIT_EXPIRED, icon: null, url: '/danh_sach_sap_het_han' },
            { label: NAVBAR_ITEM.COMPANY_LIST_EXPIRING, icon: null, url: '/danh_sach_cho_gia_han' },
            { label: NAVBAR_ITEM.COMPANY_LIST_REQUEST_EXTEND, icon: null, url: '/danh_sach_yeu_cau_gia_han' },
            { label: NAVBAR_ITEM.COMPANY_LIST_REQUEST_UNLOCK, icon: null, url: '/danh_sach_yeu_cau_mo_khoa' },
            { label: NAVBAR_ITEM.COPANY_LIST_LOCK, icon: null, url: '/danh_sach_bi_khoa' },
        ]
    },
    {
        open: true,
        menuName: NAVBAR_PARENT_ITEM.CATEGORY,
        menuItem:[
            {label: NAVBAR_ITEM.FIELD_LIST, icon: null, url: '/danh_muc_nganh_nghe'},
            {label: NAVBAR_ITEM.PLANTINGTYPE_LIST, icon: null, url: '/danh_sach_loai_vung_trong_va_thuoc_tinh'},
            {label: NAVBAR_ITEM.INFORMATION_LIST, icon: null, url: '/danh_muc_du_lieu_truy_xuat'},
            {label: NAVBAR_ITEM.ACCESS_LIST, icon: null, url: '/danh_muc_du_lieu_ke_khai'}
        ]
    },
    {
        open: true,
        menuName: NAVBAR_PARENT_ITEM.STAMP,
        menuItem:[
            { label: NAVBAR_ITEM.STAMP_LIST, icon: null, url: '/quan_ly_dai_tem' },
            { label: NAVBAR_ITEM.STAMP_PROVIDE, icon: null, url: '/quan_ly_cap_phat_tem' },
        ]
    },
    {
        open: true,
        menuName: NAVBAR_PARENT_ITEM.FEE,
        menuItem:[
            { label: NAVBAR_ITEM.REGISTERED_FEE_LIST, icon: null, url: '/thu_tien_dang_ky_su_dung' },
            { label: NAVBAR_ITEM.STAMP_FEE_LIST, icon: null, url: '/thu_tien_tem' },
        ]
    },
    {
        open: true,
        menuName: NAVBAR_PARENT_ITEM.WEBSITE,
        menuItem:[
            { label: NAVBAR_ITEM.MENU_LIST, icon: null, url: '/menu' },
            { label: NAVBAR_ITEM.BLOG_LIST, icon: null, url: '/bai_viet' },
            { label: NAVBAR_ITEM.NEWS_LIST, icon: null, url: '/tin_tuc' },
        ]
    }
];

export const menuBottom = [
    { label: NAVBAR_ITEM.SETTING, icon: <SettingsIcon />, url: '/cai_dat_he_thong' }
];