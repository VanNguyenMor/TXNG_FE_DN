import React, { Component } from "react";
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
// import Input from "../../components/Input";
// import Loader from "../../components/Loader/Loader";
// import Select from "../../components/Select";
import { useStyles } from "./styles.js";
import { withStyles } from "@material-ui/core/styles";
import LUU from "../../../assets/img/buttons/LUU.png";
import DONG from "../../../assets/img/buttons/DONG.png";

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

class Comfirm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: {
                "id": '',

            },

        };
    }

    componentWillReceiveProps(nextProp) {
        const { data } = nextProp;

        this.setState({ data });
    }


    render() {
        const { classes, handleUpdateInfoData, handleClose, open, handleCloseCOM } = this.props;
        const { data, company, id } = this.state;

        return (
            <Dialog
                fullWidth={false}
                maxWidth={false}
                fullScreen={false}
                onClose={() => handleCloseCOM(false)}
                aria-labelledby="customized-dialog-title"
                classes={{ paper: classes.paper }}
                open={open}
            >
                <div>
                    <h3 className={classes.titleForm}>THÔNG BÁO</h3>
                </div>
                <div>
                    <div className={classes.formControl}>

                        <div className='item-row'>
                            <div className="label">
                                Bạn đồng ý duyệt thông tin này ?
                            </div>
                        </div>


                    </div>
                    <div className={classes.submitControl}>
                        <Button variant="contained"
                            style={{
                                backgroundColor: '#02790E',
                                color: '#fff'
                            }}
                            onClick={() => {
                                handleUpdateInfoData(data);
                                handleCloseCOM(false);
                               
                            }}>
                            <img src={LUU} alt='LUU' title='ĐỒNG Ý' />&nbsp;ĐỒNG Ý
                        </Button>
                        <Button variant="outlined"
                            style={{
                                marginLeft: 10,
                                backgroundColor: '#F52349',
                                color: '#fff'
                            }}
                            onClick={() =>
                                handleCloseCOM(false)
                            }>
                            <img src={DONG} alt='dong' title='ĐÓNG' />&nbsp;ĐÓNG
                        </Button>
                    </div>
                </div>
            </Dialog>
        )
    }
}
export default withStyles(useStyles)(Comfirm);