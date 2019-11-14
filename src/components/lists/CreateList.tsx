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
        //list.id_table = this.props.tableId;
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
               <button type="button" className="btn btn-primary btn-sm" onClick={this.createList}>
                   Add
               </button>,
               <button type="button" className="btn btn-danger btn-sm" onClick={this.toggleListNameInput}>
                   Cancel
               </button>
            </div>
        } else {
            return <button type="button" className="btn btn-primary btn-sm" onClick={this.toggleListNameInput}>
                Add list
            </button>
        }
    }

    render() {
        return this.view();
    }
}
