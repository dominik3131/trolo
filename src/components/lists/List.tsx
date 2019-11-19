import React, {Component} from 'react';
import ListModel from "../../data-models/ListModel";
import Card from "../cards/Card";
import axios from "axios";
import SmallSpinner from "../../utils/SmallSpinner";
import CardModel from "../../data-models/CardModel";
import CreateCard from "../cards/CreateCard";

interface Props {
    list: ListModel
    afterModify: any
}

interface State {
    isLoading: boolean
    list: ListModel;
    listNameInputOpen: boolean,
    toggleDeleteList: boolean,
    toggleCardCreator:boolean
}

export default class List extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            list: this.props.list,
            listNameInputOpen: false,
            toggleDeleteList: false,
            toggleCardCreator: false
        };
        this.toggleNameInputList = this.toggleNameInputList.bind(this);
        this.toggleNameDeleteList = this.toggleNameDeleteList.bind(this);
        this.toggleCardCreator = this.toggleCardCreator.bind(this);
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
        this.setState({list: list});
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
                {this.toolbar()}
                {this.listName()}
                {this.listDelete()}
                {this.cardCreator()}
                {this.renderCards()}
            </div>
        </div>
    }

    renderCards() {
        const items: any[] = [];
        if (this.state.list.cards) {
            this.state.list.cards.forEach(card => {
                    items.push(<Card key={card.id} card={card}/>);
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
        return <div className={'col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3'}>
            {this.view()}
        </div>;
    }

    toggleNameInputList() {
        this.setState({listNameInputOpen: !this.state.listNameInputOpen})
    }

    toggleNameDeleteList() {
        this.setState({toggleDeleteList: !this.state.toggleDeleteList})
    }

    toggleCardCreator(){
        this.setState({toggleCardCreator: !this.state.toggleCardCreator})
    }

    updateListName() {
        this.updateList(this.state.list);
        this.toggleNameInputList();
    }

    updateListToDelete() {
        this.deleteList(this.state.list);
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
                    <i className="fas fa-check"/>
                </button>,
                <button type="button" className="btn btn-danger btn-sm" onClick={this.toggleNameInputList}>
                    <i className="far fa-times-circle"/>
                </button>
            ]
        } else {
            return null;
        }
    }

    cardCreator() {
        if(this.state.toggleCardCreator)
        {
            let cardCreator;
            if (this.state.list.id) {
                cardCreator = <CreateCard afterAdd={this.cardAdded.bind(this)} toggleCreator={this.toggleCardCreator.bind(this)} listId={this.state.list.id}/>
            }
            return cardCreator;
        }
    }


    toolbar() {
        return <div className="btn-group btn-group-sm" role="group">
            <button type="button" className="btn btn-primary btn-sm" onClick={this.toggleNameInputList}>
                <i className="far fa-edit"/>
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={this.toggleCardCreator}>
                <i className="fas fa-plus"/>
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={this.toggleNameDeleteList}>
                <i className="fas fa-trash-alt"/>
            </button>
        </div>
    }

    listDelete() {
        if (this.state.toggleDeleteList) {
            return [
                <div>delete {this.state.list.name} ?</div>
                ,
                <div>
                    <button type="button" className="btn btn-success btn-sm" onClick={this.updateListToDelete}>
                        <i className="fas fa-check"/>
                    </button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={this.toggleNameDeleteList}>
                        <i className="far fa-times-circle"/>
                    </button>
                </div>
            ]
        } else {
            return null;
        }
    }

    updateList(list: ListModel) {
        this.setState({list: list});
        axios.put(`/api/lists/${this.state.list.id}`, list)
            .then((resp) => {
                this.setState({list: resp.data});
                this.props.afterModify();
            });
    };

    deleteList(list: ListModel) {
        this.setState({list: list});
        axios.delete(`/api/lists/${this.state.list.id}`)
            .then((resp) => {
                this.setState({list: resp.data});
                this.props.afterModify();
            });
    };
}
