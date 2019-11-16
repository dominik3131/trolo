import React, {Component} from 'react';
import CardModel from "../../data-models/CardModel";
import axios from "axios";
import SmallSpinner from "../../utils/SmallSpinner";

interface Props {
    card: CardModel
}

interface State {
    isLoading: boolean
    card: CardModel;
    cardNameInputOpen: boolean,
    toggleCreate: boolean
}

export default class List extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            card: this.props.card,
            cardNameInputOpen: false,
            toggleCreate: false
        };
        this.toggleNameInputCard = this.toggleNameInputCard.bind(this);
        this.nameChangedCards = this.nameChangedCards.bind(this);
        this.updateCardName = this.updateCardName.bind(this);
        this.fetchCard();
    }

    fetchCard() {
        axios.get(`/api/cards/${this.props.card.id}`)
            .then((resp) => {
                this.setState({card: resp.data, isLoading: false});
            });
    }

    toggleNameInputCard() {
        this.setState({cardNameInputOpen: !this.state.cardNameInputOpen})
    }

    updateCardName() {
        console.log("updeicik");
        this.updateCard(this.state.card);
        this.toggleNameInputCard();
    }

    nameChangedCards(e: any) {
        let card = this.state.card;
        card.name = e.target.value;
        this.setState({card: card})
    }

    cardName() {
        if (this.state.cardNameInputOpen) {
            return [
                <input className="form-control" defaultValue={this.state.card.name || ''}
                       onChange={this.nameChangedCards}/>,
                <button type="button" className="btn btn-primary btn-sm" onClick={this.updateCardName}>
                    <i className="fas fa-check"/>
                </button>,
                <button type="button" className="btn btn-danger btn-sm" onClick={this.toggleNameInputCard}>
                    <i className="far fa-times-circle"/>
                </button>
            ]
        } else {
            return null;
        }
    }

    toolbar() {
        return <div className="btn-group btn-group-sm" role="group">
            <button type="button" className="btn btn-primary btn-sm" onClick={this.toggleNameInputCard}>
                <i className="far fa-edit"/>
            </button>
            <button type="button" className="btn btn-primary btn-sm" >
                <i className="fas fa-trash-alt"/>
            </button>
        </div>
    }

    view() {
        if (this.state.isLoading) {
            return <div className="card">
                <div className={"card-body"}>
                    {this.props.card.name}
                    <SmallSpinner/>
                </div>
            </div>
        }
        
        return <div className="card">
            <div className={"card-body"}>
                {this.state.card.name}
                {this.toolbar()}
                {this.cardName()}
                
            </div>
        </div>
    }

    render() {
        return <div>
            {this.view()}
        </div>;
    }

    updateCard(card: CardModel) {
        this.setState({card: card});
        axios.put(`/api/cards/${this.state.card.id}`, card)
            .then((resp) => {
                this.setState({card: resp.data});
           });
    };


}