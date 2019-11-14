import React, {Component} from 'react';
import ListModel from "../../data-models/ListModel";
import Spinner from "../../utils/Spinner";
import Card from "../cards/Card";
import axios from "axios";
import SmallSpinner from "../../utils/SmallSpinner";
import CardModel from "../../data-models/CardModel";

interface Props {
    list: any
}

interface State {
    isLoading: boolean
    list: ListModel;
    listNameInputOpen: boolean,
    toggleDeleteList: boolean
}

export default class List extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            list: this.props.list,
            listNameInputOpen: false,
            toggleDeleteList: false
        };
        this.toggleNameInputList = this.toggleNameInputList.bind(this);
        this.toggleNameDeleteList = this.toggleNameDeleteList.bind(this);
        this.nameChangedLists = this.nameChangedLists.bind(this);
        this.updateListName = this.updateListName.bind(this);
        this.updateListToDelete = this.updateListToDelete.bind(this);
        this.listName = this.listName.bind(this);
        this.fetchList();
    }

    fetchList() {
        axios.get(`/api/lists/${this.props.list.id}`)
            .then((resp) => {
                this.setState({list: resp.data, isLoading: false});
            });
    }

    cardAdded(newCard: CardModel) {
        let list = this.state.list;
        if (list.cards)
            list.cards.push(newCard);
        this.setState({list:list});
        this.updateList(this.state.list);
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
                {this.listName()}
                {this.listDelete()}
                <button type="button" className="btn btn-primary btn-sm"> Add Card</button>
                {this.renderCards()}
            </div>
        </div>
    }

    renderCards() {
        const items: any[] = [];
        if (this.state.list.cards) {
            this.state.list.cards.forEach(card => {
                        items.push(<Card card={card}/>);
                }
            )
        }
        return (
            <div>
                {items}
            </div>
        )
    }

    render() {
        return <div className={'col-3'}>
            {this.view()}
        </div>;
    }

    toggleNameInputList() {
        this.setState({listNameInputOpen: !this.state.listNameInputOpen})
    }

    toggleNameDeleteList() {
        this.setState({toggleDeleteList: !this.state.toggleDeleteList})
    }

    updateListName() {
        this.updateList(this.state.list);
        this.toggleNameInputList();
    }

    updateListToDelete() {
        this.updateListDelete(this.state.list);
        console.log("Witamy w piekle")
        this.toggleNameDeleteList();
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

    listDelete() {
        if (this.state.toggleDeleteList) {
            return [
                'Do you want to delete: '+ this.state.list.name,
                <button type="button" className="btn btn-primary btn-sm" onClick={this.updateListToDelete}>
                    Yes
                </button>,
                <button type="button" className="btn btn-danger btn-sm" onClick={this.toggleNameDeleteList}>
                    No
                </button>
            ]
        } else {
            return [
                <button type="button" className="btn btn-primary btn-sm" onClick={this.toggleNameDeleteList}>
                    Delete List
                </button>
            ]
        }
    }

    updateList(list: ListModel) {
        this.setState({list: list});
        axios.put(`/api/lists/${this.state.list.id}`, list)
             .then((resp) => {
                 this.setState({list: resp.data});
             });
    };

    updateListDelete(list: ListModel) {

        this.setState({list: list});
        axios.delete(`/api/lists/${this.state.list.id}`)
             .then((resp) => {
                  this.setState({list: resp.data});
             });
    };
}
