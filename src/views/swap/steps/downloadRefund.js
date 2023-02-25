import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { isIOS } from 'react-device-detect';
import View from '../../../components/view';
import { navigation } from '../../../actions';
import { createRefundQr, createRefundText } from '../../../utils/refundUtils';

const DownloadRefundStyles = () => ({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
  },
  placer: {
    justifyContent: 'center',
    //alignItems: 'center',
    flexDirection: 'column',
  },
  info: {
    fontSize: '20px',
    alignSelf: 'flex-start',
    '@media (max-width: 425px)': {
      fontSize: '16px',
    },
  },
  address: {
    fontSize: '20px',
    maxWidth: '625px',
    alignSelf: 'flex-start',
    '@media (max-width: 425px)': {
      fontSize: '16px',
    },
  },
  link: {
    fontSize: '24px',
  },
  box: {
    backgroundColor: 'lightgray',
    borderRadius: '5px',
    padding: '10px',
    margin: '10px 0px 30px 0',
  },
  refund: {
    alignSelf: 'flex-start',
    '@media (max-width: 425px)': {
      fontSize: '16px',
    },
    wordBreak: 'break-word',
    maxWidth: '625px',
  },
  visible: {
    visibility: 'visible'
  },
  hidden: {
    visibility: 'hidden'
  },
  warning: {
    color: 'red'
  }
});

class StyledDownloadRefund extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();

    this.state = {
      check: false,
    };
  }

  componentDidMount() {
    this.ref.current.click();
  }

  onChange = () => {
    this.setState(prevState => ({
      check: !prevState.check
    }));
    if (!this.state.check) {
      this.props.onChange(true);
    } else {
      this.props.onChange(false);
    }
  };
  render() {
    if (isIOS) {
      const dialog = window.confirm(
        'Tapping OK will open refund.png in a new tab which will be needed in case of a refund.' +
          ' Please save it in your gallary. This is important for conserving the non-custodial nature of the swap'
      );

      if (dialog !== true) {
        navigation.navHome();
      }
    }

    const {
      classes,
      currency,
      privateKey,
      redeemScript,
      timeoutBlockHeight,
    } = this.props;

    createRefundQr();
    const refundText = createRefundText(
      currency,
      privateKey,
      redeemScript,
      timeoutBlockHeight);

    return (
      <View className={classes.wrapper}>
        <View className={classes.placer}>
          <p className={classes.info}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              ref={this.ref}
              href={createRefundQr(
                currency,
                privateKey,
                redeemScript,
                timeoutBlockHeight
              )}
              download={'refund.png'}
            >
              Click here
            </a>{' '}
            if the download of &lsquo;refund.png&lsquo; didn&apos;t start automatically.
          </p>
          <p className={classes.address}>
            This refund file can be used to trustlessly 
            claim your coins back in case of failure of this swap. <br />
            <span className={classes.warning}>
              In adittion to the png file, make sure to keep this backup code below until the swap is succesfully complete. <br />
              Warning: FAILURE TO DO SO MAY LEAD TO LOSS OF FUNDS.
            </span>
          </p>
          <label>
            <input
              type="checkbox"
              value="check"
              onChange={this.onChange}
            />
            Display Backup
          </label>
          <div className={classes.box}>
            <p className={classes.refund + ' ' + ((this.state.check) ? classes.visible : classes.hidden)}>
              {refundText}
            </p>
          </div>
        </View>
      </View>
    );
  }
}

StyledDownloadRefund.propTypes = {
  classes: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  redeemScript: PropTypes.string.isRequired,
  privateKey: PropTypes.string.isRequired,
  timeoutBlockHeight: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

const DownloadRefund = injectSheet(DownloadRefundStyles)(StyledDownloadRefund);

export default DownloadRefund;
