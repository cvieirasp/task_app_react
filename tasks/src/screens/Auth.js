import React, { Component } from 'react'
import { Alert, AsyncStorage, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import axios from 'axios'
import { server, showError } from '../common'
import commonStyles from '../commonStyles'
import AuthInput from '../components/AuthInput'
import validate from '../validation'
import bgImage from '../../assets/imgs/login.jpg'

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 70,
        marginBottom: 10,
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        width: '90%',
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
    },
})

export default class Auth extends Component {
    state = {
        stageNew: false,
        name: '',
        nameError: '',
        email: '',
        emailError: '',
        password: '',
        passwordError: '',
        confirmPassword: '',
        confirmPasswordError: '',
    }

    signin = async () => {
        try {
            const response = await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password,
            })

            axios.defaults.headers.common['Authorization'] = `bearer ${response.data.token}`
            AsyncStorage.setItem('userData', JSON.stringify(response.data))
            this.props.navigation.navigate('Home', response.data)
        } catch (error) {
            showError(error)
        }
    }

    signup = async () => {
        try {
            await axios.post(`${server}/signup`, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword,
            })

            Alert.alert('Sucesso', 'Usuário cadastrado')
            this.setState({ stageNew: false })
        } catch (error) {
            showError(error)
        }
    }

    signinOrSignup = () => {
        if (this.state.stageNew) {
            this.setState({ 
                emailError: validate('email', { email: this.state.email }),
                passwordError: validate('password', { password: this.state.password }),
                nameError: validate('name', { name: this.state.name }),
                confirmPasswordError: validate('confirmPassword', { confirmPassword: this.state.confirmPassword }),
            }, () => {
                if (this.isValid()) {
                    this.signup()
                } 
            })   
        } else {
            this.setState({ 
                emailError: validate('email', { email: this.state.email }),
                passwordError: validate('password', { password: this.state.password }),
            }, () => {
                if (this.isValid()) {
                    this.signin()
                }
            })
        }
    }

    isValid = () => {
        return !(this.state.nameError || this.state.emailError || this.state.passwordError || this.state.confirmPasswordError)
    }

    render() {

        var isValid = this.isValid()

        return (
            <ImageBackground style={styles.background} source={bgImage}>
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {this.state.stageNew ? 'Crie a sua conta' : 'Informe seus dados'}
                    </Text>
                    {this.state.stageNew &&
                        <AuthInput style={styles.input} icon='user' placeholder='Nome' 
                            value={this.state.name} error={this.state.nameError}
                            onChangeText={name => this.setState({ name, nameError: validate('name', { name }) })} />
                    }
                    <AuthInput style={styles.input} icon='at' placeholder='E-mail'
                            value={this.state.email} error={this.state.emailError}
                            onChangeText={email => this.setState({ email, emailError: validate('email', { email }) })} />
                    <AuthInput style={styles.input} icon='lock' secureTextEntry={true} placeholder='Senha' 
                            value={this.state.password} error={this.state.passwordError}
                            onChangeText={password => this.setState({ password, passwordError: validate('password', { password }) })} />
                    {this.state.stageNew &&
                        <AuthInput style={styles.input} icon='asterisk' secureTextEntry={true} placeholder='Confirmação' 
                            value={this.state.confirmPassword} error={this.state.confirmPasswordError}
                            onChangeText={confirmPassword => this.setState({ confirmPassword, confirmPasswordError: validate('confirmPassword', { confirmPassword }, this.state.password) })} />
                    }
                    <TouchableOpacity disabled={!isValid} onPress={this.signinOrSignup}>
                        <View style={[styles.button, !isValid ? { backgroundColor: '#AAA'} : {}]}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? 'Registrar' : 'Entrar'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ stageNew: !this.state.stageNew })}>
                    <Text style={styles.buttonText}>
                        {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}