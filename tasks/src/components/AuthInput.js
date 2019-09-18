import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 40,
        backgroundColor: '#EEE',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        color: '#333',
        marginLeft: 20,
    },
    input: {
        marginLeft: 20,
        width: '70%',
    },
    errors: {
        marginTop: 5,
        marginLeft: 20,
        color: 'red',
        fontSize: 15,
    }
})

export default props => {
    return (
        <View>
            <View style={[styles.container, props.style]}>
                <Icon name={props.icon} size={20} style={styles.icon} />
                <TextInput {...props} style={styles.input} />
            </View>
            { props.error ? <Text style={styles.errors}>{props.error}</Text> : null }
        </View>
    )
}