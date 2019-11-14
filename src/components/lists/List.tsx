import React, {Component} from 'react';
import ListModel from "../../data-models/ListModel";
import axios from "axios";
import SmallSpinner from "../../utils/SmallSpinner";

interface Props {
    list: ListModel
}

interface State {
    isLoading: boolean
    list: ListModel;
    listNameInputOpen: boolean,
}

export default class List extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            list: new ListModel(),
            listNameInputOpen: false
        };
        this.toggleNameInputList = this.toggleNameInputList.bind(this);
        this.nameChangedLists = this.nameChangedLists.bind(this);
        this.updateListName = this.updateListName.bind(this);
        this.listName = this.listName.bind(this);
        this.fetchList();
    }

    fetchList() {
        axios.get(`/api/lists/${this.props.list.id}`)
            .then((resp) => {
                this.setState({list: resp.data, isLoading: false});
            });
    }

    view() {
        if (this.state.isLoading) {
            return <div className="card">
                <div className={"card-body"}>
                    {this.props.list.name}
                    <SmallSpinner/>
                </div>
            </div>
        }
        return <div className="card">
            <div className={"card-body"}>
                <h4>{this.state.list.name}</h4>
                <button type="button" className="btn btn-primary btn-sm"> Add Card</button>
                {this.listName()}
                <button type="button" className="btn btn-primary btn-sm"> Delete Card</button>
            </div>
        </div>
    }

    render() {
        return <div className={'col-3'}>
            {this.view()}
        </div>;
    }

    toggleNameInputList() {
        this.setState({listNameInputOpen: !this.state.listNameInputOpen})
    }


    updateListName() {
        this.updateList(this.state.list);
        this.toggleNameInputList();
    }

    nameChangedLists(e: any) {
        let list = this.state.list;
        list.name = e.target.value;
        this.setState({list: list})
    }

    listName() {
        if (this.state.listNameInputOpen) {
            return [
                <input className="form-control" defaultValue={this.state.list.name || ''}
                       onChange={this.nameChangedLists}/>,
                <button type="button" className="btn btn-primary btn-sm" onClick={this.updateListName}>
                    Save
                </button>,
                <button type="button" className="btn btn-danger btn-sm" onClick={this.toggleNameInputList}>
                    Cancel
                </button>
            ]
        } else {
            return [
                <button type="button" className="btn btn-primary btn-sm" onClick={this.toggleNameInputList}>
                    Edit Name
                </button>
            ]
        }
    }

    updateList(list: ListModel) {
        this.setState({list: list});
        axios.put(`/api/lists/${this.props.list.id}`, list)
             .then((resp) => {
                 this.setState({list: resp.data});
             });
    };
}
