import React, { Component } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export const name = 'Iotnxt';

class Iotnxt extends React.Component {

    presets = {
        dev: {
            HostAddress: 'greenqueue.dev.iotnxt.io',
            PublicKey: '<RSAKeyValue><Exponent>AQAB</Exponent><Modulus>qblcqOI90QOdJk9pegGE+LDfXgMveZGpDBPpyIsSl8+Zkcp5zWxYj3k6BoWoL3U2z7l3wan6U9IhtAqaeTFatdwBOx0vOK8DWr4RIp1n6nAO7jEaHgsA1+FmFZTc8hQw6OEXVi+b31b7EFwLau0UA4TCj5862akf21ZqxaXmQUyyQA9Nl4JggY+TZDFL+hj+JdIm0V/yzq6o90E57s/70WYoDT6fZ5nDfdAgom/ZwjeUGTUh8V5HYJWuTZ33rRbKa8zYQ/HzAf5FZAVhndGI+CJFvorG8p53wXn2LP7NPhX6chCa++DVbFdru3OCLYMzdBqpohoVwHZnGGX1SGVi0Q==</Modulus></RSAKeyValue>',
        },
        prod: {
            HostAddress: 'greenqueue.prod.iotnxt.io',
            PublicKey: '<RSAKeyValue><Exponent>AQAB</Exponent><Modulus>rbltknM3wO5/TAEigft0RDlI6R9yPttweDXtmXjmpxwcuVtqJgNbIQ3VduGVlG6sOg20iEbBWMCdwJ3HZTrtn7qpXRdJBqDUNye4Xbwp1Dp+zMFpgEsCklM7c6/iIq14nymhNo9Cn3eBBM3yZzUKJuPn9CTZSOtCenSbae9X9bnHSW2qB1qRSQ2M03VppBYAyMjZvP1wSDVNuvCtjU2Lg/8o/t231E/U+s1Jk0IvdD6rLdoi91c3Bmp00rVMPxOjvKmOjgPfE5LESRPMlUli4kJFWxBwbXuhFY+TK2I+BUpiYYKX+4YL3OFrn/EpO4bNcI0NHelbWGqZg57x7rNe9Q==</Modulus></RSAKeyValue>',
        },
    };

    state = {
        TextInputDisableStatus: false,
        addGatewayForm: {
            GatewayId: 'gateway',
            Secret: this.generateDifficult(16),
            HostAddress: 'greenqueue.prod.iotnxt.io',
            PublicKey: '<RSAKeyValue><Exponent>AQAB</Exponent><Modulus>rbltknM3wO5/TAEigft0RDlI6R9yPttweDXtmXjmpxwcuVtqJgNbIQ3VduGVlG6sOg20iEbBWMCdwJ3HZTrtn7qpXRdJBqDUNye4Xbwp1Dp+zMFpgEsCklM7c6/iIq14nymhNo9Cn3eBBM3yZzUKJuPn9CTZSOtCenSbae9X9bnHSW2qB1qRSQ2M03VppBYAyMjZvP1wSDVNuvCtjU2Lg/8o/t231E/U+s1Jk0IvdD6rLdoi91c3Bmp00rVMPxOjvKmOjgPfE5LESRPMlUli4kJFWxBwbXuhFY+TK2I+BUpiYYKX+4YL3OFrn/EpO4bNcI0NHelbWGqZg57x7rNe9Q==</Modulus></RSAKeyValue>',
        },

    };

    generateDifficult(count: number) {
        const _sym = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
        let str = '';
        for (let i = 0; i < count; i++) {
            const tmp = _sym[Math.round(Math.random() * (_sym.length - 1))];
            str += '' + tmp;
        }
        return str;
    }

    // tslint:disable-next-line: no-shadowed-variable
    changeInput = (name: string) => {
        return (evt: { target: { value: any; }; }) => {
            const addGatewayForm = { ...this.state.addGatewayForm };
            addGatewayForm[name] = evt.target.value;
            this.setState({ addGatewayForm });
        };
    }

    // tslint:disable-next-line: no-shadowed-variable
    choosePreset = (name: string | number) => {
        return (evt: any) => {
            const addGatewayForm = { ...this.state.addGatewayForm };
            addGatewayForm.HostAddress = this.presets[name].HostAddress;
            addGatewayForm.PublicKey = this.presets[name].PublicKey;
            this.setState({ addGatewayForm });
        };
    }

    render() {
        return (
            <View style={{backgroundColor: 'grey'}}>
                <Text>ADD GATEWAY</Text>
                <View>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: 'black', margin: 10 }}
                        placeholder='Gateway ID'
                        onChangeText={() => this.changeInput('GatewayId')}
                        value={this.state.addGatewayForm.GatewayId}
                    />

                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: 'black', margin: 10 }}
                        placeholder='Secret'
                        onChangeText={() => this.changeInput('Secret')}
                        value={this.state.addGatewayForm.Secret}
                        editable={this.state.TextInputDisableStatus}
                    />

                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: 'black', margin: 10 }}
                        placeholder='Public key'
                    // onChangeText={(text) => this.setState({text})}
                        value={this.state.addGatewayForm.PublicKey}
                        editable={this.state.TextInputDisableStatus}
                    />

                    <Button title='Production'
                        onPress={() => this.choosePreset('prod')}
                    />
                    <Button title='Development'
                        onPress={() => this.choosePreset('dev')}
                    />


                </View>
            </View>
        );
    }
}

export default Iotnxt;
