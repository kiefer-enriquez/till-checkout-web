import React, { Component } from "react";
import { Input, Error } from "./element";
const styles = {
  label: {
    fontSize: "12px",
    color: "#a89f9e",
    paddingTop: 15,
    paddingLeft: 0,
  },
};
class TillCheckout extends Component {
  constructor(props) {
    const params = new URLSearchParams(window.location.search);
    const paramAmount = params.get("amount");
    super(props);
    this.state = {
      payment: new window.PaymentJs(),
      publicIntegrationKey: props.publicIntegrationKey,
      transactionToken: "",
      amount: paramAmount ? paramAmount : 0,
      cardData: {},
      formData: {},
      errors: [],
      cardholderErr: "",
      cardnumberErr: "",
      monthErr: "",
      yearErr: "",
      cvvErr: "",
    };
  }

  componentDidMount() {
    this.state.payment.init(
      this.state.publicIntegrationKey,
      "numberDiv",
      "cvvDiv",
      (payment) => {
        payment.setNumberStyle({
          width: "100%",
          height: "80%",
          border: "1px solid red",
        });
        payment.setCvvStyle({
          width: "35%",
          height: "80%",
          border: "1px solid red",
        });
        payment.numberOn("input", function (data) {
          // console.log(data);
        });
        console.log(payment);
      }
    );

    //test dispatching event
  }

  handleFormChange = (e) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [e.target.name]: e.target.value.trim(),
      },
    });
  };

  handleTokenization = async () => {
    return await new Promise((resolve, reject) => {
      this.state.payment.tokenize(
        this.state.formData,
        (transactionToken, cardData) => {
          const cardDataValues = JSON.stringify(cardData, null, 1);
          this.setState({ cardData: cardDataValues });
          resolve(transactionToken);
          //mobileapp: tokenization success
          //window.ReactNativeWebView.postMessage only accepts one argument which must be a string.
          window.ReactNativeWebView.postMessage(transactionToken);
        },
        (errors) => {
          const errorsArr = [];
          errors.map((e) => {
            errorsArr.push(e.message);
          });
          reject(errorsArr);
          this.setState({ errors: errorsArr });
          const test = {
            success: true,
            data: errorsArr,
          };
          //mobile client tokenization error
          //window.ReactNativeWebView.postMessage only accepts one argument which must be a string.
          window.ReactNativeWebView.postMessage("false");
        }
      );
    });
  };

  handleSubmit = (e) => {
    //mobileapp: start load

    e.preventDefault();

    //tokenization
    this.handleTokenization()
      .then((t) => {
        console.log("Tokenize Success:", t);
        this.setState({ transactionToken: t });
      })
      .catch((e) => {
        console.log("Tokenize Error:", e);
        //assign error
        this.setState({ yearErr: e[this.findString(e, "year")] });
        this.setState({ monthErr: e[this.findString(e, "month")] });
        this.setState({
          cardholderErr: e[this.findString(e, "holder")],
        });
        this.setState({
          cardnumberErr: e[this.findString(e, "number")],
        });
        this.setState({ cvvErr: e[this.findString(e, "CVV")] });
      });
  };

  findString = (arr, str) => {
    let filter = -1;
    filter = arr.findIndex((e) => {
      return e.indexOf(str) > -1;
    });
    return filter;
  };

  render() {
    return (
      <div style={{ margin: 10 }}>
        <div className="container">
          <form>
            <div className="row">
              <h2 className="text-muted" style={{ paddingLeft: 0 }}>
                Payment Details
              </h2>
            </div>
            <div className="row">
              <h4 style={{ paddingLeft: 0 }}> ${this.state.amount} </h4>
            </div>
            <div className="row">
              <Input
                id="email"
                name="email"
                onEdit={this.handleFormChange}
                label="Email"
              />
            </div>
            <div className="row">
              <Input
                id="card_holder"
                name="card_holder"
                onEdit={this.handleFormChange}
                label="Card holder"
              />
              <Error err={this.state.cardholderErr} />
            </div>
            <div className="row">
              <label style={styles.label}>Card number</label>
              <div
                id="numberDiv"
                style={{ padding: 0, margin: 0, height: 38 }}
              ></div>
              <Error err={this.state.cardnumberErr} />
            </div>
            <div className="row">
              <div className="col" style={{ padding: 0, width: 10 }}>
                <Input
                  id="month"
                  name="month"
                  onEdit={this.handleFormChange}
                  label="Month"
                />
                <Error err={this.state.monthErr} />
              </div>
              <div className="col" style={{ padding: 0 }}>
                <Input
                  id="year"
                  name="year"
                  onEdit={this.handleFormChange}
                  label="Year"
                />
                <Error err={this.state.yearErr} />
              </div>
              <div className="col" style={{ padding: 0 }}>
                <label style={styles.label}>CVV</label>
                <div
                  id="cvvDiv"
                  style={{ padding: 0, margin: 0, height: 42 }}
                ></div>
                <Error err={this.state.cvvErr} />
              </div>
            </div>
            <div className="row">
              <label style={styles.label}>&nbsp;</label>
              <input
                type="submit"
                onClick={this.handleSubmit}
                value={"Pay $" + this.state.amount}
                style={{
                  backgroundColor: "#FF591F",
                  border: 0,
                  color: "#fff",
                  padding: 10,
                }}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default TillCheckout;
