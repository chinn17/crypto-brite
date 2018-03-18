import React, { Component } from 'react';
import {  View, Text, StyleSheet, Alert, Image } from 'react-native';

export default class componentName extends Component {

  constructor(props){
    super(props);
    this.state = {
      isPaymentLoading: true,
      payment: null, 
    }
  }

  componentDidMount(){
    this.createPayment()  
  }

  async createPayment() {

    var details = {
      'amount': 0.1,
    }

    var formBody = []

    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");

    try {
      let response = await fetch(`https://brite-payment.herokuapp.com/api/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
      });

      let responseJSON = null
      
      console.log(response.status)

      if (response.status === 200) {
        responseJSON = await response.json();
        console.log(responseJSON)

        this.setState({
          isPaymentLoading: false, 
          payment: responseJSON,
        })

        console.log(this.state.payment["payment"].address);

      } else {
        responseJSON = await response.json();
        const error = responseJSON.message

        console.log(responseJSON)

        this.setState({ errors: responseJSON.errors })
        Alert.alert('Unable to get your feed', `Reason.. ${error}!`)
      }
    } catch (error) {
      this.setState({ isLoading: false, response: error })

      console.log(error)

      Alert.alert('Unable to get the feed. Please try again later')
    }
  }

  render() {
    const { payment, isPaymentLoading } = this.state 
 
    return (
      <View style={styles.container}>
      {!isPaymentLoading &&
      <View>
        <Image 
          source={{uri: payment["payment"].qrcode_url }}
          style={{
            width: 300,
            height: 300,
          }}
        />
        <Text> Address: {payment["payment"].address} </Text>
        <Text> Amount </Text>
        </View>
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
