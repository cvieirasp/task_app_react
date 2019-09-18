import React, { Component } from 'react'
import { FlatList, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/pt-br'
import todayImage from '../../assets/imgs/today.jpg'
import tomorrowImage from '../../assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/imgs/week.jpg'
import monthImage from '../../assets/imgs/month.jpg'
import commonStyles from '../commonStyles'
import Task from '../components/Task'
import Icon from 'react-native-vector-icons/FontAwesome'
import ActionButton from 'react-native-action-button'
import RegisterTask from './RegisterTask'
import { server, showError } from '../common';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 3,
    },
    iconBar: {
        marginTop: (Platform.OS==='ios'?30:10),
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    titleBar: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,
    },
    taskContainer: {
        flex: 7,
    },
 })

export default class Agenda extends Component {
    state = {
        tasks: [

        ],
        visibleTasks: [],
        showDoneTasks: true,
        showRegisterTask: false,
    }
    
    componentDidMount = async () => {
        this.loadTasks()
    }

    addTask = async task => {
        try {
            await axios.post(`${server}/tasks`, {
                description: task.description,
                estimateAt: task.date,
            })
            this.setState({ showRegisterTask: false }, this.loadTasks)
        } catch (error) {
            showError(error)
        }
    }

    deleteTask = async id => {
        try {
            await axios.delete(`${server}/tasks/${id}`)
            await this.loadTasks()
        } catch (error) {
            showError(error)
        }
    }

    filterTasks = () => {
        let visibleTasks = null
        if (this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks]
        } else {
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }
        this.setState({ visibleTasks })
    }

    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks)
    }

    toggleTask = async id => {
        try {
            await axios.put(`${server}/tasks/${id}/toggle`)
            await this.loadTasks()
        } catch (error) {
            showError(error)
        }
    }

    loadTasks = async () => {
        try {
            const maxDate = moment().add({ days: this.props.daysAhead }).format('YYYY-MM-DD 23:59')
            const response = await axios.get(`${server}/tasks?date=${maxDate}`)
            this.setState({ tasks: response.data }, this.filterTasks)
        } catch (error) {
            showError(error)
        }
    }

    render() {

        let styleColor = null
        let image = null

        switch(this.props.daysAhead) {
            case 0:
                styleColor = commonStyles.colors.today
                image = todayImage
                break
            case 1:
                styleColor = commonStyles.colors.tomorrow
                image = tomorrowImage
                break
            case 7:
                styleColor = commonStyles.colors.week
                image = weekImage
                break
            default:
                styleColor = commonStyles.colors.month
                image = monthImage
                break
        }

        return (
            <View style={styles.container}>
                <RegisterTask isVisible={this.state.showRegisterTask}
                    onSave={this.addTask}
                    onCancel={() => this.setState({ showRegisterTask: false })} />
                <ImageBackground source={image} style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='bars' size={20} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={this.state.showDoneTasks?'eye':'eye-slash'} 
                                size={20} 
                                color={commonStyles.colors.secondary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        <Text style={styles.subtitle}>
                            {moment().locale('pt-br').format('ddd, D [de] MMMM')}
                        </Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskContainer}>
                    <FlatList data={this.state.visibleTasks} 
                        keyExtractor={item => `${item.id}`} 
                        renderItem={({ item }) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTask} />} />
                </View>
                <ActionButton buttonColor={styleColor} 
                    onPress={() => {this.setState({ showRegisterTask: true })}} />
            </View>
        )
    }
}