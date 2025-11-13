export const useStyles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },

    formControl: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: theme.palette.spacing.normal + 5,

        '& .row': {
            width: 'calc(100% - 60px)',

            '& div': {
                display: 'flex',
                width: '100%',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'row',
            },

            '& input': {
                width: 'calc(100% - 22px)'
            },

            '& .label': {
                width: 150
            },

            '& .item-row': {
                marginBottom: theme.palette.spacing.normal + 5,

                '&:last-child': {
                    marginBottom: 0
                }
            }
        }
    },
    titleForm: {
        textAlign: 'center', 
        color: '#fff', 
        backgroundColor: theme.palette.primary.main, 
        paddingBottom: 15, 
        paddingTop: 15, 
        margin: 0, 
        textTransform: 'uppercase',
    },
    submitControl: {
        display: 'flex',
        //justifyContent: 'flex-end',
        justifyContent:'center',
        alignItems: 'center',
        padding: '15px 30px'
    },
    
    btnSubmitActive: {
        cursor: 'pointer',
        height: 20,
        marginRight: theme.palette.spacing.default - 5,
        color: theme.palette.primary.contrastText,
        background: theme.palette.snackbars.success,

        '& span': {
            whiteSpace: 'nowrap'
        }
    },

    btnSubmitNoActive: {
        cursor: 'pointer',
        height: 20,
        color: theme.palette.primary.contrastText,
        background: theme.palette.snackbars.fail,
        
        '& span': {
            whiteSpace: 'nowrap'
        }
    },

    editArea: {
        display: 'flex',
        //width: 78,
        justifyContent: 'center',
        alignItems: 'center',

        '& .edit-item': {
            marginRight: theme.palette.spacing.default - 5,
            cursor: 'pointer',

            '&:last-child': {
                marginRight: 0
            }
        }
    },

    selectArea: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        '& .label': {
            width: 150
        }
    },
    
    paper: { minWidth: "500px" },
})