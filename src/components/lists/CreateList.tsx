import React, {Component} from 'react';
import axios from 'axios';
import ListModel from "../../data-models/ListModel";
import {MDBBtn, MDBIcon} from "mdbreact";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;

interface Props {
    tableId: number
    afterAdd: any
}

interface State {
    listName: string
    listNameInputOpened: boolean
}

export default class CreateList extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            listName: '',
            listNameInputOpened: false
        };
        this.toggleListNameInput = this.toggleListNameInput.bind(this);
        this.nameChanged = this.nameChanged.bind(this);
        this.createList = this.createList.bind(this);
    }

    createList() {
        let list = new ListModel();
        list.name = this.state.listName;
        list.id_table = this.props.tableId;
        this.toggleListNameInput();
        axios.post('/api/lists/', list, {
            headers: {
                'Authorization': 'token' + localStorage.getItem('user_token')
            }
        }).then(
            (resp) => {
                this.props.afterAdd(resp.data)
            }
        );
    }

    toggleListNameInput() {
        this.setState({listNameInputOpened: !this.state.listNameInputOpened})
    }

    nameChanged(e: any) {
        this.setState({listName: e.target.value});
    }

    view() {
        if (this.state.listNameInputOpened) {
            return <div className={"form-inline"}>
                <input className="form-control" defaultValue={this.state.listName}
                       onChange={this.nameChanged}/>
                <MDBBtn size={"sm"} color={"success"} onClick={this.createList}>
                    <MDBIcon icon={"fas fa-check"}/>
                </MDBBtn>
                <MDBBtn size={"sm"} color={"danger"} onClick={this.toggleListNameInput}>
                    <MDBIcon icon={"far fa-times-circle"}/>
                </MDBBtn>
            </div>
        } else {
            return <MDBBtn size={"sm"} color={"primary"} onClick={this.toggleListNameInput}>
                <MDBIcon icon={"fas fa-plus"}/>
            </MDBBtn>
        }
    }

    render() {
        return this.view();
    }
}
