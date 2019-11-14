import React, {Component} from 'react';
import axios from 'axios';
import ListModel from "../../data-models/ListModel";

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
        axios.post('/api/lists/', list).then(
            (resp)=>{this.props.afterAdd(resp.data)}
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
           return <div className={'form-inline'}>
               <input className="form-control" defaultValue={this.state.listName}
                      onChange={this.nameChanged}/>,
               <button type="button" className="btn btn-success btn-sm" onClick={this.createList}>
                   <i className="fas fa-check"/>
               </button>,
               <button type="button" className="btn btn-danger btn-sm" onClick={this.toggleListNameInput}>
                   <i className="far fa-times-circle"/>
               </button>
            </div>
        } else {
            return <button type="button" className="btn btn-primary btn-sm" onClick={this.toggleListNameInput}>
                <i className="fas fa-plus"/>
            </button>
        }
    }

    render() {
        return this.view();
    }
}
