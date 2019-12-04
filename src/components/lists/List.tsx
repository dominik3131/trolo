import React, {Component} from 'react';
import ListModel from "../../data-models/ListModel";
import Card from "../cards/Card";
import axios from "axios";
import SmallSpinner from "../../utils/SmallSpinner";
import CardModel from "../../data-models/CardModel";
import CreateCard from "../cards/CreateCard";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody, MDBCol,
    MDBDropdown, MDBDropdownItem,
    MDBDropdownMenu,
    MDBDropdownToggle,
    MDBIcon
} from "mdbreact";

interface Props {
    list: ListModel
    afterModify: any
}

interface State {
    isLoading: boolean
    list: ListModel;
    listNameInputOpen: boolean,
    toggleCardCreator: boolean,
    newName: string
}

export default class List extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            list: this.props.list,
            listNameInputOpen: false,
            toggleCardCreator: false,
            newName: ''
        };
        this.toggleNameInputList = this.toggleNameInputList.bind(this);
        this.toggleCardCreator = this.toggleCardCreator.bind(this);
        this.nameChangedLists = this.nameChangedLists.bind(this);
        this.updateListName = this.updateListName.bind(this);
        this.listName = this.listName.bind(this);
        this.archiveList = this.archiveList.bind(this);
        this.archiveAllCards = this.archiveAllCards.bind(this);
        this.fetchList();
    }

    fetchList() {
        axios.get(`/api/lists/${this.props.list.id}`, {
            headers: {
                'Authorization': 'token' + localStorage.getItem('user_token')
            }
        })
            .then((resp) => {
                this.setState({list: resp.data, isLoading: false});
            });
    }

    updateList(list: ListModel) {
        this.setState({list: list});
        axios.put(`/api/lists/${this.state.list.id}`, list)
            .then((resp) => {
                this.setState({list: resp.data});
                this.props.afterModify();
            });
    };

    cardAdded(newCard: CardModel) {
        let list = this.state.list;
        if (list.cards)
            list.cards.push(newCard);
        this.setState({list: list});
        this.updateList(this.state.list);
    }

    cardDeleted() {
        this.updateList(this.state.list);
    }


    toggleNameInputList() {
        this.setState({listNameInputOpen: !this.state.listNameInputOpen});
        let name = this.state.list.name as string;
        this.setState({newName: name});
    }

    toggleCardCreator() {
        this.setState({toggleCardCreator: !this.state.toggleCardCreator})
    }

    updateListName() {
        let list = this.state.list;
        list.name = this.state.newName;
        this.updateList(this.state.list);
        this.toggleNameInputList();
    }

    archiveList() {
        let list = this.state.list;
        list.is_archive = true;
        this.updateList(list);
    }

    nameChangedLists(e: any) {
        this.setState({newName: e.target.value})
    }

    archiveAllCards() {
        let list = this.state.list;
        if (list.cards) {
            list.cards.forEach(card => {
                card.is_archive = true;
                axios.put(`/api/cards/${card.id}`, card)
                    .then();
            });
            this.updateList(list);
        }
    }

    listName() {
        if (this.state.listNameInputOpen) {
            return [
                <input className="form-control" defaultValue={this.state.list.name || ''}
                       onChange={this.nameChangedLists}/>,
                <MDBBtn color={'primary'} size={'sm'} onClick={this.updateListName}>
                    <MDBIcon icon={'fas fa-check'}/>
                </MDBBtn>,
                <MDBBtn color={'danger'} size={'sm'} onClick={this.toggleNameInputList}>
                    <MDBIcon icon={'far fa-times-circle'}/>
                </MDBBtn>
            ]
        } else {
            return <h4>{this.state.list.name}</h4>;
        }
    }

    cardCreator() {
        if (this.state.toggleCardCreator) {
            if (this.state.list.id) {
                return <CreateCard afterAdd={this.cardAdded.bind(this)}
                                   toggleCreator={this.toggleCardCreator.bind(this)}
                                   listId={this.state.list.id}/>
            }
        }
    }

    dropdown() {
        return <MDBDropdown dropright>
            <MDBDropdownToggle caret color="primary">
                Actions
            </MDBDropdownToggle>
            <MDBDropdownMenu basic>
                <MDBDropdownItem header>List Actions</MDBDropdownItem>
                <MDBDropdownItem onClick={this.toggleNameInputList}>Edit name</MDBDropdownItem>
                <MDBDropdownItem onClick={this.toggleCardCreator}>Add card</MDBDropdownItem>
                {/*<MDBDropdownItem>Copy list</MDBDropdownItem>*/}
                {/*<MDBDropdownItem>Move list</MDBDropdownItem>*/}
                {/*<MDBDropdownItem>Watch</MDBDropdownItem>*/}
                <MDBDropdownItem divider/>
                {/*<MDBDropdownItem>Move all cards in this list</MDBDropdownItem>*/}
                <MDBDropdownItem onClick={this.archiveAllCards}>Archive all cards in this list</MDBDropdownItem>
                <MDBDropdownItem divider/>
                <MDBDropdownItem onClick={this.archiveList}>Archive this list</MDBDropdownItem>
            </MDBDropdownMenu>
        </MDBDropdown>
    }

    view() {
        if (this.state.isLoading) {
            return <MDBCard>
                <MDBCardBody className={"card-body"}>
                    {this.props.list.name}
                    <SmallSpinner/>
                </MDBCardBody>
            </MDBCard>
        }
        return <MDBCard>
            <MDBCardBody>
                {this.listName()}
                {this.dropdown()}
                {this.cardCreator()}
                {this.renderCards()}
            </MDBCardBody>
        </MDBCard>
    }

    renderCards() {
        const items: any[] = [];
        if (this.state.list.cards) {
            this.state.list.cards
                .filter(card => !card.is_archive)
                .forEach(card => {
                        items.push(<Card afterModify={this.cardDeleted.bind(this)} key={card.id} card={card}/>);
                    }
                )
        }
        return items
    }

    render() {
        return <MDBCol xl={"3"} lg={"4"} md={"6"} sm={"6"} size={"12"}>
            {this.view()}
        </MDBCol>;
        
    }

}
