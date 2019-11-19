import React, {Component} from 'react';
import axios from 'axios';
import CardModel from "../../data-models/CardModel";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;

interface Props {
    listId: number
    afterAdd: any
}

interface State {
    cardName: string
    cardNameInputOpened: boolean
}

export default class CreateList extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            cardName: '',
            cardNameInputOpened: false
        };
        this.toggleCardNameInput = this.toggleCardNameInput.bind(this);
        this.nameChanged = this.nameChanged.bind(this);
        this.createCard = this.createCard.bind(this);
    }

    createCard() {
        let card = new CardModel();
        card.name = this.state.cardName;
        card.id_list = this.props.listId;
        this.toggleCardNameInput();
        axios.post('/api/cards/', card).then(
            (resp)=>{this.props.afterAdd(resp.data)}
        );
    }

    toggleCardNameInput() {
        this.setState({cardNameInputOpened: !this.state.cardNameInputOpened})
    }

    nameChanged(e: any) {
        this.setState({cardName: e.target.value});
    }

    view() {
        if (this.state.cardNameInputOpened) {
           return <div className="row">
           <div className={'form-inline'}>
               <input className="form-control" defaultValue={this.state.cardName}
                      onChange={this.nameChanged}/>,
               <button type="button" className="btn btn-success btn-sm" onClick={this.createCard}>
                   <i className="fas fa-check"/>
               </button>,
               <button type="button" className="btn btn-danger btn-sm" onClick={this.toggleCardNameInput}>
                   <i className="far fa-times-circle"/>
               </button>
            </div>
            </div>
        } else {
            return <button type="button" className="btn btn-primary btn-sm" onClick={this.toggleCardNameInput}>
                <i className="fas fa-plus"/>
            </button>
        }
    }

    render() {
        return this.view();
    }
}